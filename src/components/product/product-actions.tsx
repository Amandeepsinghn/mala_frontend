"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductEnquiryModal } from "@/components/product/product-enquiry-modal";
import type { Product, ProductVariant } from "@/types/product";

interface ProductActionsProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
  displayPrice?: number;
}

export function ProductActions({
  product,
  selectedVariant = null,
  displayPrice,
}: ProductActionsProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <div className="mt-6 space-y-3">
        <AddToCartButton
          product={product}
          selectedVariant={selectedVariant}
          displayPrice={displayPrice}
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
