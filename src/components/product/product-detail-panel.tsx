"use client";

import { useState } from "react";
import { ProductActions } from "@/components/product/product-actions";
import { CONTACT_PHONE, PRODUCT_DELIVERY_MESSAGE } from "@/lib/constants";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductDetailPanelProps {
  product: Product;
}

const SERVICE_HIGHLIGHTS = [
  "67 point quality inspection before delivery",
  "2 year warranty, no questions asked",
  "Free delivery, zero hidden charges",
] as const;

const TRUST_BADGES = [
  { label: "Free worldwide shipping", icon: "🌍" },
  { label: "60 days money-back guarantee", icon: "↩" },
  { label: "Premium craftsmanship", icon: "✦" },
] as const;

function StarRating() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex text-amber-400">
        {Array.from({ length: 5 }).map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

function AccordionItem({
  title,
  content,
  isOpen,
  onToggle,
}: {
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-stone-200">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-stone-900"
      >
        {title}
        <span className="text-lg leading-none text-stone-500">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="pb-4 text-sm leading-relaxed text-stone-600">{content}</div>
      )}
    </div>
  );
}

export function ProductDetailPanel({ product }: ProductDetailPanelProps) {
  const [openSection, setOpenSection] = useState<string | null>("description");

  const discount = getDiscountPercent(product.price, product.compareAtPrice);

  const accordionSections = [
    {
      id: "description",
      title: "Description",
      content: product.description,
    },
    {
      id: "how-it-helps",
      title: "How it Helps",
      content:
        product.shortDescription ||
        `Designed with ${product.material ?? "premium materials"} to elevate everyday comfort and style in your home.`,
    },
    {
      id: "what-it-helps-with",
      title: "What It Helps With",
      content: product.roomType
        ? `Ideal for ${product.roomType} spaces. ${product.style ? `Style: ${product.style}.` : ""}`
        : "Creates a warm, functional space for relaxing, entertaining, and everyday living.",
    },
    {
      id: "manufacturing",
      title: "Manufacturing",
      content: [
        product.material && `Material: ${product.material}`,
        product.color && `Color: ${product.color}`,
        product.style && `Style: ${product.style}`,
      ]
        .filter(Boolean)
        .join(" · ") || "Crafted with durable materials and inspected before dispatch.",
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="font-serif text-2xl font-semibold leading-snug text-stone-900 sm:text-3xl lg:text-4xl">
        {product.name}
      </h1>

      <div className="mt-3">
        <StarRating />
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <p className="text-3xl font-bold text-stone-900">
          {formatPrice(product.price, product.currency)}
        </p>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <>
            <p className="text-lg text-stone-400 line-through">
              {formatPrice(product.compareAtPrice, product.currency)}
            </p>
            {discount > 0 && (
              <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {discount}% off
              </span>
            )}
          </>
        )}
      </div>
      <p className="mt-1 text-xs text-stone-500">(Incl. of all taxes)</p>

      <ul className="mt-6 space-y-3">
        {SERVICE_HIGHLIGHTS.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-stone-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs text-stone-600">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-md border border-stone-200 bg-stone-50 p-4">
        <p className="text-sm font-medium text-stone-900">Visit our factory</p>
        <p className="mt-1 text-sm text-stone-600">
          See how our furniture is crafted in person at our factory.
        </p>
      </div>

      <div className="mt-6 rounded-md border border-stone-200 bg-stone-50 p-4">
        <p className="text-sm font-medium text-stone-900">Contact us for product</p>
        <p className="mt-1 text-sm text-stone-600">
          Call or WhatsApp us for details, customisation, and orders.
        </p>
        <a
          href={`tel:+91${CONTACT_PHONE}`}
          className="mt-3 inline-block text-lg font-semibold tracking-wide text-stone-900 hover:underline"
        >
          +91 {CONTACT_PHONE}
        </a>
      </div>

      <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
        {PRODUCT_DELIVERY_MESSAGE}
      </p>

      <ProductActions product={product} />

      <div className="mt-8 grid gap-4 border-t border-stone-200 pt-6 sm:grid-cols-3">
        {TRUST_BADGES.map((badge) => (
          <div
            key={badge.label}
            className="flex flex-col items-center gap-2 text-center text-xs text-stone-600"
          >
            <span className="text-lg">{badge.icon}</span>
            <span>{badge.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-stone-200">
        {accordionSections.map((section) => (
          <AccordionItem
            key={section.id}
            title={section.title}
            content={section.content}
            isOpen={openSection === section.id}
            onToggle={() =>
              setOpenSection((current) =>
                current === section.id ? null : section.id,
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
