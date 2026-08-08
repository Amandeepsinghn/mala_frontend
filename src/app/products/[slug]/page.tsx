import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailPanel } from "@/components/product/product-detail-panel";
import { ProductGallery } from "@/components/product/product-gallery";
import { SimilarProducts } from "@/components/product/similar-products";
import { getProductBySlug, getSimilarProducts } from "@/lib/api";

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

  const similarProducts = await getSimilarProducts(product, 8);

  return (
    <div className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 py-6 sm:px-6 sm:py-12 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone-500 sm:mb-8">
        <Link href="/products" className="hover:text-stone-900">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${product.categorySlug}`}
          className="hover:text-stone-900"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="min-w-0 break-words text-stone-900">{product.name}</span>
      </nav>

      <div className="grid w-full min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
        <ProductGallery images={product.images} alt={product.name} />
        <ProductDetailPanel product={product} />
      </div>

      <SimilarProducts
        products={similarProducts}
        categorySlug={product.categorySlug}
        categoryName={product.category}
      />
    </div>
  );
}
