import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <article className="overflow-hidden rounded-lg border border-stone-200 bg-white transition-shadow hover:shadow-md">
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
        <div className="p-4">
          {product.category && (
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              {product.category}
            </p>
          )}
          <h3 className="mt-1 font-medium text-stone-900 group-hover:text-amber-800">
            {product.name}
          </h3>
          <p className="mt-2 text-sm font-semibold text-stone-900">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </article>
    </Link>
  );
}
