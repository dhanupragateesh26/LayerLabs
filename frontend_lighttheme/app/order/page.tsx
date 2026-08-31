'use client';

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { UploadCloud, FileType2, CheckCircle, AlertCircle } from 'lucide-react';
import STLViewer from '@/components/STLViewer';

interface OrderSummary {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  material: string;
  color: string;
  infillDensity: string;
  infillPattern: string;
  quantity: number;
  comments?: string;
  stlFileName: string;
  createdAt: string;
  volumeMm3?: number | null;
}

export default function OrderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [volumeMm3, setVolumeMm3] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderSummary | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    material: 'PLA',
    color: 'Grey',
    infillDensity: "default",
    infillPattern: "default",
    quantity: 1,
    comments: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants
  const materials = [
    { id: 'PLA', name: 'PLA', disabled: false },
    { id: 'PETG', name: 'PETG', disabled: false },
    { id: 'TPU', name: 'TPU', disabled: true },
    { id: 'ABS', name: 'ABS (Coming Soon)', disabled: true },
  ];

  const materialColors: Record<string, string[]> = {
    PLA: ['Grey'],
    PETG: ['Black'],
    TPU: ['Black', 'White', 'Clear'],
    ABS: ['Black'],
  };

  const infillDensities = ["default", '10%', '15%', '20%', '40%', '60%', '80%', '100%'];
  const infillPatterns = ["default", 'Grid', 'Gyroid', 'Triangles', 'Cubic'];

  // Handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.toLowerCase().endsWith('.stl')) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
    } else {
      alert('Please upload a valid .stl file');
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.toLowerCase().endsWith('.stl')) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
      } else {
        alert('Please upload a valid .stl file');
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setSubmitError('Please upload an STL file before submitting.');
      return;
    }

    setIsUploading(true);
    setSubmitError('');
    setUploadProgress(10);

    const data = new FormData();
    data.append('stlFile', file, fileName);
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, String(value));
    });

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URL not configured. Please set NEXT_PUBLIC_API_URL in your environment.');
      }

      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        body: data,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.ok) {
        const result = await res.json();
        setSubmittedOrder(result.order ?? null);
        setSubmitSuccess(true);
        setFile(null);
        setFileName('');
        setVolumeMm3(0);
        setFormData({
          name: '', email: '', phone: '', address: '', material: 'PLA', color: 'Grey', infillDensity: "default", infillPattern: "default", quantity: 1, comments: ''
        });
      } else {
        try {
          const errData = await res.json();
          setSubmitError(errData.error || 'Failed to submit order');
        } catch {
          setSubmitError(`Server responded with ${res.status}: ${res.statusText}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message === 'API URL not configured. Please set NEXT_PUBLIC_API_URL in your environment.'
        ? err.message
        : 'Cannot connect to the backend server. Please check your internet connection or try again later.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="flex-1 w-full py-12 px-4 sm:px-6 lg:px-8 bg-transparent relative">
      <div className="max-w-6xl mx-auto space-y-8 relative z-20">

        {/* Page header */}
        <div className="text-center space-y-2 pb-2">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400 font-semibold">3D Printing</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Upload &amp; Configure
          </h1>
          <p className="text-stone-500">Configure your print settings to get started.</p>
        </div>

        {submitSuccess ? (
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Success header */}
            <div className="card p-8 text-center">
              <div className="relative inline-flex items-center justify-center mb-5">
                <div className="absolute w-20 h-20 bg-stone-100 rounded-full" />
                <CheckCircle className="w-14 h-14 text-stone-900 relative z-10" />
              </div>
              <h2 className="text-3xl font-extrabold mb-2 text-stone-900 tracking-tight">Order Received!</h2>
              <p className="text-stone-500 text-base leading-relaxed">
                Your 3D print request has been submitted. We&apos;ll review your file and contact you with a personalised quote soon.
              </p>
            </div>

            {/* Order Summary Card */}
            {submittedOrder && (
              <div className="card p-6 space-y-4">
                <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-2">Order Summary</p>
                <div className="divide-y divide-stone-100 text-sm">
                  {([
                    ['Order ID', <span key="id" className="font-mono text-stone-600 text-xs break-all">{submittedOrder._id}</span>],
                    ['File', submittedOrder.stlFileName],
                    ['Customer', submittedOrder.name],
                    ['Email', submittedOrder.email],
                    ['Phone', submittedOrder.phone],
                    ['Material', submittedOrder.material],
                    ['Color', submittedOrder.color],
                    ['Infill Density', submittedOrder.infillDensity],
                    ['Infill Pattern', submittedOrder.infillPattern],
                    ['Quantity', String(submittedOrder.quantity)],
                    ['Delivery Address', submittedOrder.address],
                    ...(submittedOrder.comments ? [['Special Requests', submittedOrder.comments] as [string, string]] : []),
                    ['Date Submitted', new Date(submittedOrder.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })],
                  ] as [string, React.ReactNode][]).map(([label, value]) => (
                    <div key={label as string} className="flex justify-between gap-4 py-2.5">
                      <span className="text-stone-400 shrink-0 w-36">{label}</span>
                      <span className="text-stone-700 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-stone-600 leading-relaxed">
              ⏰ <span className="font-semibold text-stone-800">Note:</span> Your uploaded STL file is stored securely in the cloud for{' '}
              <span className="font-semibold text-stone-800">24 hours</span>. We&apos;ll download and process it within that window.
            </div>

            <div className="text-center">
              <button
                onClick={() => { setSubmitSuccess(false); setSubmittedOrder(null); }}
                className="btn-outline"
              >
                Submit Another Print
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Left Column: Viewer & Upload */}
            <div className="space-y-5">
              <div className="card p-6">
                <h2 className="text-base font-bold mb-4 flex items-center gap-2 text-stone-900">
                  <FileType2 className="text-stone-500 w-5 h-5" />
                  1. Upload Model
                </h2>

                {/* Drag Drop Zone */}
                <div
                  className={`
                    border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                    ${isDragging
                      ? 'border-[#4f6b43] bg-[#ecf0e6] text-[#4f6b43] scale-[1.01]'
                      : file
                        ? 'border-[#8b7355]/40 bg-white/40 hover:bg-white/60'
                        : 'border-white hover:border-[#8b7355]/40 hover:bg-white/50 bg-white/20'
                    }
                  `}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    accept=".stl"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                  <UploadCloud className={`w-12 h-12 mx-auto mb-3 transition-all duration-200 ${isDragging ? 'text-[#4f6b43] scale-110' : 'text-stone-400'}`} />
                  <p className={`text-base font-medium transition-colors ${isDragging ? 'text-[#4f6b43]' : 'text-stone-600'}`}>
                    {isDragging ? 'Drop your .STL file right here!' : file ? 'File selected — click to replace' : 'Drag & Drop your .STL file here'}
                  </p>
                  <p className="text-sm text-stone-400 mt-1">or click to browse from your computer</p>
                </div>

                {/* File Name Override */}
                {file && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-stone-600 mb-1">Model Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="e.g. Mechanical_Gear_v2.stl"
                    />
                  </div>
                )}
              </div>

              {/* 3D Viewer */}
              <div className="card p-6 flex flex-col items-center">
                <h2 className="text-base font-bold mb-4 w-full text-left flex items-center gap-2 text-stone-900">
                  <span className="text-stone-400">◈</span> 2. 3D Preview
                </h2>
                <div className="w-full h-[380px] mb-4">
                  <STLViewer file={file} onVolumeCalculated={setVolumeMm3} />
                </div>
                {file && volumeMm3 > 0 && (
                  <div className="w-full bg-white/50 border border-white/60 p-4 rounded-xl flex items-center gap-4 mt-1">
                    <div>
                      <p className="text-sm text-stone-500">Model Volume</p>
                      <p className="font-bold text-stone-900 text-2xl tracking-tight">{Math.round(volumeMm3).toLocaleString()} mm³</p>
                    </div>
                  </div>
                )}
                {file && (
                  <div className="w-full mt-4 space-y-2">
                    <p className="text-xs text-stone-600 bg-[#f5f1e8] border border-[#e3dcc8] p-3 rounded-xl leading-relaxed">
                      <span className="text-[#8b7355] font-semibold">⚠ Note:</span> We do not provide material weight because it depends on various factors like{' '}
                      <span className="text-stone-700 font-medium">infill, wall loops, material and supports</span>{' '}
                      — which can only be accurately determined by your slicer software.
                    </p>
                    <p className="text-sm font-medium text-[#6b6255] bg-white/50 border border-white/60 py-2 px-3 rounded-xl text-center flex justify-center items-center gap-2">
                      <span>✦</span> A final, precise quote will be calculated and sent to you later.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Form */}
            <form onSubmit={handleSubmit} className="card p-8 space-y-8 bg-white/60">

              {/* Settings Section */}
              <section>
                <h2 className="text-base font-bold mb-5 flex items-center gap-2 text-stone-900 border-b border-stone-100 pb-3">
                  <span className="text-stone-400">⚙</span> 3. Configuration
                </h2>
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Material */}
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-2">Material</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {materials.map(mat => (
                          <label
                            key={mat.id}
                            className={`
                              border rounded-xl p-3 text-center cursor-pointer transition-all
                              ${mat.disabled ? 'opacity-40 cursor-not-allowed border-white/50 bg-white/30' :
                                formData.material === mat.id
                                  ? 'border-[#4f6b43] bg-[#4f6b43] text-white shadow-[0_4px_12px_rgba(79,107,67,0.2)]'
                                  : 'border-white/60 bg-white/50 hover:border-[#8b7355]/40 hover:bg-white/80'
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name="material"
                              value={mat.id}
                              disabled={mat.disabled}
                              checked={formData.material === mat.id}
                              onChange={(e) => {
                                const newMat = e.target.value;
                                setFormData({
                                  ...formData,
                                  material: newMat,
                                  color: materialColors[newMat][0] || 'Black'
                                });
                              }}
                              className="hidden"
                            />
                            <span className={`font-semibold text-sm ${formData.material === mat.id ? 'text-white' : 'text-stone-700'}`}>
                              {mat.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-2">Color</label>
                      <select
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="input-field cursor-pointer h-[50px]"
                      >
                        {materialColors[formData.material]?.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-stone-400">
                    Not sure about these settings? Leave them as default and we&apos;ll optimise the print for you.
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">Infill Density</label>
                      <select
                        name="infillDensity"
                        value={formData.infillDensity}
                        onChange={handleInputChange}
                        className="input-field cursor-pointer"
                      >
                        {infillDensities.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">Infill Pattern</label>
                      <select
                        name="infillPattern"
                        value={formData.infillPattern}
                        onChange={handleInputChange}
                        className="input-field cursor-pointer"
                      >
                        {infillPatterns.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Details Section */}
              <section>
                <h2 className="text-base font-bold mb-5 flex items-center gap-2 text-stone-900 border-b border-stone-100 pb-3">
                  <span className="text-stone-400">◎</span> 4. Personal Details
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">Name</label>
                      <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-600 mb-1">Phone Number</label>
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">Delivery Address</label>
                    <textarea required name="address" value={formData.address} onChange={handleInputChange} className="input-field min-h-[80px]" placeholder="Full shipping address..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-600 mb-1">
                      Special requests or goals for your print
                    </label>
                    <textarea
                      name="comments"
                      value={formData.comments}
                      onChange={handleInputChange}
                      className="input-field min-h-[110px] text-sm placeholder:text-xs leading-relaxed"
                      placeholder={`Mention specific settings (e.g., more walls, reduced supports), or your main priority — strength, speed, surface finish, or cost. Leave blank and we'll optimise for you.`}
                    />
                  </div>
                </div>
              </section>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-600">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading || !file}
                className="btn-primary w-full flex justify-center items-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading... {uploadProgress}%
                  </div>
                ) : (
                  'Submit Order Request'
                )}
              </button>
              <p className="text-sm text-stone-400 text-center">
                Having trouble? Place your order via the contact details in the footer.
              </p>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
