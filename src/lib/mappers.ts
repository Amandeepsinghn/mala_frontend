import { getCategoryImage } from "@/lib/category-images";
import { parseDecimal, parseOptionalDecimal } from "@/lib/utils";
import type {
  CategoryResponse,
  ProductResponse,
  ProductSummaryResponse,
  ProductVariantResponse,
  SeatingOptionResponse,
} from "@/types/api";
import type { Category } from "@/types/category";
import type { Product, ProductVariant, SeatingOption } from "@/types/product";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80";

export function mapCategory(api: CategoryResponse): Category {
  return {
    id: api.id,
    name: api.name,
    slug: api.slug,
    description: api.description ?? "",
    image: getCategoryImage(api.slug, api.image_url),
  };
}

function mapVariant(api: ProductVariantResponse): ProductVariant {
  return {
    id: api.id,
    sku: api.sku,
    name: api.name,
    price: api.price != null ? parseDecimal(api.price) : null,
    color: api.color,
    material: api.material,
    sizeLabel: api.size_label,
    seatingCapacity: api.seating_capacity,
    widthCm: parseOptionalDecimal(api.width_cm),
    heightCm: parseOptionalDecimal(api.height_cm),
    depthCm: parseOptionalDecimal(api.depth_cm),
    stockQuantity: api.stock_quantity,
    isActive: api.is_active,
  };
}

function mapSeatingOption(
  api: SeatingOptionResponse,
  fallbackCurrency: string,
): SeatingOption {
  const compareAtPrice = parseDecimal(api.compare_at_price);
  return {
    variantId: api.variantId,
    seatingCapacity: api.seatingCapacity,
    label: api.label,
    price: parseDecimal(api.price),
    compareAtPrice: compareAtPrice > 0 ? compareAtPrice : null,
    currency: api.currency ?? fallbackCurrency,
    widthCm: parseOptionalDecimal(api.width_cm),
    heightCm: parseOptionalDecimal(api.height_cm),
    depthCm: parseOptionalDecimal(api.depth_cm),
    isActive: api.is_active ?? true,
  };
}

function mapSeatingOptions(
  options: SeatingOptionResponse[] | undefined,
  currency: string,
): SeatingOption[] {
  return (options ?? [])
    .map((option) => mapSeatingOption(option, currency))
    .filter((option) => option.isActive)
    .sort((a, b) => a.seatingCapacity - b.seatingCapacity);
}

export function mapProductSummary(
  api: ProductSummaryResponse,
  category?: { name: string; slug: string },
): Product {
  const compareAtPrice = parseDecimal(api.compare_at_price);
  const seatingOptions = mapSeatingOptions(api.seatingOptions, api.currency);

  return {
    id: api.id,
    productId: api.productId ?? api.id,
    name: api.name,
    slug: api.slug,
    description: api.short_description ?? "",
    shortDescription: api.short_description ?? "",
    price: parseDecimal(api.price),
    compareAtPrice: compareAtPrice > 0 ? compareAtPrice : null,
    currency: api.currency,
    images: api.primary_image_url ? [api.primary_image_url] : [PLACEHOLDER_IMAGE],
    category: category?.name ?? "",
    categorySlug: category?.slug ?? "",
    material: api.material,
    color: api.color,
    seatingOptions,
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

  const compareAtPrice = parseDecimal(api.compare_at_price);
  const variants = (api.variants ?? [])
    .map(mapVariant)
    .filter((variant) => variant.isActive)
    .sort((a, b) => (a.seatingCapacity ?? 0) - (b.seatingCapacity ?? 0));
  const seatingOptions = mapSeatingOptions(api.seatingOptions, api.currency);

  return {
    id: api.id,
    productId: api.productId ?? api.id,
    name: api.name,
    slug: api.slug,
    description: api.description ?? api.short_description ?? "",
    shortDescription: api.short_description ?? "",
    price: parseDecimal(api.price),
    compareAtPrice: compareAtPrice > 0 ? compareAtPrice : null,
    currency: api.currency,
    images: images.length > 0 ? images : [PLACEHOLDER_IMAGE],
    category: category?.name ?? "",
    categorySlug: category?.slug ?? "",
    material: api.material,
    color: api.color,
    style: api.style,
    roomType: api.room_type,
    widthCm: parseOptionalDecimal(api.width_cm),
    heightCm: parseOptionalDecimal(api.height_cm),
    depthCm: parseOptionalDecimal(api.depth_cm),
    weightKg: parseOptionalDecimal(api.weight_kg),
    variants,
    seatingOptions,
    inStock: api.is_active && api.stock_quantity > 0,
    stockQuantity: api.stock_quantity,
    featured: api.is_featured,
  };
}
