import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export const categories: Category[] = [
  {
    id: 1,
    name: "Sofas",
    slug: "sofas",
    description: "Comfortable seating for every living room.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  },
  {
    id: 2,
    name: "Tables",
    slug: "tables",
    description: "Dining and coffee tables crafted to last.",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
  },
  {
    id: 3,
    name: "Chairs",
    slug: "chairs",
    description: "Accent and dining chairs with timeless design.",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
  },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Oslo Linen Sofa",
    slug: "oslo-linen-sofa",
    description:
      "A minimalist three-seater upholstered in breathable linen with solid oak legs. Perfect for modern living spaces.",
    price: 45999,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80",
    ],
    category: "Sofas",
    categorySlug: "sofas",
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "Nordic Oak Dining Table",
    slug: "nordic-oak-dining-table",
    description:
      "Seats six comfortably. Crafted from sustainably sourced oak with a natural matte finish.",
    price: 32999,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80",
    ],
    category: "Tables",
    categorySlug: "tables",
    inStock: true,
    featured: true,
  },
  {
    id: 3,
    name: "Haven Accent Chair",
    slug: "haven-accent-chair",
    description:
      "Curved silhouette with plush cushioning. A statement piece for reading nooks and bedrooms.",
    price: 18999,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1200&q=80",
    ],
    category: "Chairs",
    categorySlug: "chairs",
    inStock: true,
    featured: true,
  },
  {
    id: 4,
    name: "Mara Coffee Table",
    slug: "mara-coffee-table",
    description:
      "Low-profile walnut coffee table with rounded edges and hidden storage compartment.",
    price: 14999,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=1200&q=80",
    ],
    category: "Tables",
    categorySlug: "tables",
    inStock: true,
  },
  {
    id: 5,
    name: "Sage Velvet Sofa",
    slug: "sage-velvet-sofa",
    description:
      "Deep emerald velvet with channel tufting. Luxurious comfort meets bold colour.",
    price: 52999,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1540574163026-d643ea20ade2?w=1200&q=80",
    ],
    category: "Sofas",
    categorySlug: "sofas",
    inStock: true,
  },
  {
    id: 6,
    name: "Luna Dining Chair",
    slug: "luna-dining-chair",
    description:
      "Set of two cane-back dining chairs with a woven seat. Lightweight yet sturdy.",
    price: 8999,
    currency: "INR",
    images: [
      "https://images.unsplash.com/photo-1580480055273-228a3b8a9f81?w=1200&q=80",
    ],
    category: "Chairs",
    categorySlug: "chairs",
    inStock: false,
  },
];
