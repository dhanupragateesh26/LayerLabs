'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CatalogCartItemOptions {
  sizeName?: string;
  sizeDimension?: string;
  color?: string;
  design?: string;
  uploadedImageName?: string;
  uploadedImagePreview?: string;
  customNote?: string;
}

export interface CatalogCartItem {
  id: string; // unique cart item id
  type: 'catalog';
  productId: string;
  title: string;
  price: string;
  numericPrice: number;
  img: string;
  badges?: string[];
  quantity: number;
  options?: CatalogCartItemOptions;
  imageFile?: File; // For custom lithophane photo upload
}

export interface CustomPrintCartItem {
  id: string; // unique cart item id
  type: 'custom_print';
  title: string;
  fileName: string;
  file?: File; // actual File object for submission
  fileBuffer?: ArrayBuffer;
  material: string;
  color: string;
  infillDensity: string;
  infillPattern: string;
  quantity: number;
  volumeMm3?: number;
  comments?: string;
  priceEstimate?: number; // optional estimated price in INR
}

export type CartItem = CatalogCartItem | CustomPrintCartItem;

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: any, type?: 'catalog' | 'custom_print') => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  customPrintsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'layerlabs_cart_items_v2';

// In-memory cache for File objects associated with cart item IDs (both STL files and custom lithophane photos)
const fileStore = new Map<string, { file?: File; imageFile?: File }>();

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        const hydrated = parsed.map((item) => {
          const cached = fileStore.get(item.id);
          if (item.type === 'custom_print') {
            return { ...item, file: cached?.file };
          } else if (item.type === 'catalog' && cached?.imageFile) {
            return { ...item, imageFile: cached?.imageFile };
          }
          return item;
        });
        setItems(hydrated);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever items change (serialize without raw File instances)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const serializable = items.map((item) => {
        if (item.type === 'custom_print') {
          const { file, ...rest } = item;
          return rest;
        } else if (item.type === 'catalog') {
          const { imageFile, ...rest } = item;
          return rest;
        }
        return item;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, isHydrated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (
    itemData: any,
    itemType: 'catalog' | 'custom_print' = itemData.type || (itemData.fileName ? 'custom_print' : 'catalog')
  ) => {
    const id = `${itemType}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    if (itemType === 'catalog') {
      const numericPrice = typeof itemData.price === 'string'
        ? parseInt(itemData.price.replace(/[^0-9]/g, ''), 10) || 0
        : Number(itemData.numericPrice ?? itemData.price) || 0;

      if (itemData.imageFile) {
        fileStore.set(id, { imageFile: itemData.imageFile });
      }

      const newItem: CatalogCartItem = {
        id,
        type: 'catalog',
        productId: itemData.productId || itemData.id || id,
        title: itemData.title || 'Product',
        price: itemData.price || `₹${numericPrice}`,
        numericPrice,
        img: itemData.img || '/products/dragon-keychain.jpg',
        badges: itemData.badges || [],
        quantity: itemData.quantity || 1,
        options: itemData.options,
        imageFile: itemData.imageFile,
      };

      setItems((prev) => {
        // Match items with identical product, options, and size
        const existingIndex = prev.findIndex(
          (i) =>
            i.type === 'catalog' &&
            i.productId === newItem.productId &&
            JSON.stringify(i.options) === JSON.stringify(newItem.options) &&
            !newItem.imageFile
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          const existing = updated[existingIndex] as CatalogCartItem;
          updated[existingIndex] = {
            ...existing,
            quantity: existing.quantity + newItem.quantity,
          };
          return updated;
        }
        return [...prev, newItem];
      });
    } else {
      if (itemData.file) {
        fileStore.set(id, { file: itemData.file });
      }

      const newItem: CustomPrintCartItem = {
        id,
        type: 'custom_print',
        title: itemData.title || `Custom Print (${itemData.fileName})`,
        fileName: itemData.fileName || (itemData.file ? itemData.file.name : 'model.stl'),
        file: itemData.file,
        material: itemData.material || 'PLA',
        color: itemData.color || 'White',
        infillDensity: itemData.infillDensity || 'Default',
        infillPattern: itemData.infillPattern || 'Default',
        quantity: itemData.quantity || 1,
        volumeMm3: itemData.volumeMm3 || 0,
        comments: itemData.comments || '',
        priceEstimate: itemData.priceEstimate,
      };

      setItems((prev) => [...prev, newItem]);
    }

    setIsOpen(true);
  };

  const removeFromCart = (id: string) => {
    fileStore.delete(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    fileStore.clear();
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    if (item.type === 'catalog') {
      return sum + item.numericPrice * item.quantity;
    }
    if (item.type === 'custom_print' && item.priceEstimate) {
      return sum + item.priceEstimate * item.quantity;
    }
    return sum;
  }, 0);

  const customPrintsCount = items.filter((item) => item.type === 'custom_print').length;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        customPrintsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
