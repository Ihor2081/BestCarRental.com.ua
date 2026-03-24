"use client";

import { useState, useEffect } from "react";
import CarCard from "@/components/CarCard";
import Filter, { FiltersState } from "@/components/catalog/Filter";
import Sort from "@/components/catalog/Sort";
import { Car, PaginatedCars } from "@/types";

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState("recommended");
  
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [0, 1000],
    transmission: [],
    fuel_type: [],
    passengers: [],
    luggage: [],
    features: [],
    category: [],
  });

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          sort,
          min_price: filters.priceRange[0].toString(),
          max_price: filters.priceRange[1].toString(),
        });

        if (filters.transmission.length > 0) {
          queryParams.append("transmission", filters.transmission.join(","));
        }
        if (filters.fuel_type.length > 0) {
          queryParams.append("fuel_type", filters.fuel_type.join(","));
        }
        if (filters.passengers.length > 0) {
          queryParams.append("passengers", filters.passengers.join(","));
        }
        if (filters.luggage.length > 0) {
          queryParams.append("luggage", filters.luggage.join(","));
        }
        if (filters.features.length > 0) {
          queryParams.append("features", filters.features.join(","));
        }
        if (filters.category.length > 0) {
          queryParams.append("category", filters.category.join(","));
        }
        
        const response = await fetch(`/api/catalog/cars?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PaginatedCars = await response.json();
        setCars(data.items);
        setTotalPages(data.total_pages);
        setTotalItems(data.total_items);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, [page, sort, filters]);

  const handleFilterChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearch = () => {
    console.log("Searching for:", { location, pickupDate, returnDate });
    setPage(1);
    // In a real app, you might want to filter by location/dates here
  };

  return (
    <main>
      {/* HERO SECTION */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Your Journey Starts Here
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            Premium car rentals for every destination
          </p>
          <div className="bg-white p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full text-left">
              <label className="block text-black text-xs font-bold uppercase mb-2 ml-1">
                Pick-up Location
              </label>
              <input
                type="text"
                placeholder="City, Airport, or Address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl text-black border border-gray-100"
              />
            </div>
            <div className="flex-1 w-full text-left">
              <label className="block text-black text-xs font-bold uppercase mb-2 ml-1">
                Pick-up Date
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl text-black border border-gray-100"
              />
            </div>
            <div className="flex-1 w-full text-left">
              <label className="block text-black text-xs font-bold uppercase mb-2 ml-1">
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl text-black border border-gray-100"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-900"
            >
              Search Cars
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* SIDEBAR FILTERS */}
          <Filter onFilterChange={handleFilterChange} />

          {/* CAR GRID */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{totalItems} Vehicles Available</h2>
              <Sort onSortChange={setSort} currentSort={sort} />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse"></div>
                ))}
              </div>
            ) : cars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
                
                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-full font-bold transition-all ${
                          page === p 
                            ? "bg-black text-white" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-500 text-center max-w-xs">
                  We couldn't find any cars matching your criteria. Please try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
