"use client";

import { useMemo, useState } from "react";
import { ProductActions } from "@/components/product/product-actions";
import {
  CONTACT_PHONE,
  KING_SIZE_DIMENSIONS,
  PRODUCT_DELIVERY_MESSAGE,
} from "@/lib/constants";
import { cn, formatDimension, formatPrice, getDiscountPercent } from "@/lib/utils";
import type {
  Product,
  ProductVariant,
  SeatingOption,
  SideTableOption,
} from "@/types/product";

interface ProductDetailPanelProps {
  product: Product;
}

type ProductChoice = {
  key: string;
  variantId: number | null;
  label: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  widthCm?: number | null;
  heightCm?: number | null;
  depthCm?: number | null;
  packQuantity?: number | null;
  seatingCapacity?: number | null;
  includesSideTable?: boolean | null;
};

const SERVICE_HIGHLIGHTS = [
  "67 point quality inspection before delivery",
  "2 year warranty, no questions asked",
  "Product is customizable according to customer needs",
] as const;

const TRUST_BADGES = [{ label: "Premium craftsmanship", icon: "✦" }] as const;

function isSofaProduct(product: Product) {
  return product.categorySlug === "sofas" || /sofa/i.test(product.category);
}

function isBedProduct(product: Product) {
  return product.categorySlug === "beds" || /bed/i.test(product.category);
}

function isChairProduct(product: Product) {
  return product.categorySlug === "chairs" || /chair/i.test(product.category);
}

function normalizeBedOptionLabel(raw: string) {
  const text = raw.toLowerCase();
  if (/without|not[- ]?side|no\s*side|w\/?o\b|without side/.test(text)) {
    return "Without side table";
  }
  if (/with\s*side|side\s*table|w\/\s*side|with side/.test(text)) {
    return "With side table";
  }
  return raw.trim();
}

function chairQuantityLabel(quantity: number) {
  return quantity === 1 ? "1 Chair" : `${quantity} Chairs`;
}

function getChairChoices(product: Product): ProductChoice[] {
  const fromApi = product.quantityOptions ?? [];
  const choices: ProductChoice[] = [];

  const hasSingle = fromApi.some((option) => option.quantity === 1);
  if (!hasSingle && fromApi.length > 0) {
    choices.push({
      key: "qty-1",
      variantId: null,
      label: chairQuantityLabel(1),
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      currency: product.currency,
      packQuantity: 1,
    });
  }

  for (const option of fromApi) {
    choices.push({
      key: `qty-${option.quantity}-${option.variantId ?? "base"}`,
      variantId: option.variantId,
      label: option.label || chairQuantityLabel(option.quantity),
      price: option.price,
      compareAtPrice: option.compareAtPrice ?? product.compareAtPrice,
      currency: option.currency || product.currency,
      packQuantity: option.quantity,
    });
  }

  if (choices.length === 0) {
    // Fallback from pack_quantity variants
    for (const variant of product.variants ?? []) {
      if (variant.packQuantity == null) continue;
      choices.push({
        key: `qty-${variant.packQuantity}-${variant.id}`,
        variantId: variant.id,
        label:
          variant.sizeLabel ||
          variant.name ||
          chairQuantityLabel(variant.packQuantity),
        price: variant.price ?? product.price,
        compareAtPrice: product.compareAtPrice,
        currency: product.currency,
        packQuantity: variant.packQuantity,
      });
    }
  }

  return choices.sort(
    (a, b) => (a.packQuantity ?? 0) - (b.packQuantity ?? 0),
  );
}

function getSofaChoices(product: Product): ProductChoice[] {
  const options =
    (product.seatingOptions?.length ?? 0) > 0
      ? product.seatingOptions!
      : (product.variants ?? [])
          .filter((variant) => variant.seatingCapacity != null)
          .map(
            (variant): SeatingOption => ({
              variantId: variant.id,
              seatingCapacity: variant.seatingCapacity ?? null,
              label: `${variant.seatingCapacity} Seater`,
              price: variant.price ?? product.price,
              compareAtPrice: null,
              currency: product.currency,
              widthCm: variant.widthCm,
              heightCm: variant.heightCm,
              depthCm: variant.depthCm,
              isActive: variant.isActive,
            }),
          );

  return options.map((option) => ({
    key: `seat-${option.variantId}`,
    variantId: option.variantId,
    label: option.label || `${option.seatingCapacity} Seater`,
    price: option.price,
    compareAtPrice: option.compareAtPrice ?? product.compareAtPrice,
    currency: option.currency || product.currency,
    widthCm: option.widthCm,
    heightCm: option.heightCm,
    depthCm: option.depthCm,
    seatingCapacity: option.seatingCapacity,
  }));
}

function getBedChoices(product: Product): ProductChoice[] {
  const fromApi = product.sideTableOptions ?? [];
  if (fromApi.length > 0) {
    return fromApi.map((option: SideTableOption) => ({
      key: `side-${option.variantId ?? option.label}`,
      variantId: option.variantId,
      label: normalizeBedOptionLabel(option.label),
      price: option.price,
      compareAtPrice: option.compareAtPrice ?? product.compareAtPrice,
      currency: option.currency || product.currency,
      widthCm: option.widthCm,
      heightCm: option.heightCm,
      depthCm: option.depthCm,
      includesSideTable: option.includesSideTable,
    }));
  }

  return (product.variants ?? [])
    .filter((variant) => variant.includesSideTable != null)
    .map((variant) => ({
      key: `side-${variant.id}`,
      variantId: variant.id,
      label: normalizeBedOptionLabel(
        variant.sizeLabel ||
          variant.name ||
          (variant.includesSideTable
            ? "With side table"
            : "Without side table"),
      ),
      price: variant.price ?? product.price,
      compareAtPrice: product.compareAtPrice,
      currency: product.currency,
      widthCm: variant.widthCm,
      heightCm: variant.heightCm,
      depthCm: variant.depthCm,
      includesSideTable: variant.includesSideTable,
    }));
}

function getProductChoices(product: Product): ProductChoice[] {
  if (isChairProduct(product)) return getChairChoices(product);
  if (isSofaProduct(product)) return getSofaChoices(product);
  if (isBedProduct(product)) return getBedChoices(product);
  return [];
}

function defaultChoice(
  product: Product,
  choices: ProductChoice[],
): ProductChoice | null {
  if (choices.length === 0) return null;

  if (isChairProduct(product)) {
    return choices.find((choice) => choice.packQuantity === 1) ?? choices[0];
  }

  if (isSofaProduct(product)) {
    const seaterMatch = product.name.match(/(\d+)\s*-?\s*seater/i);
    if (seaterMatch) {
      const seats = Number(seaterMatch[1]);
      const matched = choices.find((choice) => choice.seatingCapacity === seats);
      if (matched) return matched;
    }
  }

  if (isBedProduct(product)) {
    return (
      choices.find((choice) =>
        /without|not[- ]?side|no\s*side/i.test(choice.label),
      ) ?? choices[0]
    );
  }

  return choices[0];
}

function choiceToVariant(
  choice: ProductChoice,
  product: Product,
): ProductVariant | null {
  if (choice.variantId == null) return null;

  const existing = product.variants?.find(
    (variant) => variant.id === choice.variantId,
  );

  return {
    id: choice.variantId,
    sku: existing?.sku ?? "",
    name: choice.label,
    price: choice.price,
    seatingCapacity: choice.seatingCapacity ?? existing?.seatingCapacity ?? null,
    packQuantity: choice.packQuantity ?? existing?.packQuantity ?? null,
    includesSideTable:
      choice.includesSideTable ?? existing?.includesSideTable ?? null,
    widthCm: choice.widthCm ?? existing?.widthCm,
    heightCm: choice.heightCm ?? existing?.heightCm,
    depthCm: choice.depthCm ?? existing?.depthCm,
    stockQuantity: existing?.stockQuantity ?? 0,
    isActive: existing?.isActive ?? true,
  };
}

function getOptionSectionTitle(product: Product) {
  if (isChairProduct(product)) return "Select quantity";
  if (isBedProduct(product)) return "Side table option";
  return "Select seater";
}

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
        <div className="pb-4 text-sm leading-relaxed break-words text-stone-600">
          {content}
        </div>
      )}
    </div>
  );
}

function ProductDimensions({
  title = "Dimensions",
  widthCm,
  heightCm,
  depthCm,
  weightKg,
  footnote,
}: {
  title?: string;
  widthCm?: number | null;
  heightCm?: number | null;
  depthCm?: number | null;
  weightKg?: number | null;
  footnote?: string;
}) {
  const dimensions = [
    widthCm != null && {
      label: "Width",
      value: `${formatDimension(widthCm)} cm`,
    },
    heightCm != null && {
      label: "Height",
      value: `${formatDimension(heightCm)} cm`,
    },
    depthCm != null && {
      label: "Length",
      value: `${formatDimension(depthCm)} cm`,
    },
    weightKg != null && {
      label: "Weight",
      value: `${formatDimension(weightKg)} kg`,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  if (dimensions.length === 0 && !footnote) return null;

  return (
    <div className="mt-6 rounded-md border border-stone-200 bg-stone-50 p-4">
      <p className="text-sm font-medium text-stone-900">{title}</p>
      {dimensions.length > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {dimensions.map((item) => (
            <div key={item.label}>
              <dt className="text-xs uppercase tracking-[0.12em] text-stone-500">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-stone-900">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {footnote && (
        <p className="mt-3 text-sm leading-relaxed text-stone-600">{footnote}</p>
      )}
    </div>
  );
}

function BedKingSizeDimensions({
  product,
  widthCm,
  heightCm,
  depthCm,
}: {
  product: Product;
  widthCm?: number | null;
  heightCm?: number | null;
  depthCm?: number | null;
}) {
  const hasApiDims = widthCm != null || heightCm != null || depthCm != null;

  return (
    <ProductDimensions
      title="King Size dimensions"
      widthCm={widthCm ?? (hasApiDims ? null : KING_SIZE_DIMENSIONS.widthCm)}
      heightCm={heightCm}
      depthCm={depthCm ?? (hasApiDims ? null : KING_SIZE_DIMENSIONS.lengthCm)}
      weightKg={product.weightKg}
      footnote={
        hasApiDims
          ? `Fits a ${KING_SIZE_DIMENSIONS.label.toLowerCase()} mattress (${KING_SIZE_DIMENSIONS.widthIn} × ${KING_SIZE_DIMENSIONS.lengthIn} in / ${KING_SIZE_DIMENSIONS.widthCm} × ${KING_SIZE_DIMENSIONS.lengthCm} cm).`
          : `Standard ${KING_SIZE_DIMENSIONS.label.toLowerCase()} mattress size: ${KING_SIZE_DIMENSIONS.widthIn} × ${KING_SIZE_DIMENSIONS.lengthIn} in (${KING_SIZE_DIMENSIONS.widthCm} × ${KING_SIZE_DIMENSIONS.lengthCm} cm).`
      }
    />
  );
}

export function ProductDetailPanel({ product }: ProductDetailPanelProps) {
  const choices = useMemo(() => getProductChoices(product), [product]);
  const isBed = isBedProduct(product);

  const [selectedKey, setSelectedKey] = useState<string | null>(
    () => defaultChoice(product, getProductChoices(product))?.key ?? null,
  );
  const [openSection, setOpenSection] = useState<string | null>("description");

  const selectedChoice =
    choices.find((choice) => choice.key === selectedKey) ??
    defaultChoice(product, choices);

  const displayPrice = selectedChoice?.price ?? product.price;
  const displayCompareAt =
    selectedChoice?.compareAtPrice ?? product.compareAtPrice;
  const discount = getDiscountPercent(displayPrice, displayCompareAt);
  const selectedVariant = selectedChoice
    ? choiceToVariant(selectedChoice, product)
    : null;

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
    <div className="flex min-w-0 flex-col overflow-hidden">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone-500">
        Product ID {product.productId}
      </p>
      <h1 className="mt-2 font-serif text-2xl font-semibold leading-snug break-words text-stone-900 sm:text-3xl lg:text-4xl">
        {product.name}
      </h1>

      <div className="mt-3">
        <StarRating />
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <p className="text-3xl font-bold text-stone-900">
          {formatPrice(displayPrice, product.currency)}
        </p>
        {displayCompareAt && displayCompareAt > displayPrice && (
          <>
            <p className="text-lg text-stone-400 line-through">
              {formatPrice(displayCompareAt, product.currency)}
            </p>
            {discount > 0 && (
              <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {discount}% off
              </span>
            )}
          </>
        )}
      </div>

      {choices.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-stone-900">
            {getOptionSectionTitle(product)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {choices.map((choice) => {
              const selected = choice.key === selectedChoice?.key;
              return (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => setSelectedKey(choice.key)}
                  className={cn(
                    "min-w-[7.5rem] rounded-xl border px-4 py-3 text-left transition-colors",
                    selected
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-300 bg-white text-stone-900 hover:border-stone-500",
                  )}
                >
                  <span className="block text-sm font-semibold">
                    {choice.label}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-sm",
                      selected ? "text-white/85" : "text-stone-600",
                    )}
                  >
                    {formatPrice(choice.price, choice.currency)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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

      {!isBed && (
        <ProductDimensions
          widthCm={selectedChoice?.widthCm ?? product.widthCm}
          heightCm={selectedChoice?.heightCm ?? product.heightCm}
          depthCm={selectedChoice?.depthCm ?? product.depthCm}
          weightKg={product.weightKg}
        />
      )}

      {isBed && (
        <BedKingSizeDimensions
          product={product}
          widthCm={selectedChoice?.widthCm ?? product.widthCm}
          heightCm={selectedChoice?.heightCm ?? product.heightCm}
          depthCm={selectedChoice?.depthCm ?? product.depthCm}
        />
      )}

      <div className="mt-6 rounded-md border border-stone-200 bg-stone-50 p-4">
        <p className="text-sm font-medium text-stone-900">Visit our factory</p>
        <p className="mt-1 text-sm leading-relaxed break-words text-stone-600">
          See how our furniture is crafted in person at our factory.
        </p>
      </div>

      <div className="mt-6 rounded-md border border-stone-200 bg-stone-50 p-4">
        <p className="text-sm font-medium text-stone-900">Contact us for product</p>
        <p className="mt-1 text-sm leading-relaxed break-words text-stone-600">
          Call or WhatsApp us for details, customisation, and orders.
        </p>
        <a
          href={`tel:+91${CONTACT_PHONE}`}
          className="mt-3 inline-block break-all text-lg font-semibold tracking-wide text-stone-900 hover:underline"
        >
          +91 {CONTACT_PHONE}
        </a>
      </div>

      <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed break-words text-amber-900">
        {PRODUCT_DELIVERY_MESSAGE}
      </p>

      <ProductActions
        product={product}
        selectedVariant={selectedVariant}
        displayPrice={displayPrice}
      />

      <div className="mt-8 flex justify-center border-t border-stone-200 pt-6">
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
