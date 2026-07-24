import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { getCategories, getFeaturedProducts } from "@/lib/api";
import {
  CONTACT_ADDRESS,
  CONTACT_PHONE,
  GOOGLE_MAPS_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  SITE_NAME,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <section className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden lg:min-h-[80vh]">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80"
          alt="Modern living room with curated furniture"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#f5f1eb]/20" />

        <div className="relative mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-7xl flex-col items-center justify-center px-5 py-16 text-center lg:min-h-[80vh] lg:px-8 lg:py-24">
          <p className="max-w-[17rem] text-[10px] font-medium uppercase tracking-[0.22em] text-stone-900 lg:max-w-none lg:text-sm lg:tracking-[0.35em]">
            {SITE_NAME} · Crafted for your home
          </p>
          <h1 className="mt-5 max-w-4xl text-[1.65rem] font-bold uppercase leading-[1.15] tracking-tight text-stone-900 sm:text-4xl lg:mt-6 lg:text-6xl xl:text-7xl">
            Furniture that feels like home
          </h1>
          <Link
            href="/products"
            className="mt-8 rounded-full bg-stone-900 px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800 lg:mt-10 lg:px-8"
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

      <section className="border-t border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold uppercase tracking-wide text-stone-900">
            Visit us
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            Visit our showroom in Kirti Nagar or reach out on Instagram and
            phone for enquiries and custom orders.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-stone-200 bg-white p-6">
              <p className="text-sm font-semibold text-stone-900">Location</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {CONTACT_ADDRESS}
              </p>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-stone-900 underline underline-offset-4 hover:text-stone-700"
              >
                Get directions
              </a>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-6">
              <p className="text-sm font-semibold text-stone-900">Instagram</p>
              <p className="mt-2 text-sm text-stone-600">
                Follow us for new collections, designs, and updates.
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-stone-900 hover:underline"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-6">
              <p className="text-sm font-semibold text-stone-900">Phone</p>
              <p className="mt-2 text-sm text-stone-600">
                Call or WhatsApp us for product details and orders.
              </p>
              <a
                href={`tel:+91${CONTACT_PHONE}`}
                className="mt-4 inline-block text-lg font-semibold tracking-wide text-stone-900 hover:underline"
              >
                +91 {CONTACT_PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
