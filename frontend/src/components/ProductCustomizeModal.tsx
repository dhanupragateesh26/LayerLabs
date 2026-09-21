'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductSize, ProductDesign } from '@/data/products';
import { useCart } from '@/context/CartContext';
import {
  X,
  Plus,
  Minus,
  Check,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Ruler,
  Palette,
  ShoppingBag,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';

interface ProductCustomizeModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductCustomizeModal({
  product,
  isOpen,
  onClose,
}: ProductCustomizeModalProps) {
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedDesign, setSelectedDesign] = useState<ProductDesign | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [customNote, setCustomNote] = useState<string>('');

  // Active Hero Image State
  const [activeImage, setActiveImage] = useState<string>('');

  // Lithophane Photo Upload
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize state when product changes
  useEffect(() => {
    if (product) {
      const defaultSize = product.sizes.find((s) => s.isDefault) || product.sizes[0];
      setSelectedSize(defaultSize);

      let initialImg = product.img;

      if (product.designs && product.designs.length > 0) {
        const initialDesign = product.designs[0];
        setSelectedDesign(initialDesign);
        if (initialDesign.previewImg) {
          initialImg = initialDesign.previewImg;
        }
      } else {
        setSelectedDesign(null);
      }

      if (product.colors && product.colors.length > 0) {
        const initialColor = product.colors[0];
        setSelectedColor(initialColor.name);
        if (initialColor.previewImg && (!product.designs || product.designs.length === 0)) {
          initialImg = initialColor.previewImg;
        }
      } else {
        setSelectedColor('');
      }

      setActiveImage(initialImg);
      setQuantity(1);
      setCustomNote('');
      setUploadedImage(null);
      setImagePreview(null);
      setImageError('');
    }
  }, [product]);

  if (!product) return null;

  // Aggregate all unique gallery images
  const allImages: string[] = Array.from(
    new Set([
      product.img,
      ...(product.images || []),
      ...(product.designs?.map((d) => d.previewImg).filter(Boolean) as string[] || []),
      ...(product.colors?.map((c) => c.previewImg).filter(Boolean) as string[] || []),
      ...(imagePreview ? [imagePreview] : []),
    ])
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setImageError('Please select a valid image file (JPG, PNG, WEBP)');
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setImageError('Image size exceeds 25MB limit.');
        return;
      }
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setActiveImage(result); // Instantly switch hero image to user photo!
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setActiveImage(product.img);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSelectDesign = (design: ProductDesign) => {
    setSelectedDesign(design);
    if (design.previewImg) {
      setActiveImage(design.previewImg);
    }
  };

  const handleSelectColor = (color: { name: string; hex: string; previewImg?: string }) => {
    setSelectedColor(color.name);
    if (color.previewImg) {
      setActiveImage(color.previewImg);
    }
  };

  const unitPrice = selectedSize ? selectedSize.price : product.basePrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (product.allowImageUpload && !uploadedImage) {
      setImageError('Please upload a photo for your custom lithophane lamp.');
      return;
    }

    addToCart({
      productId: product.id,
      title: product.title,
      price: `₹${unitPrice}`,
      numericPrice: unitPrice,
      img: activeImage || product.img,
      badges: product.badges,
      quantity,
      imageFile: uploadedImage || undefined,
      options: {
        sizeName: selectedSize?.name,
        sizeDimension: selectedSize?.dimension,
        color: selectedColor || undefined,
        design: selectedDesign?.name,
        uploadedImageName: uploadedImage?.name,
        uploadedImagePreview: imagePreview || undefined,
        customNote: customNote.trim() || undefined,
      },
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 flex flex-col max-h-[92vh]"
          >
            {/* ── FULL WIDTH END-TO-END HERO IMAGE BANNER ── */}
            <div className="relative w-full h-64 sm:h-80 md:h-88 bg-stone-900 flex-shrink-0 overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={product.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full h-full object-cover select-none"
                />
              </AnimatePresence>

              {/* Gradient Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-stone-950/40 pointer-events-none" />

              {/* Top Navigation Floating Overlay */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-stone-900/80 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/15 shadow-sm">
                    {product.customizationType === 'lamp' ? 'Parametric Lamp' : product.customizationType === 'lithophane' ? 'Lithophane Custom' : 'Custom 3D Print'}
                  </span>
                  <span className="px-3 py-1 bg-[#4f6b43]/90 backdrop-blur-md text-white text-xs font-black rounded-full border border-white/15 shadow-sm">
                    ₹{unitPrice}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-stone-900/70 hover:bg-stone-900/95 backdrop-blur-md text-white hover:text-white flex items-center justify-center transition-all border border-white/20 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Bottom Title Overlay */}
              <div className="absolute bottom-4 inset-x-4 z-20">
                <div className="text-white drop-shadow-md">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                    {product.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {product.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold bg-white/20 backdrop-blur-md text-stone-100 px-2 py-0.5 rounded-md border border-white/20"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── SCROLLABLE CUSTOMIZATION OPTIONS ── */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#FAF8F5]">

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-white/70 p-3.5 rounded-2xl border border-stone-200/80">
                {product.desc}
              </p>

              {/* 1. SIZE SELECTOR WITH DYNAMIC PRICING */}
              <div>
                <label className="flex items-center justify-between text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                  <div className="flex items-center gap-2">
                    <Ruler size={15} className="text-[#4f6b43]" />
                    <span>Choose Size & Dimensions</span>
                  </div>
                  {selectedSize && (
                    <span className="text-[#4f6b43] font-bold lowercase">({selectedSize.dimension})</span>
                  )}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize?.name === size.name;
                    return (
                      <button
                        key={size.name}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                          isSelected
                            ? 'bg-[#ecf0e6] border-[#4f6b43] text-stone-950 shadow-sm ring-1 ring-[#4f6b43]'
                            : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <div className="font-bold text-xs">{size.name}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">{size.dimension}</div>
                        <div className="font-black text-sm text-[#4f6b43] mt-2">₹{size.price}</div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#4f6b43] text-white flex items-center justify-center text-[10px]">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. LAMP GEOMETRIC DESIGN SELECTOR (IF APPLICABLE) */}
              {product.designs && product.designs.length > 0 && (
                <div>
                  <label className="flex items-center justify-between text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                    <div className="flex items-center gap-2">
                      <Layers size={15} className="text-[#4f6b43]" />
                      <span>Choose Geometric Design</span>
                    </div>
                    {selectedDesign && (
                      <span className="text-[#4f6b43] font-bold">({selectedDesign.name})</span>
                    )}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.designs.map((design) => {
                      const isSelected = selectedDesign?.id === design.id;
                      return (
                        <button
                          key={design.id}
                          type="button"
                          onClick={() => handleSelectDesign(design)}
                          className={`p-3.5 rounded-2xl border text-left transition-all relative flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-[#ecf0e6] border-[#4f6b43] text-stone-950 shadow-sm ring-1 ring-[#4f6b43]'
                              : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          {design.previewImg && (
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                              <img src={design.previewImg} alt={design.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs leading-tight">{design.name}</div>
                            <div className="text-[11px] text-stone-500 mt-1 line-clamp-2">{design.desc}</div>
                          </div>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-[#4f6b43] text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                              <Check size={10} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. COLOR / BASE THEME SELECTOR */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="flex items-center justify-between text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                    <div className="flex items-center gap-2">
                      <Palette size={15} className="text-[#4f6b43]" />
                      <span>{product.customizationType === 'lithophane' ? 'LED Light & Base Option' : 'Choose Color'}</span>
                    </div>
                    {selectedColor && <span className="text-[#4f6b43] font-bold">({selectedColor})</span>}
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => handleSelectColor(color)}
                          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-stone-900 text-white border-stone-900 shadow-sm scale-102'
                              : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-stone-300 shadow-inner flex-shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                          {isSelected && <Check size={12} strokeWidth={3} className="ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. LITHOPHANE PHOTO UPLOAD DROPZONE */}
              {product.allowImageUpload && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    <ImageIcon size={15} className="text-[#4f6b43]" />
                    <span>Upload Picture For Lithophane *</span>
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                  />

                  {!imagePreview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-stone-300 hover:border-[#4f6b43] bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#ecf0e6] text-[#4f6b43] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Upload size={22} />
                      </div>
                      <div className="font-bold text-xs text-stone-800 mb-1">
                        Click or Drag & Drop photo here
                      </div>
                      <div className="text-[11px] text-stone-400">
                        Supports high-resolution JPG, PNG, WEBP (Max 25MB)
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                        <img src={imagePreview} alt="Upload preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-stone-900 truncate">{uploadedImage?.name}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {((uploadedImage?.size || 0) / (1024 * 1024)).toFixed(2)} MB · Photo ready for 3D conversion
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}

                  {imageError && (
                    <div className="mt-2 text-xs text-red-600 flex items-center gap-1.5 font-medium">
                      <AlertCircle size={14} />
                      <span>{imageError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 5. QUANTITY & SPECIAL NOTES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl p-1.5 w-fit">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-stone-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Custom Requests (Optional)
                  </label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Gift wrap, matte finish..."
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#4f6b43]/30 focus:border-[#4f6b43]"
                  />
                </div>
              </div>
            </div>

            {/* ── MODAL FOOTER ── */}
            <div className="p-5 sm:p-6 border-t border-stone-200 bg-white/95 backdrop-blur-md flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Total Price</div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900">₹{totalPrice}</div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3.5 px-6 sm:px-8 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-[#4f6b43] transition-all flex items-center gap-2.5 shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
