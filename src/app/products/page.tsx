import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/product-grid";
import { getProducts, searchProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our full collection of furniture.",
};

interface ProductsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const result = query
    ? await searchProducts({ q: query, limit: 100 })
    : {
        query: null,
        products: await getProducts(),
        total: 0,
      };

  const products = result.products;
  const total = query ? result.total : products.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-900">
          {query ? "Search results" : "All products"}
        </h1>
        <p className="mt-2 text-stone-600">
          {query
            ? `${total} result${total === 1 ? "" : "s"} for “${query}”`
            : `${total} items in our collection`}
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
