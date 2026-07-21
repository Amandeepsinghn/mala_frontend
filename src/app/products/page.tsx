import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/product-grid";
import { getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our full collection of furniture.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-900">All products</h1>
        <p className="mt-2 text-stone-600">
          {products.length} items in our collection
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
