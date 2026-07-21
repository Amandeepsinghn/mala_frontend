import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-center text-3xl font-semibold text-stone-900">
        Create account
      </h1>
      <p className="mt-2 text-center text-stone-600">
        Join {SITE_NAME} to track orders and save favourites
      </p>

      <Card className="mt-8">
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-stone-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-amber-800 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
