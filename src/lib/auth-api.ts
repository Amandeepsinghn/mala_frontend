import { apiFetch } from "@/lib/api-client";
import type {
  AddToCartRequest,
  CartResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  UserProfileResponse,
} from "@/types/api";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function signup(data: SignupRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getProfile(token: string): Promise<UserProfileResponse> {
  return apiFetch<UserProfileResponse>("/profile", { token });
}

export async function getCart(token: string): Promise<CartResponse> {
  return apiFetch<CartResponse>("/cart", { token });
}

export async function addToCart(
  token: string,
  data: AddToCartRequest,
): Promise<CartResponse> {
  return apiFetch<CartResponse>("/cart/items", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}
