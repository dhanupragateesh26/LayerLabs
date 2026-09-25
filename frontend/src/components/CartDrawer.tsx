'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  Box,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileCode2,
  Loader2,
  Truck,
  Image as ImageIcon,
  Palette,
  Ruler
} from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalCount,
    customPrintsCount,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    comments: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    // Check if any custom prints are missing files (e.g. after browser refresh)
    const missingStl = items.find(i => i.type === 'custom_print' && !i.file);
    if (missingStl && missingStl.type === 'custom_print') {
      setErrorMessage(`The STL file for "${missingStl.fileName}" needs to be re-uploaded because the page was refreshed. Please re-add it from the Order page.`);
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(15);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const data = new FormData();

      // Append customer details
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('comments', formData.comments);

      // Serialize items overview
      const serializableItems = items.map((item, index) => {
        if (item.type === 'catalog') {
          return {
            index,
            type: 'catalog',
            productId: item.productId,
            title: item.title,
            price: item.price,
            numericPrice: item.numericPrice,
            quantity: item.quantity,
            options: {
              sizeName: item.options?.sizeName,
              sizeDimension: item.options?.sizeDimension,
              color: item.options?.color,
              design: item.options?.design,
              uploadedImageName: item.options?.uploadedImageName,
              customNote: item.options?.customNote,
            },
          };
        } else {
          return {
            index,
            type: 'custom_print',
            title: item.title,
            fileName: item.fileName,
            material: item.material,
            color: item.color,
            infillDensity: item.infillDensity,
            infillPattern: item.infillPattern,
            quantity: item.quantity,
            volumeMm3: item.volumeMm3,
            comments: item.comments,
          };
        }
      });

      data.append('itemsJson', JSON.stringify(serializableItems));

      // Append all custom print STL files & lithophane custom photos
      items.forEach((item, index) => {
        if (item.type === 'custom_print' && item.file) {
          data.append(`stlFiles`, item.file, `custom_${index}_${item.fileName}`);
        } else if (item.type === 'catalog' && item.imageFile) {
          data.append(`imageFiles`, item.imageFile, `litho_${index}_${item.options?.uploadedImageName || 'photo.jpg'}`);
        }
      });

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
      }, 200);

      const res = await fetch(`${apiUrl}/api/cart-orders`, {
        method: 'POST',
        body: data,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.ok) {
        const result = await res.json();
        setSubmittedOrderId(result.orderId || 'LL-' + Date.now().toString().slice(-6));
        setCheckoutStep('success');
        clearCart();
      } else {
        const errJson = await res.json().catch(() => ({}));
        setErrorMessage(errJson.error || `Submission failed with status ${res.status}`);
      }
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : '';
      setErrorMessage(
        errMsg || 'Cannot connect to server. Please verify backend status and try again.'
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const resetDrawer = () => {
    setCheckoutStep('cart');
    setFormData({ name: '', email: '', phone: '', address: '', comments: '' });
    setErrorMessage('');
    closeCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#FAF8F5] shadow-2xl border-l border-stone-200 flex flex-col justify-between overflow-hidden"
          >
            {/* ── Top Header ─────────────────────────────────────── */}
            <div className="px-6 py-5 border-b border-stone-200 bg-white/80 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#ecf0e6] text-[#4f6b43] rounded-xl">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
                    Your Cart
                    {totalCount > 0 && (
                      <span className="text-xs bg-[#4f6b43] text-white px-2 py-0.5 rounded-full font-semibold">
                        {totalCount} {totalCount === 1 ? 'item' : 'items'}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-stone-500">Custom 3D Prints & Configured Products</p>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Main Content Area ──────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* VIEW 1: CART ITEMS */}
              {checkoutStep === 'cart' && (
                <>
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16">
                      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                        <Box size={32} />
                      </div>
                      <h3 className="text-base font-bold text-stone-800 mb-1">Your cart is empty</h3>
                      <p className="text-sm text-stone-500 max-w-xs mb-6">
                        Explore our customized creations or configure your own custom 3D prints.
                      </p>
                      <div className="flex flex-col gap-2 w-full max-w-xs">
                        <button
                          onClick={() => {
                            closeCart();
                            const el = document.getElementById('popular-products');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors"
                        >
                          Browse Products
                        </button>
                        <Link
                          href="/order"
                          onClick={closeCart}
                          className="w-full py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-100 text-center transition-colors"
                        >
                          Upload Custom STL
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm flex gap-4 items-start relative group hover:border-stone-300 transition-all"
                        >
                          {/* Thumbnail / Icon */}
                          <div className="w-20 h-20 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0 flex items-center justify-center relative">
                            {item.type === 'catalog' ? (
                              <>
                                <img
                                  src={item.options?.uploadedImagePreview || item.img}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                                {item.options?.uploadedImagePreview && (
                                  <span className="absolute bottom-1 right-1 bg-stone-900/80 text-white p-0.5 rounded text-[9px]" title="Uploaded photo">
                                    <ImageIcon size={10} />
                                  </span>
                                )}
                              </>
                            ) : (
                              <div className="p-3 bg-[#ecf0e6] text-[#4f6b43] rounded-lg">
                                <FileCode2 size={24} />
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0 pr-6">
                            <h4 className="text-sm font-bold text-stone-900 leading-tight">
                              {item.title}
                            </h4>

                            {/* Catalog Item Custom Options */}
                            {item.type === 'catalog' && item.options && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {item.options.sizeName && (
                                  <span className="text-[10px] font-bold bg-[#ecf0e6] text-[#4f6b43] px-2 py-0.5 rounded flex items-center gap-1">
                                    <Ruler size={10} />
                                    {item.options.sizeName} ({item.options.sizeDimension})
                                  </span>
                                )}
                                {item.options.design && (
                                  <span className="text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Layers size={10} />
                                    {item.options.design}
                                  </span>
                                )}
                                {item.options.color && (
                                  <span className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Palette size={10} />
                                    {item.options.color}
                                  </span>
                                )}
                                {item.options.uploadedImageName && (
                                  <span className="text-[10px] font-medium bg-blue-50 border border-blue-200 text-blue-800 px-2 py-0.5 rounded flex items-center gap-1 truncate max-w-[160px]">
                                    <ImageIcon size={10} />
                                    {item.options.uploadedImageName}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Custom Print Specs */}
                            {item.type === 'custom_print' && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                <span className="text-[10px] font-bold bg-[#ecf0e6] text-[#4f6b43] px-2 py-0.5 rounded">
                                  {item.material} · {item.color}
                                </span>
                                <span className="text-[10px] font-medium bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                                  Infill: {item.infillDensity}
                                </span>
                              </div>
                            )}

                            {/* Price and Quantity Controls */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="font-bold text-sm text-[#4f6b43]">
                                {item.type === 'catalog' ? (
                                  `₹${item.numericPrice * item.quantity}`
                                ) : (
                                  <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-semibold">
                                    Quote on Review
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-lg p-0.5">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center rounded text-stone-500 hover:bg-white hover:text-stone-900 transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-stone-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center rounded text-stone-500 hover:bg-white hover:text-stone-900 transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="absolute top-3 right-3 text-stone-300 hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}

                      {/* Quick Add Custom Print CTA */}
                      <Link
                        href="/order"
                        onClick={closeCart}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-dashed border-[#4f6b43]/40 bg-[#ecf0e6]/40 hover:bg-[#ecf0e6]/70 text-[#4f6b43] text-xs font-bold transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <Plus size={16} />
                          <span>Add another Custom 3D STL file</span>
                        </div>
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* VIEW 2: CHECKOUT FORM */}
              {checkoutStep === 'checkout' && (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <h3 className="text-base font-bold text-stone-900">Delivery & Contact Details</h3>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4f6b43]/30 focus:border-[#4f6b43]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4f6b43]/30 focus:border-[#4f6b43]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4f6b43]/30 focus:border-[#4f6b43]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Delivery Address *</label>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street, Area, City, Pincode"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4f6b43]/30 focus:border-[#4f6b43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Order Notes (Optional)</label>
                    <textarea
                      name="comments"
                      rows={2}
                      value={formData.comments}
                      onChange={handleInputChange}
                      placeholder="Special instructions, delivery timeline..."
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4f6b43]/30 focus:border-[#4f6b43]"
                    />
                  </div>

                  {/* Order Mini-Recap */}
                  <div className="p-3.5 bg-stone-100 rounded-xl text-xs space-y-1.5 border border-stone-200/80">
                    <div className="flex justify-between font-medium text-stone-600">
                      <span>Total Items:</span>
                      <span className="font-bold text-stone-800">{totalCount} items</span>
                    </div>
                    {subtotal > 0 && (
                      <div className="flex justify-between font-medium text-stone-600">
                        <span>Configured Products Subtotal:</span>
                        <span className="font-bold text-stone-900">₹{subtotal}</span>
                      </div>
                    )}
                    {customPrintsCount > 0 && (
                      <div className="flex justify-between text-[#4f6b43] font-medium">
                        <span>Custom 3D Prints:</span>
                        <span className="font-bold">{customPrintsCount} file(s) for quote</span>
                      </div>
                    )}
                  </div>

                  {isSubmitting && uploadProgress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-stone-500">
                        <span>Uploading files & submitting order...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4f6b43] transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Order & Request Quote</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* VIEW 3: ORDER SUCCESS */}
              {checkoutStep === 'success' && (
                <div className="py-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#ecf0e6] text-[#4f6b43] rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Order Received!</h3>
                  <p className="text-xs text-stone-500 mb-4 max-w-xs">
                    Thank you! We&apos;ve received your order request and custom specifications. We will review your models and send an email confirmation shortly.
                  </p>

                  <div className="p-4 bg-white border border-stone-200 rounded-xl w-full max-w-xs mb-6 text-left text-xs space-y-1">
                    <div className="text-stone-400 font-medium uppercase tracking-wider text-[10px]">Reference ID</div>
                    <div className="font-mono font-bold text-stone-800 text-sm">{submittedOrderId}</div>
                    <div className="text-stone-500 pt-2 flex items-center gap-1.5">
                      <Truck size={14} className="text-[#4f6b43]" />
                      <span>We will contact you shortly via email/phone.</span>
                    </div>
                  </div>

                  <button
                    onClick={resetDrawer}
                    className="py-3 px-6 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-stone-800 transition-all shadow-md"
                  >
                    Continue Browsing
                  </button>
                </div>
              )}
            </div>

            {/* ── Bottom Summary Footer (When in 'cart' view and items exist) ─── */}
            {checkoutStep === 'cart' && items.length > 0 && (
              <div className="p-6 border-t border-stone-200 bg-white/90 backdrop-blur-md space-y-4">
                {/* Financial Overview */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Configured Items Total:</span>
                    <span className="font-bold text-stone-900">₹{subtotal}</span>
                  </div>
                  {customPrintsCount > 0 && (
                    <div className="flex justify-between text-stone-500 text-xs">
                      <span>Custom 3D Prints:</span>
                      <span className="text-[#4f6b43] font-semibold">
                        {customPrintsCount} item(s) (Quote on Review)
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-400 text-[11px] pt-1 border-t border-stone-100">
                    <span>Shipping:</span>
                    <span>Calculated at dispatch</span>
                  </div>
                </div>

                {/* Checkout & Clear CTA */}
                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="p-3 rounded-xl border border-stone-200 text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Clear entire cart"
                  >
                    <Trash2 size={18} />
                  </button>

                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    className="flex-1 py-3.5 px-4 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
