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
            ) : cars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-500 text-center max-w-xs">
                  We couldn't find any cars in the database. Please check back later or contact support.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
