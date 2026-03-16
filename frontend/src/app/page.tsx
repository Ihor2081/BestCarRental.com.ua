
"use client";

import { useState, useEffect } from "react";
import CarCard from "@/components/CarCard";
import Filters, { FiltersState } from "@/components/Filters";
import Sort, { SortOption } from "@/components/Sort";
import { Car } from "@/types";
import { getCars } from "@/lib/api";

export default function Home() {

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // HERO SEARCH
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

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

  // ---------------- FETCH CARS ----------------

  const fetchCars = async (
    filters: FiltersState,
    sort: SortOption,
    page: number
  ) => {

    setLoading(true);

    try {

      const params = new URLSearchParams();

      params.append("page", page.toString());
      params.append("page_size", pageSize.toString());
      params.append("sort", sort);

      // HERO SEARCH

      if (location) params.append("location", location);
      if (pickupDate) params.append("pickup_date", pickupDate);
      if (returnDate) params.append("return_date", returnDate);

      // PRICE RANGE

      params.append("min_price", filters.priceRange[0].toString());
      params.append("max_price", filters.priceRange[1].toString());

      // FILTERS

      if (filters.transmission.length)
        params.append("transmission", filters.transmission.join(","));

      if (filters.fuel_type.length)
        params.append("fuel_type", filters.fuel_type.join(","));

      if (filters.passengers.length)
        params.append("passengers", filters.passengers.join(","));

      if (filters.luggage.length)
        params.append("luggage", filters.luggage.join(","));

      if (filters.features.length)
        params.append("features", filters.features.join(","));

      const data = await getCars(params.toString());

      setCars(data.items || []);
      setTotalPages(data.total_pages || 1);

    } catch (err) {

      console.error("Error fetching cars:", err);

    } finally {

      setLoading(false);

    }

  };

  // ---------------- AUTO FETCH ----------------

  useEffect(() => {

    fetchCars(filters, sortOption, page);

  }, [filters, sortOption, page]);

  // ---------------- HANDLERS ----------------

  const handleSearch = () => {

    setPage(1);
    fetchCars(filters, sortOption, 1);

  };

  const handleFilterChange = (newFilters: FiltersState) => {

    setPage(1);
    setFilters(newFilters);

  };

  const handleSortChange = (option: SortOption) => {

    setPage(1);
    setSortOption(option);

  };

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  // ---------------- UI ----------------

  return (
    <main>

      {/* HERO SECTION */}

      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
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


      {/* MAIN CATALOG */}

      <div className="container mx-auto px-4 py-16 max-w-7xl">

        <div className="flex flex-col lg:flex-row gap-12">

          <Filters onFilterChange={handleFilterChange} />

          <div className="flex-1">

            <div className="flex justify-between items-center mb-8">

              <h2 className="text-2xl font-bold">
                {cars.length} Vehicles Available
              </h2>

              <Sort onSortChange={handleSortChange} />

            </div>


            {loading ? (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {[...Array(pageSize)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-gray-100 rounded-3xl animate-pulse"
                  />
                ))}

              </div>

            ) : cars.length > 0 ? (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}

              </div>

            ) : (

              <div className="text-center text-gray-500 mt-12">
                No cars found
              </div>

            )}


            {totalPages > 1 && (

              <div className="flex justify-center items-center gap-4 mt-8">

                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Prev
                </button>

                <span>
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
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
