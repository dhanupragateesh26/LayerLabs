'use client';

import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { UploadCloud, FileType2, CheckCircle, AlertCircle } from 'lucide-react';
import STLViewer from '@/components/STLViewer';

export default function OrderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [volumeMm3, setVolumeMm3] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
    infillDensity: '15%',
    infillPattern: 'Gyroid',
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
    TPU: ['Black', 'White', 'Clear'], // Add more colors as needed
    ABS: ['Black'],
  };

  const infillDensities = ['10%', '15%', '20%', '40%', '60%', '80%', '100%', 'Not sure (we\'ll optimize)'];
  const infillPatterns = ['Grid', 'Gyroid', 'Triangles', 'Cubic'];

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

  // Uses strict 100% infill weight estimation (Multiplied by quantity)
  const calculateWeight = (volumeMm3: number, material: string, qty: number) => {
    const densities: Record<string, number> = {
      PLA: 1.24,
      PETG: 1.27,
      TPU: 1.21,
      ABS: 1.04,
    };
    const density = densities[material] || 1.24;
    const weightGrams = (volumeMm3 / 1000) * density * qty;
    return weightGrams.toFixed(2);
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
        setSubmitSuccess(true);
        setFile(null);
        setFileName('');
        setVolumeMm3(0);
        setFormData({
          name: '', email: '', phone: '', address: '', material: 'PLA', color: 'Grey', infillDensity: '15%', infillPattern: 'Gyroid', quantity: 1, comments: ''
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
      // console.error("REAL ERROR:", err);
      // setSubmitError(err.message || "Unknown error");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="flex-1 w-full bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 relative z-20">

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-secondary to-brand-primary">
            Upload & Configure
          </h1>
          <p className="text-gray-400">Configure your print settings to get started.</p>
        </div>

        {submitSuccess ? (
          <div className="card bg-gray-950 p-12 text-center border-brand-primary/30 max-w-2xl mx-auto">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute w-24 h-24 bg-brand-primary/20 rounded-full blur-xl animate-pulse" />
              <CheckCircle className="w-16 h-16 text-brand-primary relative z-10" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-white">Order Received! 🎉</h2>
            <p className="text-gray-400 mb-4 text-lg leading-relaxed">Your 3D print request has been submitted successfully.</p>
            <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-lg px-5 py-4 mb-8 text-left space-y-2">
              <p className="text-sm text-brand-secondary font-semibold">✉️ &nbsp;Confirmation email sent</p>
              <p className="text-sm text-gray-400">A confirmation with your order summary has been sent to your email. Our team will review your file and send a personalised quote shortly.</p>
            </div>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="btn-outline"
            >
              Submit Another Print
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Left Column: Viewer & Upload */}
            <div className="space-y-6">
              <div className="card bg-gray-950 p-6 border-gray-900">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileType2 className="text-brand-secondary" /> 1. Upload Model
                </h2>

                {/* Drag Drop Zone */}
                <div
                  className={`
                    border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                    ${isDragging
                      ? 'border-brand-primary bg-brand-primary/20 scale-[1.02] shadow-[0_0_50px_rgba(168,85,247,0.3)]'
                      : file
                        ? 'border-brand-primary/50 bg-brand-primary/5 hover:bg-brand-primary/10'
                        : 'border-gray-800 hover:border-gray-600 hover:bg-gray-900'
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
                  <UploadCloud className={`w-14 h-14 mx-auto mb-4 transition-all duration-300 ${isDragging ? 'text-brand-primary scale-110 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]' : 'text-gray-400'}`} />
                  <p className={`text-lg font-medium transition-colors ${isDragging ? 'text-white' : 'text-gray-200'}`}>
                    {isDragging ? 'Drop your .STL file right here!' : file ? 'File selected (Click to replace)' : 'Drag & Drop your .STL file here'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">or click to browse from your computer</p>
                </div>

                {/* File Name Override */}
                {file && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Model Name</label>
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

              {/* Viewer */}
              <div className="card bg-gray-950 p-6 border-gray-900 flex flex-col items-center shadow-xl shadow-brand-primary/5">
                <h2 className="text-xl font-bold mb-4 w-full text-left flex items-center gap-2">
                  <span className="text-brand-primary">🎮</span> 2. 3D Preview
                </h2>
                <div className="w-full h-[400px] mb-4">
                  <STLViewer file={file} onVolumeCalculated={setVolumeMm3} />
                </div>
                {file && volumeMm3 > 0 && (
                  <div className="w-full bg-black border border-gray-800 p-4 rounded-lg flex justify-between items-center mt-2 animate-in fade-in zoom-in-95 duration-500">
                    <div>
                      <p className="text-sm text-gray-500">Volume</p>
                      <p className="font-semibold text-gray-300">{Math.round(volumeMm3).toLocaleString()} mm³</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-sm text-gray-300 font-medium tracking-wide">Est. Solid Weight <span className="text-brand-primary">x{formData.quantity}</span></p>
                      <p className="font-bold text-brand-secondary text-2xl drop-shadow-[0_0_15px_rgba(192,132,252,0.4)]">
                        ~{calculateWeight(volumeMm3, formData.material, formData.quantity as number)} g
                      </p>
                    </div>
                  </div>
                )}
                {file && (
                  <div className="w-full mt-4 space-y-2">
                    <p className="text-xs text-gray-400 bg-gray-900 p-2 rounded-md border border-gray-800 text-center leading-relaxed">
                      <span className="text-yellow-500 font-bold">Note:</span> The weight above is a maximum estimate based on a <span className="text-white font-semibold">100% solid object</span>. Your actual print weight (and cost) will likely be lower depending on your chosen infill density! But <span className="text-white font-semibold">supports</span> can add up if there are floating elements!
                    </p>
                    <p className="text-sm font-semibold text-purple-200 bg-brand-primary/20 border border-brand-primary/40 py-2 px-3 rounded-md text-center shadow-[0_0_15px_rgba(168,85,247,0.15)] flex justify-center items-center gap-2">
                      <span>✨</span> A final, precise quote will be calculated and sent to you later.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Form */}
            <form onSubmit={handleSubmit} className="card bg-gray-950 p-8 border-gray-900 space-y-8">

              {/* Settings Section */}
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-900 pb-2">
                  <span className="text-brand-secondary">⚙️</span> 3. Configuration
                </h2>
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Material</label>
                      <div className="grid grid-cols-2 gap-3">
                        {materials.map(mat => (
                          <label
                            key={mat.id}
                            className={`
                              border rounded-lg p-3 text-center cursor-pointer transition-all bg-black
                              ${mat.disabled ? 'opacity-50 cursor-not-allowed border-gray-900' : 'hover:border-brand-primary border-gray-800 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]'}
                              ${formData.material === mat.id ? 'border-brand-primary bg-brand-primary/10 ring-1 ring-brand-primary shadow-[0_0_20px_rgba(168,85,247,0.2)]' : ''}
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
                            <span className="font-semibold text-gray-200">{mat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Color</label>
                      <select
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="input-field cursor-pointer h-[50px] md:mt-0"
                      >
                        {materialColors[formData.material]?.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Not sure about these settings? Leave them as default and we’ll optimize the print for you.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
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
                      <label className="block text-sm font-medium text-gray-400 mb-1">Infill Density</label>
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
                      <label className="block text-sm font-medium text-gray-400 mb-1">Infill Pattern</label>
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
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-900 pb-2">
                  <span className="text-brand-primary">👤</span> 4. Personal Details
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                      <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Delivery Address</label>
                    <textarea required name="address" value={formData.address} onChange={handleInputChange} className="input-field min-h-[80px]" placeholder="Full shipping address..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      If you have any special requests or goals for your print, let us know.
                    </label>
                    <textarea
                      name="comments"
                      value={formData.comments}
                      onChange={handleInputChange}
                      className="input-field min-h-[120px] text-sm placeholder:text-xs placeholder:text-gray-500 leading-relaxed"
                      placeholder={`You can mention specific settings you'd like adjusted (e.g., more walls, reduced supports), or your main priority—strength, speed, surface finish, or cost.
                      If you’re unsure, just leave it blank and we’ll optimize the print for you automatically.`}
                    />
                  </div>
                </div>
              </section>

              {submitError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-400">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <p className="text-sm">{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading || !file}
                className="btn-primary w-full flex justify-center items-center py-4"
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
              <p className="text-xs text-gray-200 mt-3 text-center">
                Having trouble submitting? You can place your order by messaging us via the contact details below.
              </p>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}
