"use client";

import { useState, useEffect } from "react";
import CarCard from "@/components/CarCard";
import { Car } from "@/types";

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch("/api/cars");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setCars(data);
        } else {
          console.error("Expected array of cars, but got:", data);
          setCars([]);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

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

          <div className="bg-white p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full text-left">
              <label className="block text-black text-xs font-bold uppercase mb-2 ml-1">Pick-up Location</label>
              <input type="text" placeholder="City, Airport, or Address" className="w-full p-3 bg-gray-50 rounded-xl text-black outline-none border border-gray-100 focus:border-black transition-colors" />
            </div>
            <div className="flex-1 w-full text-left">
              <label className="block text-black text-xs font-bold uppercase mb-2 ml-1">Pick-up Date</label>
              <input type="date" className="w-full p-3 bg-gray-50 rounded-xl text-black outline-none border border-gray-100 focus:border-black transition-colors" />
            </div>
            <div className="flex-1 w-full text-left">
              <label className="block text-black text-xs font-bold uppercase mb-2 ml-1">Return Date</label>
              <input type="date" className="w-full p-3 bg-gray-50 rounded-xl text-black outline-none border border-gray-100 focus:border-black transition-colors" />
            </div>
            <button className="bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
              Search Cars
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-64 space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Price Range</h3>
              <input type="range" className="w-full accent-black" min="0" max="500" />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>$0</span>
                <span>$500+</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Category</h3>
              <div className="space-y-3">
                {["Sedan", "SUV", "Sports", "Electric", "Compact"].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" />
                    <span className="text-gray-600 group-hover:text-black transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* CAR GRID */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{cars.length} Vehicles Available</h2>
              <select className="bg-transparent border-none font-semibold outline-none cursor-pointer">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-80 bg-gray-100 rounded-3xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}