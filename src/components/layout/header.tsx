"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS, SITE_LOGO_PRIMARY, SITE_LOGO_SECONDARY } from "@/lib/constants";
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
