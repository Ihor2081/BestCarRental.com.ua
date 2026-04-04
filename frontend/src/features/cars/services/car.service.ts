
import { apiClient } from "../../../shared/api/client";
import { Car, CarFilters } from "../types";

export const carService = {
  getCars: async (filters: CarFilters = {}): Promise<Car[]> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });
    
    const query = params.toString();
    const endpoint = `/api/catalog${query ? `?${query}` : ""}`;
    
    const response = await apiClient<{ items: Car[] }>(endpoint);
    return response.items;
  },

  getCarById: async (id: number): Promise<Car> => {
    return apiClient<Car>(`/api/catalog/${id}`);
  },

  getMakes: async (): Promise<string[]> => {
    return apiClient<string[]>("/api/catalog/makes");
  },

  getCategories: async (): Promise<string[]> => {
    return apiClient<string[]>("/api/catalog/categories");
  },
};
