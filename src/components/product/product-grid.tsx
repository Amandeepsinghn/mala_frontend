import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export function ProductGrid({ products, title }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-stone-500">No products found.</p>
      </div>
    );
  }

  return (
    <section>
      {title && (
        <h2 className="mb-6 text-2xl font-semibold text-stone-900">{title}</h2>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
