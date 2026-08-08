import { getCategoryImage } from "@/lib/category-images";
import { parseDecimal, parseOptionalDecimal } from "@/lib/utils";
import type {
  CategoryResponse,
  ProductResponse,
  ProductSummaryResponse,
  ProductVariantResponse,
  QuantityOptionResponse,
  SeatingOptionResponse,
  SideTableOptionResponse,
} from "@/types/api";
import type { Category } from "@/types/category";
import type {
  Product,
  ProductVariant,
  QuantityOption,
  SeatingOption,
  SideTableOption,
} from "@/types/product";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80";

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  tables: "Table",
  "dining-tables": "Dining Table",
};

export function mapCategory(api: CategoryResponse): Category {
  return {
    id: api.id,
    name: CATEGORY_DISPLAY_NAMES[api.slug] ?? api.name,
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
    packQuantity: api.pack_quantity ?? null,
    includesSideTable: api.includes_side_table ?? null,
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
): SeatingOption | null {
  const variantId = api.variantId ?? api.variant_id;
  if (variantId == null) return null;

  const seatingCapacity = api.seatingCapacity ?? api.seating_capacity ?? null;
  const compareAtPrice = parseDecimal(
    api.compare_at_price ?? api.compareAtPrice,
  );
  const label = api.label?.trim() ?? "";

  if (seatingCapacity == null && !label) return null;

  return {
    variantId,
    seatingCapacity,
    label,
    price: parseDecimal(api.price),
    compareAtPrice: compareAtPrice > 0 ? compareAtPrice : null,
    currency: api.currency ?? fallbackCurrency,
    widthCm: parseOptionalDecimal(api.width_cm ?? api.widthCm),
    heightCm: parseOptionalDecimal(api.height_cm ?? api.heightCm),
    depthCm: parseOptionalDecimal(api.depth_cm ?? api.depthCm),
    isActive: api.is_active ?? api.isActive ?? true,
  };
}

function mapSeatingOptions(
  options: SeatingOptionResponse[] | null | undefined,
  currency: string,
): SeatingOption[] {
  return (options ?? [])
    .map((option) => mapSeatingOption(option, currency))
    .filter((option): option is SeatingOption => option != null && option.isActive)
    .sort((a, b) => (a.seatingCapacity ?? 0) - (b.seatingCapacity ?? 0));
}

function mapQuantityOption(
  api: QuantityOptionResponse,
  fallbackCurrency: string,
): QuantityOption | null {
  const quantity = api.quantity ?? api.pack_quantity;
  if (quantity == null) return null;

  const compareAtPrice = parseDecimal(
    api.compare_at_price ?? api.compareAtPrice,
  );
  const label =
    api.label?.trim() ||
    (quantity === 1 ? "1 Chair" : `${quantity} Chairs`);

  return {
    variantId: api.variantId ?? api.variant_id ?? null,
    quantity,
    label,
    price: parseDecimal(api.price),
    compareAtPrice: compareAtPrice > 0 ? compareAtPrice : null,
    currency: api.currency ?? fallbackCurrency,
    isActive: api.is_active ?? api.isActive ?? true,
  };
}

function mapQuantityOptions(
  options: QuantityOptionResponse[] | null | undefined,
  currency: string,
): QuantityOption[] {
  return (options ?? [])
    .map((option) => mapQuantityOption(option, currency))
    .filter((option): option is QuantityOption => option != null && option.isActive)
    .sort((a, b) => a.quantity - b.quantity);
}

function mapSideTableOption(
  api: SideTableOptionResponse,
  fallbackCurrency: string,
): SideTableOption | null {
  const compareAtPrice = parseDecimal(
    api.compare_at_price ?? api.compareAtPrice,
  );
  const includesSideTable =
    api.includesSideTable ?? api.includes_side_table ?? null;
  const label =
    api.label?.trim() ||
    (includesSideTable === true
      ? "With side table"
      : includesSideTable === false
        ? "Without side table"
        : "");

  if (!label && includesSideTable == null) return null;

  return {
    variantId: api.variantId ?? api.variant_id ?? null,
    includesSideTable,
    label: label || "Bed option",
    price: parseDecimal(api.price),
    compareAtPrice: compareAtPrice > 0 ? compareAtPrice : null,
    currency: api.currency ?? fallbackCurrency,
    widthCm: parseOptionalDecimal(api.width_cm ?? api.widthCm),
    heightCm: parseOptionalDecimal(api.height_cm ?? api.heightCm),
    depthCm: parseOptionalDecimal(api.depth_cm ?? api.depthCm),
    isActive: api.is_active ?? api.isActive ?? true,
  };
}

function mapSideTableOptions(
  options: SideTableOptionResponse[] | null | undefined,
  currency: string,
): SideTableOption[] {
  return (options ?? [])
    .map((option) => mapSideTableOption(option, currency))
    .filter((option): option is SideTableOption => option != null && option.isActive);
}

function quantityOptionsFromVariants(
  variants: ProductVariant[],
  currency: string,
): QuantityOption[] {
  return variants
    .filter((variant) => variant.packQuantity != null && variant.packQuantity > 0)
    .map((variant) => ({
      variantId: variant.id,
      quantity: variant.packQuantity as number,
      label:
        variant.sizeLabel?.trim() ||
        variant.name ||
        ((variant.packQuantity as number) === 1
          ? "1 Chair"
          : `${variant.packQuantity} Chairs`),
      price: variant.price ?? 0,
      compareAtPrice: null,
      currency,
      isActive: variant.isActive,
    }))
    .sort((a, b) => a.quantity - b.quantity);
}

function sideTableOptionsFromVariants(
  variants: ProductVariant[],
  currency: string,
): SideTableOption[] {
  return variants
    .filter((variant) => variant.includesSideTable != null)
    .map((variant) => ({
      variantId: variant.id,
      includesSideTable: variant.includesSideTable ?? null,
      label:
        variant.sizeLabel?.trim() ||
        variant.name ||
        (variant.includesSideTable
          ? "With side table"
          : "Without side table"),
      price: variant.price ?? 0,
      compareAtPrice: null,
      currency,
      widthCm: variant.widthCm,
      heightCm: variant.heightCm,
      depthCm: variant.depthCm,
      isActive: variant.isActive,
    }));
}

export function mapProductSummary(
  api: ProductSummaryResponse,
  category?: { name: string; slug: string },
): Product {
  const compareAtPrice = parseDecimal(api.compare_at_price);
  const seatingOptions = mapSeatingOptions(api.seatingOptions, api.currency);
  const quantityOptions = mapQuantityOptions(api.quantityOptions, api.currency);
  const sideTableOptions = mapSideTableOptions(
    api.sideTableOptions,
    api.currency,
  );

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
    quantityOptions,
    sideTableOptions,
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
  const quantityOptions =
    mapQuantityOptions(api.quantityOptions, api.currency).length > 0
      ? mapQuantityOptions(api.quantityOptions, api.currency)
      : quantityOptionsFromVariants(variants, api.currency);
  const sideTableOptions =
    mapSideTableOptions(api.sideTableOptions, api.currency).length > 0
      ? mapSideTableOptions(api.sideTableOptions, api.currency)
      : sideTableOptionsFromVariants(variants, api.currency);

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
    quantityOptions,
    sideTableOptions,
    inStock: api.is_active && api.stock_quantity > 0,
    stockQuantity: api.stock_quantity,
    featured: api.is_featured,
  };
}
