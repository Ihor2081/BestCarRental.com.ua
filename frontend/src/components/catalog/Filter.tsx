"use client";

import { useState } from "react";

export type FiltersState = {
  priceRange: [number, number];
  transmission: string[];
  fuel_type: string[];
  passengers: number[];
  luggage: number[];
  features: string[];
  category: string[];
};

type Props = {
  onFilterChange: (filters: FiltersState) => void;
};

export default function Filter({ onFilterChange }: Props) {
  const categories = ["Sedan", "SUV", "Sports", "Electric", "Compact", "Standard"];
  
  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [0, 1000],
    transmission: [],
    fuel_type: [],
    passengers: [],
    luggage: [],
    features: [],
    category: [],
  });

  const updateFilters = (newFilters: FiltersState) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleStringFilter = (
    field: keyof FiltersState,
    value: string
  ) => {
    const current = filters[field] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const newFilters: FiltersState = {
      ...filters,
      [field]: updated
    };
    updateFilters(newFilters);
  };

  const toggleNumberFilter = (
    field: keyof FiltersState,
    value: number
  ) => {
    const current = filters[field] as number[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const newFilters: FiltersState = {
      ...filters,
      [field]: updated
    };
    updateFilters(newFilters);
  };

  return (
<<<<<<< HEAD
    <div className="w-full lg:w-64 space-y-8">
      {/* PRICE RANGE */}
      <div>
        <h3 className="text-lg font-black mb-4">Price Range</h3>
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Min</label>
            <input
              type="number"
              min="0"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value));
                const newFilters: FiltersState = {
                  ...filters,
                  priceRange: [val, filters.priceRange[1]]
                };
                updateFilters(newFilters);
              }}
              className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-black outline-none focus:ring-2 focus:ring-black/5 transition-all"
              placeholder="Min"
            />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Max</label>
            <input
              type="number"
              min="0"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value));
                const newFilters: FiltersState = {
                  ...filters,
                  priceRange: [filters.priceRange[0], val]
                };
                updateFilters(newFilters);
              }}
              className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-black outline-none focus:ring-2 focus:ring-black/5 transition-all"
=======
    <aside className="w-full lg:w-64 space-y-8">
      {/* PRICE RANGE */}
      <div>
        <h3 className="text-lg font-bold mb-4">Price Range</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Min</label>
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const newFilters: FiltersState = {
                  ...filters,
                  priceRange: [Number(e.target.value), filters.priceRange[1]]
                };
                updateFilters(newFilters);
              }}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2 text-sm font-bold outline-none focus:border-black transition-all"
              placeholder="Min"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Max</label>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const newFilters: FiltersState = {
                  ...filters,
                  priceRange: [filters.priceRange[0], Number(e.target.value)]
                };
                updateFilters(newFilters);
              }}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2 text-sm font-bold outline-none focus:border-black transition-all"
>>>>>>> main
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* CATEGORY */}
      <div>
<<<<<<< HEAD
        <h3 className="text-lg font-black mb-4">Category</h3>
        <div className="space-y-4">
=======
        <h3 className="text-lg font-bold mb-4">Category</h3>
        <div className="space-y-3">
>>>>>>> main
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
<<<<<<< HEAD
                className="w-5 h-5 rounded border-gray-200 text-black focus:ring-black transition-all cursor-pointer" 
                checked={filters.category.includes(cat)}
                onChange={() => toggleStringFilter("category", cat)}
              />
              <span className="text-gray-500 group-hover:text-black transition-colors font-bold">{cat}</span>
=======
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" 
                checked={filters.category.includes(cat)}
                onChange={() => toggleStringFilter("category", cat)}
              />
              <span className="text-gray-600 group-hover:text-black transition-colors font-medium">{cat}</span>
>>>>>>> main
            </label>
          ))}
        </div>
      </div>

      {/* TRANSMISSION */}
      <div>
<<<<<<< HEAD
        <h3 className="text-lg font-black mb-4">Transmission</h3>
        <div className="space-y-4">
=======
        <h3 className="text-lg font-bold mb-4">Transmission</h3>
        <div className="space-y-3">
>>>>>>> main
          {["automatic", "mechanic"].map((t) => (
            <label key={t} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
<<<<<<< HEAD
                className="w-5 h-5 rounded border-gray-200 text-black focus:ring-black transition-all cursor-pointer" 
                checked={filters.transmission.includes(t)}
                onChange={() => toggleStringFilter("transmission", t)}
              />
              <span className="text-gray-500 group-hover:text-black transition-colors font-bold capitalize">{t}</span>
=======
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" 
                checked={filters.transmission.includes(t)}
                onChange={() => toggleStringFilter("transmission", t)}
              />
              <span className="text-gray-600 group-hover:text-black transition-colors font-medium capitalize">{t}</span>
>>>>>>> main
            </label>
          ))}
        </div>
      </div>

      {/* FUEL TYPE */}
      <div>
<<<<<<< HEAD
        <h3 className="text-lg font-black mb-4">Fuel Type</h3>
        <div className="space-y-4">
=======
        <h3 className="text-lg font-bold mb-4">Fuel Type</h3>
        <div className="space-y-3">
>>>>>>> main
          {["gasoline", "gas", "electricity"].map((f) => (
            <label key={f} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
<<<<<<< HEAD
                className="w-5 h-5 rounded border-gray-200 text-black focus:ring-black transition-all cursor-pointer" 
                checked={filters.fuel_type.includes(f)}
                onChange={() => toggleStringFilter("fuel_type", f)}
              />
              <span className="text-gray-500 group-hover:text-black transition-colors font-bold capitalize">{f === "electricity" ? "Electric" : f}</span>
=======
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" 
                checked={filters.fuel_type.includes(f)}
                onChange={() => toggleStringFilter("fuel_type", f)}
              />
              <span className="text-gray-600 group-hover:text-black transition-colors font-medium capitalize">{f === "electricity" ? "Electric" : f}</span>
>>>>>>> main
            </label>
          ))}
        </div>
      </div>

      {/* PASSENGERS */}
      <div>
<<<<<<< HEAD
        <h3 className="text-lg font-black mb-4">Passengers</h3>
        <div className="space-y-4">
=======
        <h3 className="text-lg font-bold mb-4">Passengers</h3>
        <div className="space-y-3">
>>>>>>> main
          {[2, 4, 5, 7].map((p) => (
            <label key={p} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
<<<<<<< HEAD
                className="w-5 h-5 rounded border-gray-200 text-black focus:ring-black transition-all cursor-pointer" 
                checked={filters.passengers.includes(p)}
                onChange={() => toggleNumberFilter("passengers", p)}
              />
              <span className="text-gray-500 group-hover:text-black transition-colors font-bold">{p} Passengers</span>
=======
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" 
                checked={filters.passengers.includes(p)}
                onChange={() => toggleNumberFilter("passengers", p)}
              />
              <span className="text-gray-600 group-hover:text-black transition-colors font-medium">{p} Passengers</span>
>>>>>>> main
            </label>
          ))}
        </div>
      </div>

      {/* LUGGAGE */}
      <div>
<<<<<<< HEAD
        <h3 className="text-lg font-black mb-4">Luggage</h3>
        <div className="space-y-4">
=======
        <h3 className="text-lg font-bold mb-4">Luggage</h3>
        <div className="space-y-3">
>>>>>>> main
          {[1, 2, 3].map((l) => (
            <label key={l} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
<<<<<<< HEAD
                className="w-5 h-5 rounded border-gray-200 text-black focus:ring-black transition-all cursor-pointer" 
                checked={filters.luggage.includes(l)}
                onChange={() => toggleNumberFilter("luggage", l)}
              />
              <span className="text-gray-500 group-hover:text-black transition-colors font-bold">{l} Bags</span>
=======
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" 
                checked={filters.luggage.includes(l)}
                onChange={() => toggleNumberFilter("luggage", l)}
              />
              <span className="text-gray-600 group-hover:text-black transition-colors font-medium">{l} Bags</span>
>>>>>>> main
            </label>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div>
<<<<<<< HEAD
        <h3 className="text-lg font-black mb-4">Features</h3>
        <div className="space-y-4">
=======
        <h3 className="text-lg font-bold mb-4">Features</h3>
        <div className="space-y-3">
>>>>>>> main
          {["gps", "bluetooth", "air_conditioning", "heated_seats"].map((feature) => (
            <label key={feature} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
<<<<<<< HEAD
                className="w-5 h-5 rounded border-gray-200 text-black focus:ring-black transition-all cursor-pointer" 
                checked={filters.features.includes(feature)}
                onChange={() => toggleStringFilter("features", feature)}
              />
              <span className="text-gray-500 group-hover:text-black transition-colors font-bold capitalize">{feature.replace("_", " ")}</span>
=======
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" 
                checked={filters.features.includes(feature)}
                onChange={() => toggleStringFilter("features", feature)}
              />
              <span className="text-gray-600 group-hover:text-black transition-colors font-medium capitalize">{feature.replace("_", " ")}</span>
>>>>>>> main
            </label>
          ))}
        </div>
      </div>
<<<<<<< HEAD
    </div>
=======
    </aside>
>>>>>>> main
  );
}
