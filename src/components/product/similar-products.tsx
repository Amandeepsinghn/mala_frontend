import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

interface SimilarProductsProps {
  products: Product[];
  categorySlug?: string;
  categoryName?: string;
}

function similarStartingPrice(product: Product) {
  const optionPrices = [
    ...(product.quantityOptions ?? []).map((option) => option.price),
    ...(product.sideTableOptions ?? []).map((option) => option.price),
    ...(product.seatingOptions ?? []).map((option) => option.price),
  ];
  if (optionPrices.length === 0) return product.price;
  return Math.min(...optionPrices, product.price);
}

export function SimilarProducts({
  products,
  categorySlug,
  categoryName,
}: SimilarProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-14 border-t border-stone-200 pt-10 sm:mt-16 sm:pt-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-stone-900">
            Similar products
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            More from {categoryName || "this collection"}
          </p>
        </div>
        {categorySlug && (
          <Link
            href={`/categories/${categorySlug}`}
            className="text-sm font-medium text-stone-900 underline underline-offset-4 hover:text-stone-700"
          >
            View all
          </Link>
        )}
      </div>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
        {products.map((product) => {
          const image = product.images[0];
          const price = similarStartingPrice(product);
          const hasOptions =
            (product.quantityOptions?.length ?? 0) > 1 ||
            (product.sideTableOptions?.length ?? 0) > 1 ||
            (product.seatingOptions?.length ?? 0) > 1;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group w-[70%] max-w-[260px] shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-white transition-shadow hover:shadow-md sm:w-[45%] lg:w-auto lg:max-w-none"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                {image ? (
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 70vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-stone-400">
                    No image
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                  {product.category || "Product"}
                </p>
                <h3 className="mt-1 line-clamp-2 text-sm font-medium text-stone-900 group-hover:text-amber-800">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm font-semibold text-stone-900">
                  {hasOptions ? "From " : ""}
                  {formatPrice(price, product.currency)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
