"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

interface SearchFormProps {
  initialQuery?: string;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSubmitSuccess?: () => void;
}

export function SearchForm({
  initialQuery = "",
  className,
  inputClassName,
  placeholder = "Search furniture…",
  autoFocus = false,
  onSubmitSuccess,
}: SearchFormProps) {
  const router = useRouter();
  const inputId = useId();
  const listId = useId();
  const containerRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const result = await searchProducts({ q: trimmed, limit: 2 });
        if (cancelled) return;
        setSuggestions(result.products);
        setOpen(true);
        setActiveIndex(-1);
      } catch {
        if (cancelled) return;
        setSuggestions([]);
        setOpen(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function goToResults(value: string) {
    const trimmed = value.trim();
    setOpen(false);
    if (trimmed) {
      router.push(`/products?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/products");
    }
    onSubmitSuccess?.();
  }

  function goToProduct(product: Product) {
    setOpen(false);
    setQuery(product.name);
    router.push(`/products/${product.slug}`);
    onSubmitSuccess?.();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goToProduct(suggestions[activeIndex]);
      return;
    }
    goToResults(query);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        current < suggestions.length - 1 ? current + 1 : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current > 0 ? current - 1 : suggestions.length - 1,
      );
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown =
    open && query.trim().length >= 2 && (loading || suggestions.length > 0);

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className={cn("relative w-full", className)}
      role="search"
    >
      <label htmlFor={inputId} className="sr-only">
        Search products
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => {
          if (query.trim().length >= 2 && suggestions.length > 0) {
            setOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={showDropdown}
        className={cn(
          "w-full rounded-full border border-stone-300 bg-white py-2.5 pl-4 pr-11 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500",
          inputClassName,
        )}
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>

      {showDropdown && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg"
        >
          {loading && suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-stone-500">Searching…</p>
          ) : (
            <ul>
              {suggestions.map((product, index) => {
                const image = product.images[0];
                return (
                  <li key={product.id} role="option" aria-selected={activeIndex === index}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => goToProduct(product)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                        activeIndex === index
                          ? "bg-stone-100"
                          : "hover:bg-stone-50",
                      )}
                    >
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-stone-100">
                        {image ? (
                          <Image
                            src={image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-stone-900">
                          {product.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-stone-500">
                          ID {product.productId} ·{" "}
                          {formatPrice(product.price, product.currency)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {!loading && suggestions.length > 0 && (
            <Link
              href={`/products?q=${encodeURIComponent(query.trim())}`}
              onClick={() => {
                setOpen(false);
                onSubmitSuccess?.();
              }}
              className="block border-t border-stone-100 px-4 py-2.5 text-center text-xs font-medium uppercase tracking-[0.12em] text-stone-700 hover:bg-stone-50"
            >
              View all results
            </Link>
          )}
        </div>
      )}
    </form>
  );
}
