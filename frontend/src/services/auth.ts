import { apiClient } from "@app/lib/api-client";
import { CreateUserDto, UserDto } from "@app/types";

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient<UserDto>({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      });
      return response;
    } catch (error) {
      throw new Error((error as Error)?.message || "Failed to login.");
    }
  },
  logout: async () => {
    try {
      const response = await apiClient({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      });
      return response;
    } catch (error) {
      throw new Error((error as Error)?.message || "Failed to logout.");
    }
  },
  me: async () => {
    try {
      const response = await apiClient<UserDto>({
        url: "/auth/me",
        method: "GET",
        credentials: "include",
      });
      return response;
    } catch (error) {
      throw new Error((error as Error)?.message || "Failed to get user.");
    }
  },
  register: async (user: CreateUserDto) => {
    try {
      const response = await apiClient<UserDto>({
        url: "/auth/register",
        method: "POST",
        body: user,
      });
      return response;
    } catch (error) {
      throw new Error((error as Error)?.message || "Failed to register.");
    }
  },
};
