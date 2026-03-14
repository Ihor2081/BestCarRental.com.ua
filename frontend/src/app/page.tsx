"use client";

import { useState, useEffect } from "react";
import CarCard from "@/components/CarCard";
import { Car } from "@/types";

export default function Home() {
  // Data
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    priceMax: 500,
    transmission: "",
    fuel_type: "",
    passengers: "",
    luggage: "",
    gps: false,
    bluetooth: false,
    leather: false
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Sorting & Pagination
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Debounce filters
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 400);
    return () => clearTimeout(timer);
  }, [filters]);

  // Fetch cars whenever filters/sort/page change
  useEffect(() => {
    async function fetchCars() {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("sort", sort);
      params.append("limit", String(limit));
      params.append("offset", String((page - 1) * limit));

      if (debouncedFilters.priceMax) params.append("price_max", String(debouncedFilters.priceMax));
      if (debouncedFilters.transmission) params.append("transmission", debouncedFilters.transmission);
      if (debouncedFilters.fuel_type) params.append("fuel_type", debouncedFilters.fuel_type);
      if (debouncedFilters.passengers) params.append("passengers", debouncedFilters.passengers);
      if (debouncedFilters.luggage) params.append("luggage", debouncedFilters.luggage);

      if (debouncedFilters.gps) params.append("gps", "true");
      if (debouncedFilters.bluetooth) params.append("bluetooth", "true");
      if (debouncedFilters.leather) params.append("leather", "true");

      try {
        const response = await fetch(`http://localhost:8000/cars?${params.toString()}`);
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, [sort, debouncedFilters, page]);

  return (
    <main>
      {/* HERO SECTION */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Your Journey Starts Here</h1>
          <p className="text-xl mb-8 text-gray-200">Premium car rentals for every destination. Experience the freedom of the open road.</p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-64 space-y-8">
            {/* PRICE */}
            <div>
              <h3 className="text-lg font-bold mb-4">Price Max</h3>
              <input
                type="range"
                min="0"
                max="500"
                value={filters.priceMax}
                onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                className="w-full accent-black"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$0</span>
                <span>${filters.priceMax}</span>
              </div>
            </div>

            {/* TRANSMISSION */}
            <div>
              <h3 className="text-lg font-bold mb-4">Transmission</h3>
              <select
                className="w-full border rounded p-2"
                onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
              >
                <option value="">All</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            {/* FUEL */}
            <div>
              <h3 className="text-lg font-bold mb-4">Fuel Type</h3>
              <select
                className="w-full border rounded p-2"
                onChange={(e) => setFilters({ ...filters, fuel_type: e.target.value })}
              >
                <option value="">All</option>
                <option value="gasoline">Gasoline</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
              </select>
            </div>

            {/* PASSENGERS */}
            <div>
              <h3 className="text-lg font-bold mb-4">Passengers</h3>
              <select
                className="w-full border rounded p-2"
                onChange={(e) => setFilters({ ...filters, passengers: e.target.value })}
              >
                <option value="">Any</option>
                <option value="2">2+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* LUGGAGE */}
            <div>
              <h3 className="text-lg font-bold mb-4">Luggage</h3>
              <select
                className="w-full border rounded p-2"
                onChange={(e) => setFilters({ ...filters, luggage: e.target.value })}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            {/* FEATURES */}
            <div>
              <h3 className="text-lg font-bold mb-4">Features</h3>
              <div className="space-y-2">
                <label className="flex gap-2">
                  <input type="checkbox" onChange={(e) => setFilters({ ...filters, gps: e.target.checked })} />
                  GPS
                </label>
                <label className="flex gap-2">
                  <input type="checkbox" onChange={(e) => setFilters({ ...filters, bluetooth: e.target.checked })} />
                  Bluetooth
                </label>
                <label className="flex gap-2">
                  <input type="checkbox" onChange={(e) => setFilters({ ...filters, leather: e.target.checked })} />
                  Leather Seats
                </label>
              </div>
            </div>
          </aside>

          {/* CAR GRID */}
          <div className="flex-1">
            {/* SORT */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{cars.length} Vehicles Available</h2>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border rounded p-2"
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(limit)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            )}

            {/* EMPTY */}
            {!loading && cars.length === 0 && (
              <p className="text-gray-500">No cars found with selected filters.</p>
            )}

            {/* GRID */}
            {!loading && cars.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {!loading && cars.length > 0 && (
              <div className="flex gap-4 justify-center mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  disabled={page === 1}
                >
                  Prev
                </button>
                <span className="px-4 py-2 border rounded">Page {page}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}