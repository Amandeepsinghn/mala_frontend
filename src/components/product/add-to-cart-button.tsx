"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
  size?: "sm" | "md" | "lg";
  showPrice?: boolean;
  className?: string;
}

export function AddToCartButton({
  product,
  size = "lg",
  showPrice = true,
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    setLoading(true);
    try {
      await addItem(product);
    } finally {
      setLoading(false);
    }
  }

  const label = showPrice
    ? `Add to cart ${formatPrice(product.price, product.currency)}`
    : "Add to cart";

  return (
    <Button
      size={size}
      className={cn(
        "w-full max-w-full whitespace-normal rounded-md bg-stone-900 text-white hover:bg-stone-800",
        size === "lg" && "px-4 py-3.5 text-sm sm:text-base",
        className,
      )}
      disabled={loading}
      onClick={handleAdd}
    >
      {loading ? "Adding..." : label}
    </Button>
  );
}
