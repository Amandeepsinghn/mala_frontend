import Link from "next/link";
import { NAV_LINKS, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-stone-900">{SITE_NAME}</p>
            <p className="mt-2 text-sm text-stone-600">{SITE_DESCRIPTION}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-stone-900">Shop</p>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-600 hover:text-stone-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-stone-900">Account</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-stone-600 hover:text-stone-900"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-stone-600 hover:text-stone-900"
                >
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-stone-200 pt-6 text-center text-sm text-stone-500">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
