"use client";

import { useState } from "react";
import Link from "next/link";
import { CartEnquiryModal } from "@/components/cart/cart-enquiry-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { CONTACT_PHONE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export function CartSummary() {
  const { totalPrice, totalItems, clearCart, isAuthenticated, items } =
    useCart();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const currency = items[0]?.product.currency ?? "INR";

  return (
    <>
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold text-stone-900">Order summary</h2>

          <div className="flex justify-between text-sm text-stone-600">
            <span>Items ({totalItems})</span>
            <span>{formatPrice(totalPrice, currency)}</span>
          </div>

          <div className="border-t border-stone-200 pt-4">
            <div className="flex justify-between font-semibold text-stone-900">
              <span>Total</span>
              <span>{formatPrice(totalPrice, currency)}</span>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={totalItems === 0}
            onClick={() => setEnquiryOpen(true)}
          >
            Enquiry
          </Button>

          <div className="rounded-md border border-stone-200 bg-stone-50 p-4 text-center">
            <p className="text-sm font-medium text-stone-900">
              Contact us directly
            </p>
            <p className="mt-1 text-xs text-stone-600">
              Call or WhatsApp us for details and orders
            </p>
            <a
              href={`tel:+91${CONTACT_PHONE}`}
              className="mt-2 inline-block text-lg font-semibold tracking-wide text-stone-900 hover:underline"
            >
              +91 {CONTACT_PHONE}
            </a>
          </div>

          {!isAuthenticated && totalItems > 0 && (
            <Button
              variant="ghost"
              className="w-full text-stone-500"
              onClick={clearCart}
            >
              Clear cart
            </Button>
          )}

          {isAuthenticated && (
            <p className="text-center text-xs text-stone-500">
              Cart synced with your account
            </p>
          )}

          <Link
            href="/products"
            className="block text-center text-sm text-stone-600 hover:text-stone-900"
          >
            Continue shopping
          </Link>
        </CardContent>
      </Card>

      <CartEnquiryModal
        items={items}
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />
    </>
  );
}
