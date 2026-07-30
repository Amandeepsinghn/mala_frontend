export interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  price: number | null;
  color?: string | null;
  material?: string | null;
  sizeLabel?: string | null;
  seatingCapacity?: number | null;
  widthCm?: number | null;
  heightCm?: number | null;
  depthCm?: number | null;
  stockQuantity: number;
  isActive: boolean;
}

export interface SeatingOption {
  variantId: number;
  seatingCapacity: number;
  label: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  widthCm?: number | null;
  heightCm?: number | null;
  depthCm?: number | null;
  isActive: boolean;
}

export interface Product {
  id: number;
  productId: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  images: string[];
  category: string;
  categorySlug: string;
  material?: string | null;
  color?: string | null;
  style?: string | null;
  roomType?: string | null;
  widthCm?: number | null;
  heightCm?: number | null;
  depthCm?: number | null;
  weightKg?: number | null;
  variants?: ProductVariant[];
  seatingOptions?: SeatingOption[];
  selectedVariantId?: number | null;
  selectedVariantName?: string | null;
  inStock: boolean;
  stockQuantity?: number;
  featured?: boolean;
}
