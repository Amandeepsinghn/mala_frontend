"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProfile, signup } from "@/lib/auth-api";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

export function RegisterForm() {
  const router = useRouter();
  const { setAuth, setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const full_name = form.get("full_name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const { access_token } = await signup({ email, password, full_name });
      setAuth(access_token);

      try {
        const profile = await getProfile(access_token);
        setUser(profile);
      } catch {
        setUser(null);
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <Input
        label="Full name"
        name="full_name"
        type="text"
        placeholder="Jane Doe"
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Min. 8 characters"
        minLength={8}
        required
      />
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
