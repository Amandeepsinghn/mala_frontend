export type PreferredContact = "whatsapp" | "phone" | "email";

export interface ProductInquiryPayload {
  productId: number;
  productSlug: string;
  productName: string;
  fullName: string;
  phone: string;
  email: string;
  preferredContact: PreferredContact;
  message?: string;
}
