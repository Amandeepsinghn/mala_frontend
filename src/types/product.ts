export interface Product {
  id: number;
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
  inStock: boolean;
  stockQuantity?: number;
  featured?: boolean;
}
