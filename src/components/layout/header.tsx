"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  INSTAGRAM_URL,
  NAV_LINKS,
  SITE_LOGO_PRIMARY,
  SITE_LOGO_SECONDARY,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { SearchForm } from "@/components/layout/search-form";

function isNavActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex min-w-0 items-baseline gap-1.5 lg:gap-2">
      <span className="text-[1.125rem] font-bold tracking-tight text-stone-900 lg:text-2xl">
        {SITE_LOGO_PRIMARY}
      </span>
      <span className="truncate text-[10px] font-normal uppercase tracking-[0.2em] text-stone-900 lg:text-sm">
        {SITE_LOGO_SECONDARY}
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[#f5f1eb] lg:static">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex h-14 items-center justify-between gap-3 lg:h-auto lg:py-5">
          <Logo />

          {/* Laptop / desktop actions — unchanged */}
          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-900 transition-colors hover:bg-white/60"
              aria-label="Follow us on Instagram"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="max-w-[10rem] truncate text-xs font-medium uppercase tracking-[0.15em] text-stone-900">
                  {user?.full_name ?? user?.email ?? "Account"}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-medium uppercase tracking-[0.15em] text-stone-900 underline underline-offset-4"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-medium uppercase tracking-[0.15em] text-stone-900 underline underline-offset-4"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-stone-900 px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-stone-800"
                >
                  Sign up
                </Link>
              </>
            )}
            <Link
              href="/cart"
              className="rounded-full border border-stone-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-stone-900 transition-colors hover:bg-white/60"
            >
              Cart{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </div>

          {/* Phone actions — bag + hamburger only */}
          <div className="flex shrink-0 items-center gap-0.5 lg:hidden">
            <Link
              href="/cart"
              className="relative flex h-11 w-11 items-center justify-center text-stone-900"
              aria-label={
                totalItems > 0 ? `Cart, ${totalItems} items` : "Cart"
              }
            >
              <ShoppingBagIcon className="h-[22px] w-[22px]" />
              {totalItems > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-stone-900 px-1 text-[10px] font-semibold leading-none text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center text-stone-900"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Laptop / desktop nav — unchanged */}
        <div className="hidden border-t border-stone-300/80 lg:block">
          <div className="flex items-center justify-between gap-8 py-4">
            <nav className="flex items-center gap-x-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-stone-600",
                    isNavActive(pathname, link.href)
                      ? "text-stone-900"
                      : "text-stone-900/80",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <SearchForm className="max-w-xs shrink-0" inputClassName="py-2" />
          </div>
        </div>
      </div>

      {/* Phone menu */}
      {menuOpen && (
        <div className="border-t border-stone-300/80 bg-[#f5f1eb] lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            <div className="py-3">
              <SearchForm
                onSubmitSuccess={() => setMenuOpen(false)}
                inputClassName="py-2.5"
              />
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-b border-stone-200 py-3.5 text-sm font-medium uppercase tracking-[0.18em]",
                  isNavActive(pathname, link.href)
                    ? "text-stone-900"
                    : "text-stone-700",
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-5 flex flex-col gap-3 pb-4">
              {isAuthenticated ? (
                <>
                  <p className="truncate text-xs uppercase tracking-[0.15em] text-stone-600">
                    {user?.full_name ?? user?.email ?? "Account"}
                  </p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-full border border-stone-900 py-3 text-xs font-medium uppercase tracking-[0.15em] text-stone-900"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full rounded-full border border-stone-900 py-3 text-center text-xs font-medium uppercase tracking-[0.15em] text-stone-900"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="w-full rounded-full bg-stone-900 py-3 text-center text-xs font-medium uppercase tracking-[0.15em] text-white"
                  >
                    Sign up
                  </Link>
                </>
              )}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center justify-center gap-2 py-2 text-xs font-medium uppercase tracking-[0.15em] text-stone-700"
              >
                <InstagramIcon className="h-4 w-4" />
                Instagram
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
