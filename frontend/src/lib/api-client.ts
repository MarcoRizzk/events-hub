const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/organizers/v1";

// General-purpose serializable type, still used for fallback
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

// Now takes a generic for body type B and return type T
export interface ApiConfig<B = unknown> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: B;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

// Helper to get CSRF token from cookies
const getCsrfToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export async function apiClient<T = unknown, B = unknown>({
  url,
  method = "GET",
  body,
  headers = {},
  credentials = "include",
}: ApiConfig<B>): Promise<T> {
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const csrfToken = getCsrfToken();
  if (csrfToken) {
    requestHeaders["X-XSRF-TOKEN"] = csrfToken;
  }

  const finalHeaders = {
    ...requestHeaders,
    ...headers,
  };

  const config: RequestInit = {
    method,
    credentials,
    headers: finalHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    try {
      if (contentType.includes("application/json")) {
        const errorJson = await response.json();
        throw new Error(errorJson.message || "Request failed");
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Request failed with non-JSON error");
      }
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  try {
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    } else {
      const text = await response.text();
      return text as unknown as T;
    }
  } catch (err) {
    throw new Error((err as Error).message);
  }
}
