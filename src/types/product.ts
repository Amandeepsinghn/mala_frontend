export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  categorySlug: string;
  inStock: boolean;
  featured?: boolean;
}
