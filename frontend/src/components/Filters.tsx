"use client";

import { useState, useEffect } from "react";
import { debounce } from "lodash";

interface FiltersProps {
  onFilterChange: (filters: FiltersState) => void;
}

export interface FiltersState {
  priceRange: [number, number];
  transmission: string[];
  fuel_type: string[];
  passengers: number[];
  luggage: number[];
  features: string[];
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [0, 500],
    transmission: [],
    fuel_type: [],
    passengers: [],
    luggage: [],
    features: [],
  });

  // Debounced callback to parent
  const debouncedUpdate = debounce((newFilters: FiltersState) => {
    onFilterChange(newFilters);
  }, 300);

  // Handle filter changes
  const handleChange = (key: keyof FiltersState, value: any) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      debouncedUpdate(updated);
      return updated;
    });
  };

  // Individual toggle helper for arrays
  const toggleValue = (key: keyof FiltersState, value: string | number) => {
    setFilters(prev => {
      const arr = prev[key] as any[];
      const updatedArr = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      const updated = { ...prev, [key]: updatedArr };
      debouncedUpdate(updated);
      return updated;
    });
  };

  return (
    <aside className="w-full lg:w-64 space-y-8">
      {/* Price Range */}
      <div>
        <h3 className="text-lg font-bold mb-4">Price Range</h3>
        <input
          type="range"
          min={0}
          max={500}
          value={filters.priceRange[1]}
          onChange={(e) => handleChange("priceRange", [0, parseInt(e.target.value)])}
          className="w-full accent-black"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>$0</span>
          <span>${filters.priceRange[1]}+</span>
        </div>
      </div>

      {/* Transmission */}
      <div>
        <h3 className="text-lg font-bold mb-4">Transmission</h3>
        {["automatic", "manual"].map(trans => (
          <label key={trans} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.transmission.includes(trans)}
              onChange={() => toggleValue("transmission", trans)}
              className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-gray-600 group-hover:text-black transition-colors">{trans}</span>
          </label>
        ))}
      </div>

      {/* Fuel Type */}
      <div>
        <h3 className="text-lg font-bold mb-4">Fuel Type</h3>
        {["gasoline", "electricity", "hybrid"].map(fuel => (
          <label key={fuel} className="flex items-center gap-3 cursor-pointer group capitalize">
            <input
              type="checkbox"
              checked={filters.fuel_type.includes(fuel)}
              onChange={() => toggleValue("fuel_type", fuel)}
              className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-gray-600 group-hover:text-black transition-colors">{fuel}</span>
          </label>
        ))}
      </div>

      {/* Passengers */}
      <div>
        <h3 className="text-lg font-bold mb-4">Passengers</h3>
        {[2, 4, 5, 7].map(num => (
          <label key={num} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.passengers.includes(num)}
              onChange={() => toggleValue("passengers", num)}
              className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-gray-600 group-hover:text-black transition-colors">{num}</span>
          </label>
        ))}
      </div>

      {/* Luggage */}
      <div>
        <h3 className="text-lg font-bold mb-4">Luggage</h3>
        {[1, 2, 3, 4].map(num => (
          <label key={num} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.luggage.includes(num)}
              onChange={() => toggleValue("luggage", num)}
              className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-gray-600 group-hover:text-black transition-colors">{num}</span>
          </label>
        ))}
      </div>

      {/* Features */}
      <div>
        <h3 className="text-lg font-bold mb-4">Additional Features</h3>
        {["gps", "bluetooth", "leather"].map(feature => (
          <label key={feature} className="flex items-center gap-3 cursor-pointer group capitalize">
            <input
              type="checkbox"
              checked={filters.features.includes(feature)}
              onChange={() => toggleValue("features", feature)}
              className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-gray-600 group-hover:text-black transition-colors">
              {feature === "leather" ? "Leather Seats" : feature}
            </span>
          </label>
        ))}
      </div>
    </aside>
  );
}