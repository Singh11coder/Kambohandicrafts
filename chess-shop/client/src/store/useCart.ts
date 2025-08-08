import { create } from 'zustand';

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>((set) => ({
  items: [],
  addItem: (item, qty = 1) => set((state) => {
    const existing = state.items.find((i) => i.id === item.id);
    if (existing) {
      return { items: state.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i) };
    }
    return { items: [...state.items, { ...item, quantity: qty }] };
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  setQty: (id, qty) => set((state) => ({ items: state.items.map((i) => i.id === id ? { ...i, quantity: qty } : i) })),
  clear: () => set({ items: [] }),
}));