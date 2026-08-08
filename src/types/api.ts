export interface ProductSummaryResponse {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  price: string | null;
  compare_at_price: string | null;
  currency: string;
  material: string | null;
  color: string | null;
  is_featured: boolean;
  primary_image_url: string | null;
  seatingOptions?: SeatingOptionResponse[] | null;
  quantityOptions?: QuantityOptionResponse[] | null;
  sideTableOptions?: SideTableOptionResponse[] | null;
  productId?: number;
}

export interface ProductImageResponse {
  id: number;
  url: string;
  public_id: string | null;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface SeatingOptionResponse {
  variantId?: number;
  variant_id?: number;
  seatingCapacity?: number;
  seating_capacity?: number;
  label?: string;
  price: string | null;
  compare_at_price?: string | null;
  compareAtPrice?: string | null;
  currency?: string;
  width_cm?: string | null;
  height_cm?: string | null;
  depth_cm?: string | null;
  widthCm?: string | null;
  heightCm?: string | null;
  depthCm?: string | null;
  is_active?: boolean;
  isActive?: boolean;
}

export interface QuantityOptionResponse {
  variantId?: number;
  variant_id?: number;
  quantity?: number;
  pack_quantity?: number;
  label?: string;
  price: string | null;
  compare_at_price?: string | null;
  compareAtPrice?: string | null;
  currency?: string;
  is_active?: boolean;
  isActive?: boolean;
}

export interface SideTableOptionResponse {
  variantId?: number;
  variant_id?: number;
  includesSideTable?: boolean | null;
  includes_side_table?: boolean | null;
  label?: string;
  price: string | null;
  compare_at_price?: string | null;
  compareAtPrice?: string | null;
  currency?: string;
  width_cm?: string | null;
  height_cm?: string | null;
  depth_cm?: string | null;
  widthCm?: string | null;
  heightCm?: string | null;
  depthCm?: string | null;
  is_active?: boolean;
  isActive?: boolean;
}

export interface ProductVariantResponse {
  id: number;
  sku: string;
  name: string;
  price: string | null;
  color: string | null;
  material: string | null;
  size_label: string | null;
  seating_capacity: number | null;
  pack_quantity?: number | null;
  includes_side_table?: boolean | null;
  width_cm: string | null;
  height_cm: string | null;
  depth_cm: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductResponse {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  sku: string | null;
  price: string | null;
  compare_at_price: string | null;
  currency: string;
  material: string | null;
  color: string | null;
  style: string | null;
  room_type: string | null;
  width_cm: string | null;
  height_cm: string | null;
  depth_cm: string | null;
  weight_kg: string | null;
  extra_specs: string | null;
  is_featured: boolean;
  is_active: boolean;
  stock_quantity: number;
  images: ProductImageResponse[];
  variants?: ProductVariantResponse[];
  seatingOptions?: SeatingOptionResponse[] | null;
  quantityOptions?: QuantityOptionResponse[] | null;
  sideTableOptions?: SideTableOptionResponse[] | null;
  productId?: number;
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: number | null;
  sort_order: number;
}

export interface CategoryProductsResponse {
  category: CategoryResponse;
  products: ProductSummaryResponse[];
  total: number;
}

export interface ProductSearchResponse {
  query: string | null;
  products: ProductSummaryResponse[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartItemResponse {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  variant_id: number | null;
  variant_name: string | null;
  quantity: number;
  unit_price: string | null;
  line_total: string | null;
  currency: string;
  primary_image_url: string | null;
}

export interface CartResponse {
  id: number;
  items: CartItemResponse[];
  total_items: number;
  subtotal: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string | null;
}

export interface AddToCartRequest {
  product_id: number;
  variant_id?: number | null;
  quantity?: number;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
}

export interface ApiValidationError {
  detail: { loc: (string | number)[]; msg: string; type: string }[];
}
