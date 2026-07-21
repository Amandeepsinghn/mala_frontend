import { parseDecimal } from "@/lib/utils";
import type {
  CategoryResponse,
  ProductResponse,
  ProductSummaryResponse,
} from "@/types/api";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80";

export function mapCategory(api: CategoryResponse): Category {
  return {
    id: api.id,
    name: api.name,
    slug: api.slug,
    description: api.description ?? "",
    image: api.image_url ?? PLACEHOLDER_IMAGE,
  };
}

export function mapProductSummary(
  api: ProductSummaryResponse,
  category?: { name: string; slug: string },
): Product {
  return {
    id: api.id,
    name: api.name,
    slug: api.slug,
    description: api.short_description ?? "",
    price: parseDecimal(api.price),
    currency: api.currency,
    images: api.primary_image_url ? [api.primary_image_url] : [PLACEHOLDER_IMAGE],
    category: category?.name ?? "",
    categorySlug: category?.slug ?? "",
    inStock: true,
    featured: api.is_featured,
  };
}

export function mapProductDetail(
  api: ProductResponse,
  category?: { name: string; slug: string },
): Product {
  const images = api.images
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
      return a.sort_order - b.sort_order;
    })
    .map((img) => img.url);

  return {
    id: api.id,
    name: api.name,
    slug: api.slug,
    description: api.description ?? api.short_description ?? "",
    price: parseDecimal(api.price),
    currency: api.currency,
    images: images.length > 0 ? images : [PLACEHOLDER_IMAGE],
    category: category?.name ?? "",
    categorySlug: category?.slug ?? "",
    inStock: api.is_active && api.stock_quantity > 0,
    featured: api.is_featured,
  };
}
