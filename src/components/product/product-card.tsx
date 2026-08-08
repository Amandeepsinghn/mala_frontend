import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { KING_SIZE_DIMENSIONS } from "@/lib/constants";
import { formatDimension, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

function isBedProduct(product: Product) {
  return product.categorySlug === "beds" || /bed/i.test(product.category);
}

function isChairProduct(product: Product) {
  return product.categorySlug === "chairs" || /chair/i.test(product.category);
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];
  const optionCount =
    (product.quantityOptions?.length ?? 0) > 0
      ? (product.quantityOptions?.length ?? 0) +
        (product.quantityOptions?.some((option) => option.quantity === 1)
          ? 0
          : 1)
      : (product.sideTableOptions?.length ?? 0) > 0
        ? (product.sideTableOptions?.length ?? 0)
        : (product.seatingOptions?.length ?? 0);
  const optionPrices = [
    ...(product.quantityOptions ?? []).map((option) => option.price),
    ...(product.sideTableOptions ?? []).map((option) => option.price),
    ...(product.seatingOptions ?? []).map((option) => option.price),
  ];
  const startingPrice =
    optionPrices.length > 0 ? Math.min(...optionPrices, product.price) : product.price;
  const hasOptionChoices = optionCount > 1;
  const isBed = isBedProduct(product);
  const isChair = isChairProduct(product);
  const bedWidth = product.widthCm ?? KING_SIZE_DIMENSIONS.widthCm;
  const bedLength = product.depthCm ?? KING_SIZE_DIMENSIONS.lengthCm;
  const optionCta = isChair
    ? "Select quantity"
    : isBed
      ? "Select side table"
      : "Select seater";
  const optionHint = isChair
    ? `${optionCount} quantity options`
    : isBed
      ? `${optionCount} side table options`
      : `${optionCount} seater options`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-400">
              No image
            </div>
          )}
          {!product.inStock && (
            <div className="absolute left-3 top-3">
              <Badge variant="warning">Out of stock</Badge>
            </div>
          )}
        </div>
        <div className="p-4 pb-3">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            {[product.category, `ID ${product.productId}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <h3 className="mt-1 font-medium text-stone-900 group-hover:text-amber-800">
            {product.name}
          </h3>
          <p className="mt-2 text-sm font-semibold text-stone-900">
            {hasOptionChoices ? "From " : ""}
            {formatPrice(startingPrice, product.currency)}
          </p>
          {hasOptionChoices && (
            <p className="mt-1 text-xs text-stone-500">{optionHint}</p>
          )}
          {isBed && (
            <p className="mt-1 text-xs text-stone-500">
              King Size · {formatDimension(bedWidth)} ×{" "}
              {formatDimension(bedLength)} cm
            </p>
          )}
        </div>
      </Link>
      <div className="mt-auto px-4 pb-4">
        {hasOptionChoices ? (
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex w-full items-center justify-center rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            {optionCta}
          </Link>
        ) : (
          <AddToCartButton product={product} size="sm" showPrice={false} />
        )}
      </div>
    </article>
  );
}
