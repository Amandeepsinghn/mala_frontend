"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductEnquiryModal } from "@/components/product/product-enquiry-modal";
import { Button } from "@/components/ui/button";
import type { Product, ProductVariant } from "@/types/product";

interface ProductActionsProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
  displayPrice?: number;
}

function isChairProduct(product: Product) {
  return product.categorySlug === "chairs" || /chair/i.test(product.category);
}

export function ProductActions({
  product,
  selectedVariant = null,
  displayPrice,
}: ProductActionsProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const showQuantity = isChairProduct(product);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => current + 1);
  }

  return (
    <>
      <div className="mt-6 space-y-3">
        {showQuantity && (
          <div>
            <p className="text-sm font-medium text-stone-900">Quantity</p>
            <div className="mt-3 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </Button>
              <span className="w-10 text-center text-sm font-medium text-stone-900">
                {quantity}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={increaseQuantity}
                aria-label="Increase quantity"
              >
                +
              </Button>
            </div>
          </div>
        )}

        <AddToCartButton
          product={product}
          selectedVariant={selectedVariant}
          displayPrice={displayPrice}
          quantity={showQuantity ? quantity : 1}
        />
        <button
          type="button"
          onClick={() => setEnquiryOpen(true)}
          className="w-full rounded-md border border-stone-300 bg-transparent px-6 py-3 text-base font-medium text-stone-900 transition-colors hover:bg-stone-50"
        >
          Enquiry
        </button>
      </div>

      <ProductEnquiryModal
        product={product}
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />
    </>
  );
}
