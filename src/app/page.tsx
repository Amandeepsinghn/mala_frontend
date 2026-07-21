import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { getCategories, getFeaturedProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <section className="relative bg-stone-900 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
              New collection
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Furniture that feels like home
            </h1>
            <p className="mt-4 max-w-lg text-lg text-stone-300">
              Discover thoughtfully designed pieces — sofas, tables, and chairs
              crafted for modern living.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/products">
                <Button size="lg" variant="secondary">
                  Shop all
                </Button>
              </Link>
              <Link href="/categories/sofas">
                <Button size="lg" variant="outline" className="border-stone-600 text-white hover:bg-stone-800">
                  Browse sofas
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80"
              alt="Modern living room"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-stone-900">Shop by category</h2>
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
