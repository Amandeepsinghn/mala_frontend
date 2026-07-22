"use client";

import { useEffect, useId, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { submitInquiry } from "@/lib/inquiry-api";
import type { PreferredContact, ProductInquiryPayload } from "@/types/inquiry";
import type { Product } from "@/types/product";

interface ProductEnquiryModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

function StepHeading({ step, title }: { step: number; title: string }) {
  return (
    <h3 className="mt-8 text-base font-semibold text-stone-900">
      <span className="text-amber-800">{step}.</span> {title}
    </h3>
  );
}

function ProductEnquiryForm({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const formId = useId();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferredContact, setPreferredContact] =
    useState<PreferredContact>("whatsapp");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload: ProductInquiryPayload = {
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      fullName: form.get("fullName") as string,
      phone: form.get("phone") as string,
      email: form.get("email") as string,
      preferredContact,
      message: (form.get("message") as string) || undefined,
    };

    try {
      await submitInquiry(payload);
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to send inquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <p className="text-2xl font-bold uppercase tracking-wide text-stone-900">
          Thank you
        </p>
        <p className="mt-4 text-stone-600">
          We received your inquiry about{" "}
          <span className="font-medium text-stone-900">{product.name}</span>.
          Our team will reach out via your preferred contact method shortly.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-800">
        Product inquiry
      </p>
      <h2 className="mt-3 text-4xl font-bold uppercase tracking-tight text-stone-900 sm:text-5xl">
        Inquiry
      </h2>
      <p className="mt-3 text-stone-600">
        Tell us how to reach you and we will confirm your order.
      </p>
      <p className="mt-2 text-sm text-stone-500">
        Regarding: <span className="font-medium text-stone-800">{product.name}</span>
      </p>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <StepHeading step={1} title="Customer contact info" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <input
          name="fullName"
          type="text"
          placeholder="Full name"
          required
          className="rounded-md border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone number"
          required
          className="rounded-md border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
      </div>
      <input
        name="email"
        type="email"
        placeholder="Email address"
        required
        className="mt-4 w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
      />

      <StepHeading step={2} title="Preferred contact" />
      <fieldset className="mt-4">
        <legend className="sr-only">Preferred contact method</legend>
        <div className="flex flex-wrap gap-6">
          {(
            [
              { value: "whatsapp", label: "WhatsApp" },
              { value: "phone", label: "Phone" },
              { value: "email", label: "Email" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-stone-800"
            >
              <input
                type="radio"
                name="preferredContact"
                value={option.value}
                checked={preferredContact === option.value}
                onChange={() => setPreferredContact(option.value)}
                className="h-4 w-4 accent-stone-900"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <StepHeading step={3} title="Optional message" />
      <textarea
        name="message"
        rows={5}
        placeholder="Tell us anything about your requirement"
        className="mt-4 w-full resize-y rounded-md border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-10 rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send inquiry"}
      </button>
    </form>
  );
}

export function ProductEnquiryModal({
  product,
  open,
  onClose,
}: ProductEnquiryModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f1eb]/95"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-title"
    >
      <div className="mx-auto min-h-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <button
          type="button"
          onClick={onClose}
          className="mb-6 text-sm font-medium uppercase tracking-[0.15em] text-stone-600 underline underline-offset-4 hover:text-stone-900"
        >
          Back to product
        </button>

        <div className="rounded-lg bg-white px-6 py-8 sm:px-10 sm:py-12">
          <ProductEnquiryForm product={product} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
