"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS, INSTAGRAM_URL, SITE_LOGO_PRIMARY, SITE_LOGO_SECONDARY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

function isNavActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="bg-[#f5f1eb]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-5">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
              {SITE_LOGO_PRIMARY}
            </span>
            <span className="text-xs font-normal uppercase tracking-[0.2em] text-stone-900 sm:text-sm">
              {SITE_LOGO_SECONDARY}
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-900 transition-colors hover:bg-white/60"
              aria-label="Follow us on Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {isAuthenticated ? (
              <div className="hidden items-center gap-3 sm:flex">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-stone-900">
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
                  className="rounded-full bg-stone-900 px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-stone-800 sm:px-5"
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
        </div>

        <div className="border-t border-stone-300/80">
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 py-4">
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
        </div>
      </div>
    </header>
  );
}
