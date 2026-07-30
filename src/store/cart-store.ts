"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import type { Product, ProductVariant } from "@/types/product";

function cartKey(productId: number, variantId?: number | null) {
  return `${productId}:${variantId ?? "base"}`;
}

interface CartState {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    variant?: ProductVariant | null,
  ) => void;
  removeItem: (productId: number, variantId?: number | null) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    variantId?: number | null,
  ) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variant = null) => {
        const variantId = variant?.id ?? null;
        const lineProduct: Product = {
          ...product,
          price: variant?.price ?? product.price,
          selectedVariantId: variantId,
          selectedVariantName:
            variant?.seatingCapacity != null
              ? `${variant.seatingCapacity} Seater`
              : variant?.name ?? null,
        };

        set((state) => {
          const existing = state.items.find(
            (item) =>
              cartKey(item.product.id, item.product.selectedVariantId) ===
              cartKey(product.id, variantId),
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                cartKey(item.product.id, item.product.selectedVariantId) ===
                cartKey(product.id, variantId)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }

          return { items: [...state.items, { product: lineProduct, quantity }] };
        });
      },

      removeItem: (productId, variantId = null) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              cartKey(item.product.id, item.product.selectedVariantId) !==
              cartKey(productId, variantId),
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId = null) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            cartKey(item.product.id, item.product.selectedVariantId) ===
            cartKey(productId, variantId)
              ? { ...item, quantity }
              : item,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        ),
    }),
    { name: "mala-cart" },
  ),
);
