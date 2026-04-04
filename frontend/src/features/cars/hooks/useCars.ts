
import { useState, useEffect, useCallback } from "react";
import { carService } from "../services/car.service";
import { Car, CarFilters } from "../types";
import { handleApiError } from "../../../shared/utils/errorHandler";

export function useCars(initialFilters: CarFilters = {}) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CarFilters>(initialFilters);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carService.getCars(filters);
      setCars(data);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const updateFilters = (newFilters: Partial<CarFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    cars,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refresh: fetchCars,
  };
}

export function useCarDetails(id: number) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await carService.getCarById(id);
        setCar(data);
      } catch (err: any) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCar();
  }, [id]);

  return { car, loading, error };
}
