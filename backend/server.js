require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { Readable } = require('stream');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;
let gfsBucket;
let emailTransporter = null;

// ── CORS ──────────────────────────────────────────────────────────────────────
const rawOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
const allowedOrigins = rawOrigins.split(',').map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Multer (memory — no disk, files go straight to GridFS) ───────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.originalname.toLowerCase().endsWith('.stl')) cb(null, true);
    else cb(new Error('Only .stl files are allowed'));
  },
});

// ── Database + GridFS ─────────────────────────────────────────────────────────
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('❌  MONGODB_URI is not set. Please configure this environment variable.');
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('✅  MongoDB connected successfully');
    gfsBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'stl_uploads' });
    console.log('✅  GridFS bucket ready');
    initEmailTransporter();
    startCleanupJob();
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });

// ── Email ─────────────────────────────────────────────────────────────────────
function initEmailTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧  Email credentials not configured — confirmation emails disabled.');
    return;
  }
  emailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  emailTransporter.verify((error, success) => {
    if (error) {
      console.error('❌  Email transporter configuration error:', error);
    } else {
      console.log('✅  Email transporter ready and verified');
    }
  });
}

async function sendOrderConfirmationEmail(order, req) {
  if (!emailTransporter) return;

  const orderDate = new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
  // Derive the backend URL from the request so the link always works regardless of environment
  const proto = (req && req.headers['x-forwarded-proto']) || (req && req.protocol) || 'https';
  const host  = (req && req.get('host')) || process.env.BACKEND_URL || 'https://layerlabs.onrender.com';
  const backendUrl = host.startsWith('http') ? host : `${proto}://${host}`;
  const downloadUrl = `${backendUrl}/api/orders/${order._id}/file`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#09090b;color:#e5e7eb;padding:32px;border-radius:12px;border:1px solid #27272a;">
      <div style="text-align:center;margin-bottom:28px;">
        <h1 style="color:#a855f7;font-size:26px;margin:0;letter-spacing:-0.5px;">LayerLabs</h1>
        <p style="color:#6b7280;margin:6px 0 0;font-size:13px;">3D Printing Service</p>
      </div>

      <h2 style="color:#ffffff;font-size:18px;border-bottom:1px solid #27272a;padding-bottom:12px;margin-top:0;">
        ✅ Order Received
      </h2>

      <p style="color:#d1d5db;">Hi <strong style="color:#fff;">${order.name}</strong>,</p>
      <p style="color:#d1d5db;line-height:1.6;">Thank you for your order! We've received your 3D print request and will review it shortly. You'll be contacted with a personalised quote soon.</p>

      <div style="background:#18181b;border:1px solid #27272a;border-radius:8px;padding:20px;margin:24px 0;">
        <p style="color:#a855f7;margin:0 0 14px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Order Summary</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="color:#6b7280;padding:5px 0;width:40%;">Order ID</td><td style="color:#c084fc;font-family:monospace;">${order._id}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">File</td><td style="color:#e5e7eb;">${order.stlFileName}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">Material</td><td style="color:#e5e7eb;">${order.material}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">Color</td><td style="color:#e5e7eb;">${order.color}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">Infill Density</td><td style="color:#e5e7eb;">${order.infillDensity}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">Infill Pattern</td><td style="color:#e5e7eb;">${order.infillPattern}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">Quantity</td><td style="color:#e5e7eb;">${order.quantity}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">Date Submitted</td><td style="color:#e5e7eb;">${orderDate}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">Delivery Address</td><td style="color:#e5e7eb;">${order.address}</td></tr>
          ${order.comments ? `<tr><td style="color:#6b7280;padding:5px 0;">Special Requests</td><td style="color:#e5e7eb;">${order.comments}</td></tr>` : ''}
        </table>

        <div style="margin-top:16px;padding-top:16px;border-top:1px solid #27272a;">
          <p style="color:#a855f7;margin:0 0 5px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">File Access</p>
          <a href="${downloadUrl}" style="color:#60a5fa;text-decoration:none;font-size:13px;">⬇️ Click here to download the .STL file</a>
        </div>
      </div>

      <div style="background:#1a0f2e;border:1px solid #a855f730;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
        <p style="color:#c084fc;margin:0;font-size:13px;line-height:1.5;">
          ⏰ <strong>Note:</strong> Your uploaded STL file is stored securely in the cloud for <strong>24 hours</strong>. Our team will download and process it within that window.
        </p>
      </div>

      <p style="color:#d1d5db;font-size:14px;">We'll reach out to you at <strong style="color:#fff;">${order.email}</strong> or <strong style="color:#fff;">${order.phone}</strong> with your quote.</p>

      <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #27272a;">
        <p style="color:#4b5563;font-size:12px;margin:0;">© ${new Date().getFullYear()} LayerLabs · All rights reserved</p>
      </div>
    </div>
  `;

  try {
    await emailTransporter.sendMail({
      from: `"LayerLabs" <${process.env.EMAIL_USER}>`,
      to: order.email,
      bcc: 'dhanupragateesh.k2006@gmail.com, smuthiahkarthik@gmail.com', // owners get a silent copy of every order
      subject: `[LayerLabs] Order Received — ${order.stlFileName}`,
      html,
    });
    console.log(`📧  Confirmation email sent → ${order.email}`);
  } catch (err) {
    // Email failure must NOT block the order response
    console.error('📧  Email send failed:', err.message);
  }
}

// ── GridFS Helpers ────────────────────────────────────────────────────────────
function uploadToGridFS(buffer, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = gfsBucket.openUploadStream(filename, {
      contentType: 'application/octet-stream',
    });
    Readable.from(buffer).pipe(uploadStream);
    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.on('error', reject);
  });
}

async function deleteFromGridFS(fileId) {
  try {
    await gfsBucket.delete(new mongoose.Types.ObjectId(fileId));
    console.log(`🗑️  GridFS file deleted: ${fileId}`);
  } catch (err) {
    console.error(`⚠️  Failed to delete GridFS file ${fileId}:`, err.message);
  }
}

// ── Auto-Delete STL files after 24 hours ─────────────────────────────────────
function startCleanupJob() {
  const MAX_AGE_MS = 24 * 60 * 60 * 1000;

  async function cleanup() {
    try {
      const cutoff = new Date(Date.now() - MAX_AGE_MS);
      const orders = await Order.find({ stlFileId: { $ne: null }, createdAt: { $lt: cutoff } });
      for (const order of orders) {
        await deleteFromGridFS(order.stlFileId);
        order.stlFileId = null;
        await order.save();
      }
      if (orders.length > 0) console.log(`🧹 Cleanup: removed ${orders.length} STL file(s) older than 24h`);
      else console.log('🧹 Cleanup ran — no files to delete.');
    } catch (err) {
      console.error('Cleanup job error:', err.message);
    }
  }

  cleanup();
  setInterval(cleanup, 60 * 60 * 1000);
}

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ── Routes ────────────────────────────────────────────────────────────────────

/** POST /api/orders */
app.post('/api/orders', upload.single('stlFile'), async (req, res) => {
  try {
    const { name, email, phone, address, material, color, infillDensity, infillPattern, quantity, comments } = req.body;

    if (!req.file) return res.status(400).json({ error: 'STL file is required' });

    const gridFsId = await uploadToGridFS(req.file.buffer, req.file.originalname);

    const newOrder = new Order({
      name, email, phone, address, material, color, infillDensity, infillPattern, quantity, comments,
      stlFileName: req.file.originalname,
      stlFileId: gridFsId,
    });

    await newOrder.save();

    // Fire-and-forget — email should never block the API response
    sendOrderConfirmationEmail(newOrder, req);

    res.status(201).json({
      message: 'Thank you! Your request has been received. You will be contacted soon.',
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error('Order submission error:', error);
    res.status(500).json({ error: 'Internal server error while processing your order.' });
  }
});

/** GET /api/orders/:id/file — download the STL (owner use, within 24h) */
app.get('/api/orders/:id/file', async (req, res) => {
  try {
    // Allow any origin so email-client links work without CORS blocks
    res.setHeader('Access-Control-Allow-Origin', '*');

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!order.stlFileId) return res.status(410).json({ error: 'STL file has already been deleted (>24h after order).' });

    res.setHeader('Content-Disposition', `attachment; filename="${order.stlFileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    gfsBucket.openDownloadStream(new mongoose.Types.ObjectId(order.stlFileId)).pipe(res);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ error: 'Failed to retrieve file.' });
  }
});

/** GET /api/orders — list all orders with their download URLs (admin) */
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).select('-__v');
    const proto = req.headers['x-forwarded-proto'] || req.protocol;
    const host  = req.get('host');
    const base  = host.startsWith('http') ? host : `${proto}://${host}`;
    const result = orders.map(o => ({
      ...o.toObject(),
      downloadUrl: o.stlFileId ? `${base}/api/orders/${o._id}/file` : null,
    }));
    res.json(result);
  } catch (error) {
    console.error('List orders error:', error);
    res.status(500).json({ error: 'Failed to list orders.' });
  }
});

// ── Start Server ──────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀  Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully...');
  server.close(() => mongoose.connection.close(false, () => process.exit(0)));
});
