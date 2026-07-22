import { apiFetch } from "@/lib/api-client";
import type { ProductInquiryPayload } from "@/types/inquiry";

export async function submitInquiry(
  payload: ProductInquiryPayload,
): Promise<void> {
  await apiFetch<void>("/enquiries", {
    method: "POST",
    body: JSON.stringify({
      productId: payload.productId,
      productSlug: payload.productSlug,
      productName: payload.productName,
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      preferredContact: payload.preferredContact,
      message: payload.message ?? "",
    }),
  });
}
