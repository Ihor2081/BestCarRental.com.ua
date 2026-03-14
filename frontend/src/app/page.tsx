"use client";

import { useState, useEffect, useCallback } from "react";
import CarCard from "@/components/CarCard";
import Filters, { FiltersState } from "@/components/Filters";
import Sort, { SortOption } from "@/components/Sort";
import { Car } from "@/types";
import { debounce } from "lodash";

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [0, 500],
    transmission: [],
    fuel_type: [],
    passengers: [],
    luggage: [],
    features: [],
  });
  const [sortOption, setSortOption] = useState<SortOption>("recommended");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  // Debounced fetch
  const fetchCars = useCallback(
    debounce(async (filters: FiltersState, sort: SortOption, page: number) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("page_size", pageSize.toString());
        params.append("sort", sort);

        // Add filters
        if (filters.priceRange) {
          params.append("min_price", filters.priceRange[0].toString());
          params.append("max_price", filters.priceRange[1].toString());
        }
        if (filters.transmission.length) params.append("transmission", filters.transmission.join(","));
        if (filters.fuel_type.length) params.append("fuel_type", filters.fuel_type.join(","));
        if (filters.passengers.length) params.append("passengers", filters.passengers.join(","));
        if (filters.luggage.length) params.append("luggage", filters.luggage.join(","));
        if (filters.features.length) params.append("features", filters.features.join(","));

        const response = await fetch(`/api/cars?${params.toString()}`);
        const data = await response.json();
        if (Array.isArray(data.items)) {
          setCars(data.items);
          setTotalPages(data.total_pages);
        } else {
          setCars([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Effect: fetch whenever filters, sort, or page changes
  useEffect(() => {
    fetchCars(filters, sortOption, page);
  }, [filters, sortOption, page, fetchCars]);

  // Handlers
  const handleFilterChange = (newFilters: FiltersState) => {
    setPage(1); // reset to first page
    setFilters(newFilters);
  };

  const handleSortChange = (option: SortOption) => {
    setPage(1);
    setSortOption(option);
  };

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <main className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* SIDEBAR FILTERS */}
        <Filters onFilterChange={handleFilterChange} />

        {/* MAIN CONTENT */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{cars.length} Vehicles Available</h2>
            <Sort onSortChange={handleSortChange} />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(pageSize)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-12">No cars found</div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}