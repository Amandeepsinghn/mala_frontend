import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { getCategories, getFeaturedProducts } from "@/lib/api";
import { SITE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <section className="relative min-h-[70vh] overflow-hidden sm:min-h-[80vh]">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80"
          alt="Modern living room with curated furniture"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#f5f1eb]/20" />

        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:min-h-[80vh] sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-stone-900 sm:text-sm">
            {SITE_NAME} · Crafted for your home
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold uppercase leading-tight tracking-tight text-stone-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Furniture that feels like home
          </h1>
          <Link
            href="/products"
            className="mt-10 rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            Explore collection
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold uppercase tracking-wide text-stone-900">
          Shop by category
        </h2>
        {categories.length === 0 ? (
          <p className="mt-8 text-stone-500">
            No categories yet. Add them in the backend admin.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative aspect-[3/2] overflow-hidden rounded-lg"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                  <p className="mt-1 text-sm text-stone-200">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <ProductGrid products={featuredProducts} title="Featured products" />
        </div>
      </section>
    </>
  );
}
