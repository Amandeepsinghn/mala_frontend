"use client";

import { CartItemRow } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { items, loading, isAuthenticated } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-stone-900">Your cart</h1>

      {loading && isAuthenticated ? (
        <p className="mt-12 text-center text-stone-500">Loading cart...</p>
      ) : items.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-stone-500">Your cart is empty.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <CartItemRow key={item.cartItemId ?? item.product.id} item={item} />
            ))}
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
