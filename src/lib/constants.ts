export const SITE_NAME = "MALAA FURNITURES";
export const SITE_LOGO_PRIMARY = "MALAA.";
export const SITE_LOGO_SECONDARY = "FURNITURES";
export const SITE_DESCRIPTION =
  "Curated furniture for modern living — sofas, tables, chairs, and more.";

export const CONTACT_PHONE = "9899048933";
export const CONTACT_ADDRESS =
  "B-41, Timber Market, WHS, Kirti Nagar, New Delhi - 110015";
export const GOOGLE_MAPS_URL = "https://share.google/SyJvCMSks8bBI930z";
export const INSTAGRAM_URL =
  "https://www.instagram.com/malaa_furnitures_kirtinagar?igsh=MWI0OWRzMGVrcWVtaw==";
export const INSTAGRAM_HANDLE = "@malaa_furnitures_kirtinagar";
export const PRODUCT_DELIVERY_MESSAGE =
  "Each piece is made to order. Please allow 15–20 days for crafting and delivery — both included.";

/** Standard Indian king-size mattress / bed footprint used when API dims are missing */
export const KING_SIZE_DIMENSIONS = {
  label: "King Size",
  widthCm: 183,
  lengthCm: 198,
  widthIn: 72,
  lengthIn: 78,
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/categories/sofas", label: "Sofa" },
  { href: "/categories/beds", label: "Bed" },
  { href: "/categories/tables", label: "Dining Table" },
  { href: "/categories/chairs", label: "Chair" },
] as const;
