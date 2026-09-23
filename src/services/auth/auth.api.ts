import { apiClient } from "@/lib/api";
import type { LoginBody, LoginData } from "@/types/auth";

export async function login(body: LoginBody) {
  return apiClient<LoginData, LoginBody>("auth/login", {
    method: "POST",
    body,
  });
}
