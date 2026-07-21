import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { getProductsByCategory } from "@/lib/api";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductsByCategory(slug);
  if (!result) return { title: "Category not found" };
  return {
    title: result.category.name,
    description: result.category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const result = await getProductsByCategory(slug);

  if (!result) notFound();

  const { category, products } = result;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-900">{category.name}</h1>
        <p className="mt-2 text-stone-600">{category.description}</p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
