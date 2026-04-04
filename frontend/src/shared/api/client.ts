
export interface ApiError {
  message: string;
  status?: number;
  detail?: any;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Only set Content-Type to application/json if not FormData and not already set
  if (!(options.body instanceof FormData) && !headers["Content-Type" as keyof HeadersInit]) {
    (headers as any)["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(endpoint, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        // Auto logout on 401
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // We could trigger a global logout here if we had the store
      }
      
      const error: ApiError = {
        message: data.detail || "Something went wrong",
        status: response.status,
        detail: data.detail,
      };
      throw error;
    }

    return data as T;
  } catch (error: any) {
    if (error.message === "Failed to fetch") {
      throw { message: "Network error. Please check your connection." } as ApiError;
    }
    throw error as ApiError;
  }
}
