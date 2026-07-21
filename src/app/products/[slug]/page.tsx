import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-stone-500">
        <Link href="/products" className="hover:text-stone-900">
          Products
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/categories/${product.categorySlug}`}
          className="hover:text-stone-900"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-stone-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
              {product.category}
            </p>
            {product.inStock ? (
              <Badge variant="success">In stock</Badge>
            ) : (
              <Badge variant="warning">Out of stock</Badge>
            )}
          </div>

          <h1 className="mt-2 text-3xl font-semibold text-stone-900">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-stone-900">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="mt-6 leading-relaxed text-stone-600">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
