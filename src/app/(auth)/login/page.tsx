import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-center text-3xl font-semibold text-stone-900">
        Sign in
      </h1>
      <p className="mt-2 text-center text-stone-600">
        Welcome back to {SITE_NAME}
      </p>

      <Card className="mt-8">
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-stone-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-amber-800 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
