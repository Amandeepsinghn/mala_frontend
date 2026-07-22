import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailPanel } from "@/components/product/product-detail-panel";
import { ProductGallery } from "@/components/product/product-gallery";
import { getProductBySlug } from "@/lib/api";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
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

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
        <ProductGallery images={product.images} alt={product.name} />
        <ProductDetailPanel product={product} />
      </div>
    </div>
  );
}
