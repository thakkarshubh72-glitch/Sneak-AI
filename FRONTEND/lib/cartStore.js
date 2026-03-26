'use client';

import { create } from 'zustand';

const getInitialCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('sneaker-cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sneaker-cart', JSON.stringify(items));
  }
};

export const useCartStore = create((set, get) => ({
  items: [],
  isHydrated: false,

  hydrate: () => {
    const items = getInitialCart();
    set({ items, isHydrated: true });
  },

  addItem: (sneaker, size, quantity = 1) => {
    const { items } = get();
    const existingIndex = items.findIndex(
      (item) => item.id === sneaker.id && item.size === size
    );

    let newItems;
    if (existingIndex > -1) {
      newItems = items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newItems = [
        ...items,
        {
          id: sneaker.id,
          name: sneaker.name,
          brand: sneaker.brand,
          price: sneaker.price,
          color: sneaker.color,
          colorHex: sneaker.colorHex,
          image: sneaker.images?.[0],
          size,
          quantity,
        },
      ];
    }

    saveCart(newItems);
    set({ items: newItems });
  },

  removeItem: (id, size) => {
    const { items } = get();
    const newItems = items.filter(
      (item) => !(item.id === id && item.size === size)
    );
    saveCart(newItems);
    set({ items: newItems });
  },

  updateQuantity: (id, size, quantity) => {
    const { items } = get();
    if (quantity <= 0) {
      get().removeItem(id, size);
      return;
    }
    const newItems = items.map((item) =>
      item.id === id && item.size === size ? { ...item, quantity } : item
    );
    saveCart(newItems);
    set({ items: newItems });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  getTotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
