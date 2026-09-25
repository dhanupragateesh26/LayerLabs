require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { GridFSBucket, ObjectId } = require('mongodb');
const cors = require('cors');
const multer = require('multer');
const { Resend } = require('resend');
const { Readable } = require('stream');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;
let gfsBucket;

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// ── CORS ──────────────────────────────────────────────────────────────────────
const rawOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
const allowedOrigins = rawOrigins.split(',').map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow localhost and 127.0.0.1 on any port during local development
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
      // Allow Vercel preview and deployment domains
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Multer (Memory Storage for STL & Lithophane Photos) ───────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    const ext = file.originalname.toLowerCase();
    if (
      ext.endsWith('.stl') ||
      ext.endsWith('.jpg') ||
      ext.endsWith('.jpeg') ||
      ext.endsWith('.png') ||
      ext.endsWith('.webp')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .stl, .jpg, .png, and .webp files are allowed'));
    }
  },
});

// ── Database + GridFS ─────────────────────────────────────────────────────────
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.warn('⚠️  MONGODB_URI is not set. Please configure this environment variable.');
} else {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('✅  MongoDB connected successfully');
      gfsBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'stl_uploads' });
      console.log('✅  GridFS bucket ready');
      startCleanupJob();
    })
    .catch((err) => {
      console.error('❌  MongoDB connection error:', err.message);
    });
}

// ── GridFS Helpers ────────────────────────────────────────────────────────────
function uploadToGridFS(buffer, filename, contentType = 'application/octet-stream') {
  return new Promise((resolve, reject) => {
    if (!gfsBucket) {
      return reject(new Error('GridFS bucket not initialized'));
    }
    const uploadStream = gfsBucket.openUploadStream(filename, {
      contentType,
    });
    Readable.from(buffer).pipe(uploadStream);
    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.on('error', reject);
  });
}

async function deleteFromGridFS(fileId) {
  try {
    if (!gfsBucket || !fileId) return;
    await gfsBucket.delete(new mongoose.Types.ObjectId(fileId));
    console.log(`🗑️  GridFS file deleted: ${fileId}`);
  } catch (err) {
    console.error(`⚠️  Failed to delete GridFS file ${fileId}:`, err.message);
  }
}

// ── Email Receipts (Single & Cart Orders) ────────────────────────────────────
async function sendCartOrderConfirmationEmail(order, req) {
  if (!resend) {
    console.log('📧  RESEND_API_KEY not configured — confirmation emails disabled.');
    return;
  }

  const orderDate = new Date(order.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const proto = (req && req.headers['x-forwarded-proto']) || (req && req.protocol) || 'https';
  const host = (req && req.get('host')) || process.env.BACKEND_URL || 'https://layerlabs.onrender.com';
  const backendUrl = host.startsWith('http') ? host : `${proto}://${host}`;

  const itemsHtml = (order.items || [])
    .map((item, idx) => {
      const fileLink = item.fileId
        ? `<div style="margin-top:4px;"><a href="${backendUrl}/api/files/${item.fileId}" style="color:#22c55e;font-size:12px;text-decoration:none;">⬇️ Download STL File (${item.fileName || 'model.stl'})</a></div>`
        : '';
      const imageLink = item.imageFileId
        ? `<div style="margin-top:4px;"><a href="${backendUrl}/api/files/${item.imageFileId}" style="color:#38bdf8;font-size:12px;text-decoration:none;">📷 Download Custom Photo (${item.options?.uploadedImageName || 'photo.jpg'})</a></div>`
        : '';

      const specs = [];
      if (item.options?.sizeName) specs.push(`Size: ${item.options.sizeName} (${item.options.sizeDimension})`);
      if (item.options?.color) specs.push(`Color: ${item.options.color}`);
      if (item.options?.design) specs.push(`Design: ${item.options.design}`);
      if (item.material) specs.push(`Material: ${item.material} (${item.color || 'White'})`);
      if (item.infillDensity) specs.push(`Infill: ${item.infillDensity}`);
      if (item.options?.customNote) specs.push(`Note: ${item.options.customNote}`);

      return `
        <tr style="border-bottom:1px solid #27272a;">
          <td style="padding:12px 0;vertical-align:top;width:60%;">
            <strong style="color:#ffffff;font-size:14px;">${idx + 1}. ${item.title}</strong>
            <div style="color:#9ca3af;font-size:12px;margin-top:3px;line-height:1.4;">
              ${specs.join(' · ')}
            </div>
            ${fileLink}
            ${imageLink}
          </td>
          <td style="padding:12px 0;vertical-align:top;text-align:center;color:#e5e7eb;font-size:13px;width:15%;">
            ×${item.quantity}
          </td>
          <td style="padding:12px 0;vertical-align:top;text-align:right;color:#4ade80;font-weight:bold;font-size:14px;width:25%;">
            ${item.type === 'catalog' ? `₹${(item.numericPrice || 0) * item.quantity}` : 'Quote on Review'}
          </td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#09090b;color:#e5e7eb;padding:32px;border-radius:12px;border:1px solid #27272a;">
      <div style="text-align:center;margin-bottom:28px;">
        <h1 style="color:#22c55e;font-size:26px;margin:0;letter-spacing:-0.5px;">LayerLabs</h1>
        <p style="color:#6b7280;margin:6px 0 0;font-size:13px;">Custom 3D Designing & Printing Solutions</p>
      </div>

      <h2 style="color:#ffffff;font-size:18px;border-bottom:1px solid #27272a;padding-bottom:12px;margin-top:0;">
        ✅ Order & Customization Request Received
      </h2>

      <p style="color:#d1d5db;">Hi <strong style="color:#fff;">${order.name}</strong>,</p>
      <p style="color:#d1d5db;line-height:1.6;">Thank you for your order! We've received your request with your configured 3D products and uploaded files. Our team will review your specifications and contact you shortly.</p>

      <div style="background:#18181b;border:1px solid #27272a;border-radius:8px;padding:20px;margin:24px 0;">
        <p style="color:#22c55e;margin:0 0 14px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Customer Details</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
          <tr><td style="color:#6b7280;padding:5px 0;width:35%;">Order ID</td><td style="color:#4ade80;font-family:monospace;">${order._id}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">Name</td><td style="color:#e5e7eb;">${order.name}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">Email</td><td style="color:#e5e7eb;">${order.email}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">Phone</td><td style="color:#e5e7eb;">${order.phone}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">Delivery Address</td><td style="color:#e5e7eb;">${order.address}</td></tr>
          <tr><td style="color:#6b7280;padding:5px 0;">Submitted On</td><td style="color:#e5e7eb;">${orderDate}</td></tr>
          ${order.comments ? `<tr><td style="color:#6b7280;padding:5px 0;">Notes</td><td style="color:#e5e7eb;">${order.comments}</td></tr>` : ''}
        </table>

        <p style="color:#22c55e;margin:0 0 14px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Itemized Summary</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="border-bottom:1px solid #3f3f46;color:#a1a1aa;font-size:12px;text-transform:uppercase;">
              <th style="padding-bottom:8px;text-align:left;">Item</th>
              <th style="padding-bottom:8px;text-align:center;">Qty</th>
              <th style="padding-bottom:8px;text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        ${
          order.totalAmount > 0
            ? `<div style="margin-top:16px;padding-top:12px;border-top:1px solid #27272a;text-align:right;color:#ffffff;font-size:15px;font-weight:bold;">
                Catalogue Total: <span style="color:#4ade80;">₹${order.totalAmount}</span>
              </div>`
            : ''
        }
      </div>

      <div style="background:#0f1712;border:1px solid #22c55e30;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
        <p style="color:#4ade80;margin:0;font-size:13px;line-height:1.5;">
          ⏰ <strong>Note:</strong> Uploaded 3D files and custom photos are stored securely for <strong>24 hours</strong> during which our team prepares the print job.
        </p>
      </div>

      <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #27272a;">
        <p style="color:#4b5563;font-size:12px;margin:0;">© ${new Date().getFullYear()} LayerLabs · All rights reserved</p>
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'LayerLabs <onboarding@resend.dev>',
      to: 'dhanupragateesh.k2006@gmail.com',
      subject: `[LayerLabs] New Order Received (${order.items?.length || 1} items) — ${order.name}`,
      html,
    });

    if (error) {
      console.error('📧  Resend Email send failed:', error.message);
      return;
    }
    console.log(`📧  Confirmation email sent via Resend (ID: ${data?.id})`);
  } catch (err) {
    console.error('📧  Resend Crash:', err.message);
  }
}

// ── Auto-Delete STL/Image files after 24 hours ──────────────────────────────
function startCleanupJob() {
  const MAX_AGE_MS = 24 * 60 * 60 * 1000;

  async function cleanup() {
    try {
      const cutoff = new Date(Date.now() - MAX_AGE_MS);
      const orders = await Order.find({ createdAt: { $lt: cutoff } });

      let deletedCount = 0;
      for (const order of orders) {
        if (order.stlFileId) {
          await deleteFromGridFS(order.stlFileId);
          order.stlFileId = null;
          deletedCount++;
        }
        if (order.items && order.items.length > 0) {
          for (const item of order.items) {
            if (item.fileId) {
              await deleteFromGridFS(item.fileId);
              item.fileId = null;
              deletedCount++;
            }
            if (item.imageFileId) {
              await deleteFromGridFS(item.imageFileId);
              item.imageFileId = null;
              deletedCount++;
            }
          }
        }
        await order.save();
      }
      if (deletedCount > 0) console.log(`🧹 Cleanup: removed ${deletedCount} file(s) older than 24h`);
    } catch (err) {
      console.error('Cleanup job error:', err.message);
    }
  }

  cleanup();
  setInterval(cleanup, 60 * 60 * 1000);
}

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: isDbConnected ? 'ok' : 'degraded',
    database: isDbConnected ? 'connected' : 'disconnected',
    storage: gfsBucket ? 'ready' : 'unavailable',
    uptime: process.uptime(),
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────

/** POST /api/cart-orders — Unified multi-item cart submission with STLs & custom photos */
app.post('/api/cart-orders', upload.any(), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database service is temporarily unavailable. Please try again in a few moments.',
      });
    }

    const { name, email, phone, address, comments, itemsJson } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({ error: 'Name, email, phone, and delivery address are required.' });
    }

    let parsedItems = [];
    if (itemsJson) {
      try {
        parsedItems = JSON.parse(itemsJson);
      } catch (e) {
        console.error('Failed to parse itemsJson:', e);
      }
    }

    const uploadedFiles = req.files || [];
    const processedItems = [];
    let totalAmount = 0;

    for (let i = 0; i < parsedItems.length; i++) {
      const item = parsedItems[i];
      let fileId = null;
      let imageFileId = null;

      if (item.type === 'custom_print') {
        // Find matching STL file from uploaded files
        const stlFile = uploadedFiles.find(
          (f) =>
            f.fieldname === 'stlFiles' &&
            (f.originalname === item.fileName || f.originalname.includes(item.fileName) || f.originalname.startsWith(`custom_${item.index}_`))
        );

        if (stlFile) {
          fileId = await uploadToGridFS(stlFile.buffer, item.fileName || stlFile.originalname, 'application/octet-stream');
        }
      } else if (item.type === 'catalog') {
        totalAmount += (item.numericPrice || 0) * (item.quantity || 1);

        // Check if a custom photo was uploaded for lithophane
        const imgFile = uploadedFiles.find(
          (f) =>
            f.fieldname === 'imageFiles' &&
            (f.originalname.startsWith(`litho_${item.index}_`) || f.originalname.includes(item.options?.uploadedImageName || ''))
        );

        if (imgFile) {
          imageFileId = await uploadToGridFS(imgFile.buffer, imgFile.originalname, imgFile.mimetype || 'image/jpeg');
        }
      }

      processedItems.push({
        type: item.type,
        title: item.title,
        productId: item.productId,
        price: item.price,
        numericPrice: item.numericPrice || 0,
        quantity: item.quantity || 1,
        options: item.options || {},
        material: item.material,
        color: item.color,
        infillDensity: item.infillDensity,
        infillPattern: item.infillPattern,
        volumeMm3: item.volumeMm3,
        comments: item.comments,
        fileName: item.fileName,
        fileId,
        imageFileId,
      });
    }

    const newOrder = new Order({
      name,
      email,
      phone,
      address,
      comments: comments || '',
      orderType: 'cart',
      items: processedItems,
      totalAmount,
    });

    await newOrder.save();

    // Send itemized confirmation email
    sendCartOrderConfirmationEmail(newOrder, req);

    res.status(201).json({
      message: 'Thank you! Your cart order has been received.',
      orderId: newOrder._id,
      order: newOrder,
    });
  } catch (error) {
    console.error('Cart order submission error:', error);
    res.status(500).json({ error: 'Internal server error while processing your cart order.' });
  }
});

/** POST /api/orders — Legacy Single STL order */
app.post('/api/orders', upload.single('stlFile'), async (req, res) => {
  try {
    const { name, email, phone, address, material, color, infillDensity, infillPattern, quantity, comments, volumeMm3 } = req.body;

    if (!req.file) return res.status(400).json({ error: 'STL file is required' });

    if (mongoose.connection.readyState !== 1 || !gfsBucket) {
      return res.status(503).json({
        error: 'Database storage service is temporarily unavailable. Please try again in a few moments.',
      });
    }

    const gridFsId = await uploadToGridFS(req.file.buffer, req.file.originalname, 'application/octet-stream');

    const newOrder = new Order({
      name,
      email,
      phone,
      address,
      material,
      color,
      infillDensity,
      infillPattern,
      quantity: Number(quantity) || 1,
      comments: comments || '',
      volumeMm3: Number(volumeMm3) || null,
      stlFileName: req.file.originalname,
      stlFileId: gridFsId,
      orderType: 'single',
    });

    await newOrder.save();

    // Fire email
    sendCartOrderConfirmationEmail(
      {
        ...newOrder.toObject(),
        items: [
          {
            type: 'custom_print',
            title: `Custom STL Print (${req.file.originalname})`,
            material,
            color,
            infillDensity,
            infillPattern,
            quantity: Number(quantity) || 1,
            fileName: req.file.originalname,
            fileId: gridFsId,
          },
        ],
      },
      req
    );

    res.status(201).json({
      message: 'Thank you! Your request has been received.',
      orderId: newOrder._id,
      order: newOrder,
    });
  } catch (error) {
    console.error('Order submission error:', error);
    res.status(500).json({ error: 'Internal server error while processing your order.' });
  }
});

/** GET /api/files/:fileId — Download any GridFS file (STL or Photo) */
app.get('/api/files/:fileId', async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (!gfsBucket) return res.status(503).json({ error: 'Storage service currently unavailable.' });

    if (!mongoose.Types.ObjectId.isValid(req.params.fileId)) {
      return res.status(400).json({ error: 'Invalid file ID format.' });
    }

    const objectId = new mongoose.Types.ObjectId(req.params.fileId);
    const files = await gfsBucket.find({ _id: objectId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found or expired.' });
    }

    const file = files[0];
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');

    gfsBucket.openDownloadStream(objectId).pipe(res);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ error: 'Failed to retrieve file.' });
  }
});

/** GET /api/orders/:id/file — Backwards compatible single file download */
app.get('/api/orders/:id/file', async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID format.' });
    }

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

/** GET /api/orders — List all orders */
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).select('-__v');
    res.json(orders);
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
