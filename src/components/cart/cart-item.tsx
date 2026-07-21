"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem, isAuthenticated } = useCart();
  const { product, quantity } = item;
  const image = product.images[0];

  return (
    <div className="flex gap-4 border-b border-stone-200 py-4">
      <Link
        href={`/products/${product.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-stone-100"
      >
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-stone-400">
            No image
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="font-medium text-stone-900 hover:text-amber-800"
          >
            {product.name}
          </Link>
          {product.category && (
            <p className="text-sm text-stone-500">{product.category}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(product.id, quantity - 1)}
              >
                −
              </Button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(product.id, quantity + 1)}
              >
                +
              </Button>
            </div>
          ) : (
            <span className="text-sm text-stone-500">Qty: {quantity}</span>
          )}
          <p className="font-medium text-stone-900">
            {formatPrice(product.price * quantity, product.currency)}
          </p>
        </div>
      </div>

      {!isAuthenticated && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start text-stone-400 hover:text-red-600"
          onClick={() => removeItem(product.id)}
          aria-label={`Remove ${product.name}`}
        >
          ✕
        </Button>
      )}
    </div>
  );
}
