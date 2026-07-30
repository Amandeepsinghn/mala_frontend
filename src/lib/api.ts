import { apiFetch } from "@/lib/api-client";
import {
  mapCategory,
  mapProductDetail,
  mapProductSummary,
} from "@/lib/mappers";
import { categories as mockCategories, products as mockProducts } from "@/lib/mock-data";
import type {
  CategoryProductsResponse,
  CategoryResponse,
  ProductResponse,
  ProductSearchResponse,
  ProductSummaryResponse,
} from "@/types/api";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

async function fetchCategoriesFromApi(): Promise<CategoryResponse[]> {
  return apiFetch<CategoryResponse[]>("/categories");
}

async function fetchProductsFromApi(
  featured?: boolean,
): Promise<ProductSummaryResponse[]> {
  const params = new URLSearchParams({
    limit: "100",
    skip: "0",
  });
  if (featured !== undefined) {
    params.set("featured", String(featured));
  }
  return apiFetch<ProductSummaryResponse[]>(`/products?${params}`);
}

async function resolveCategory(
  categoryId: number,
  categoryList?: Category[],
): Promise<{ name: string; slug: string } | undefined> {
  const categories = categoryList ?? (await getCategories());
  const match = categories.find((c) => c.id === categoryId);
  if (!match) return undefined;
  return { name: match.name, slug: match.slug };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchCategoriesFromApi();
    return data.map(mapCategory);
  } catch (error) {
    if (USE_MOCK) return mockCategories;
    console.error("[api] getCategories failed:", error);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  try {
    const data = await apiFetch<CategoryResponse>(`/categories/${slug}`);
    return mapCategory(data);
  } catch (error) {
    if (USE_MOCK) {
      return mockCategories.find((c) => c.slug === slug);
    }
    console.error(`[api] getCategoryBySlug(${slug}) failed:`, error);
    return undefined;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const apiProducts = await fetchProductsFromApi(false);
    return apiProducts.map((p) => mapProductSummary(p));
  } catch (error) {
    if (USE_MOCK) return mockProducts;
    console.error("[api] getProducts failed:", error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const apiProducts = await fetchProductsFromApi(true);
    return apiProducts.map((p) => mapProductSummary(p));
  } catch (error) {
    if (USE_MOCK) return mockProducts.filter((p) => p.featured);
    console.error("[api] getFeaturedProducts failed:", error);
    return [];
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  try {
    const [apiProduct, categoryList] = await Promise.all([
      apiFetch<ProductResponse>(`/products/${slug}`),
      getCategories(),
    ]);
    const category = await resolveCategory(
      apiProduct.category_id,
      categoryList,
    );
    return mapProductDetail(apiProduct, category);
  } catch (error) {
    if (USE_MOCK) return mockProducts.find((p) => p.slug === slug);
    console.error(`[api] getProductBySlug(${slug}) failed:`, error);
    return undefined;
  }
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<{ category: Category; products: Product[] } | null> {
  try {
    const data = await apiFetch<CategoryProductsResponse>(
      `/categories/${categorySlug}/products`,
    );
    const category = mapCategory(data.category);
    const products = data.products.map((p) =>
      mapProductSummary(p, { name: category.name, slug: category.slug }),
    );
    return { category, products };
  } catch (error) {
    if (USE_MOCK) {
      const category = mockCategories.find((c) => c.slug === categorySlug);
      if (!category) return null;
      const products = mockProducts.filter(
        (p) => p.categorySlug === categorySlug,
      );
      return { category, products };
    }
    console.error(`[api] getProductsByCategory(${categorySlug}) failed:`, error);
    return null;
  }
}

export interface SearchProductsParams {
  q?: string;
  category?: string;
  material?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  skip?: number;
  limit?: number;
}

export interface SearchProductsResult {
  query: string | null;
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export async function searchProducts(
  params: SearchProductsParams = {},
): Promise<SearchProductsResult> {
  const searchParams = new URLSearchParams();
  if (params.q?.trim()) searchParams.set("q", params.q.trim());
  if (params.category) searchParams.set("category", params.category);
  if (params.material) searchParams.set("material", params.material);
  if (params.color) searchParams.set("color", params.color);
  if (params.minPrice != null) searchParams.set("min_price", String(params.minPrice));
  if (params.maxPrice != null) searchParams.set("max_price", String(params.maxPrice));
  searchParams.set("skip", String(params.skip ?? 0));
  searchParams.set("limit", String(params.limit ?? 20));

  try {
    const data = await apiFetch<ProductSearchResponse>(
      `/products/search?${searchParams}`,
    );
    return {
      query: data.query,
      products: data.products.map((p) => mapProductSummary(p)),
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };
  } catch (error) {
    if (USE_MOCK) {
      const q = params.q?.trim().toLowerCase() ?? "";
      const filtered = mockProducts.filter((p) => {
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      });
      return {
        query: params.q?.trim() ?? null,
        products: filtered,
        total: filtered.length,
        skip: params.skip ?? 0,
        limit: params.limit ?? 20,
      };
    }
    console.error("[api] searchProducts failed:", error);
    return {
      query: params.q?.trim() ?? null,
      products: [],
      total: 0,
      skip: params.skip ?? 0,
      limit: params.limit ?? 20,
    };
  }
}
