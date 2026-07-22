const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80";

export const CATEGORY_IMAGES: Record<string, string> = {
  sofas:
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
  tables:
    "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80",
  chairs:
    "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
  beds:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
  "dining-tables":
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
};

export function getCategoryImage(slug: string, apiImage?: string | null): string {
  return CATEGORY_IMAGES[slug] ?? apiImage ?? PLACEHOLDER_IMAGE;
}
