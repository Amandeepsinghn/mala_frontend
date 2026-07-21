"use client";

import { useCallback, useEffect, useState } from "react";
import { addToCart, getCart } from "@/lib/auth-api";
import { parseDecimal } from "@/lib/utils";
import { useAuth, useLocalCart } from "@/hooks/use-auth";
import type { CartItemResponse } from "@/types/api";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

function mapApiCartItem(item: CartItemResponse): CartItem {
  return {
    cartItemId: item.id,
    quantity: item.quantity,
    product: {
      id: item.product_id,
      name: item.product_name,
      slug: item.product_slug,
      description: "",
      price: parseDecimal(item.unit_price),
      currency: item.currency,
      images: item.primary_image_url ? [item.primary_image_url] : [],
      category: "",
      categorySlug: "",
      inStock: true,
    },
  };
}

export function useCart() {
  const { token, isAuthenticated } = useAuth();
  const localCart = useLocalCart();
  const [apiItems, setApiItems] = useState<CartItem[]>([]);
  const [apiSubtotal, setApiSubtotal] = useState(0);
  const [apiTotalItems, setApiTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const applyCartResponse = useCallback((items: CartItemResponse[], subtotal: string, totalItems: number) => {
    setApiItems(items.map(mapApiCartItem));
    setApiSubtotal(parseDecimal(subtotal));
    setApiTotalItems(totalItems);
  }, []);

  const refreshApiCart = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const cart = await getCart(token);
      applyCartResponse(cart.items, cart.subtotal, cart.total_items);
    } catch {
      applyCartResponse([], "0", 0);
    } finally {
      setLoading(false);
    }
  }, [token, applyCartResponse]);

  useEffect(() => {
    if (!token) return;

    let active = true;

    getCart(token)
      .then((cart) => {
        if (!active) return;
        applyCartResponse(cart.items, cart.subtotal, cart.total_items);
      })
      .catch(() => {
        if (!active) return;
        applyCartResponse([], "0", 0);
      });

    return () => {
      active = false;
    };
  }, [token, applyCartResponse]);

  const addItem = async (product: Product, quantity = 1) => {
    if (isAuthenticated && token) {
      const cart = await addToCart(token, { product_id: product.id, quantity });
      applyCartResponse(cart.items, cart.subtotal, cart.total_items);
      return;
    }
    localCart.addItem(product, quantity);
  };

  const items = isAuthenticated ? apiItems : localCart.items;
  const totalItems = isAuthenticated ? apiTotalItems : localCart.totalItems;
  const totalPrice = isAuthenticated ? apiSubtotal : localCart.totalPrice;

  return {
    items,
    addItem,
    removeItem: localCart.removeItem,
    updateQuantity: localCart.updateQuantity,
    clearCart: localCart.clearCart,
    totalItems,
    totalPrice,
    isAuthenticated,
    loading,
    refreshApiCart,
  };
}
