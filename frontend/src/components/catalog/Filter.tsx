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

  const toggleStringFilter = (field: keyof FiltersState, value: string) => {
    const current = filters[field] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    updateFilters({ ...filters, [field]: updated });
  };

  const toggleNumberFilter = (field: keyof FiltersState, value: number) => {
    const current = filters[field] as number[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    updateFilters({ ...filters, [field]: updated });
  };

  return (
    <aside className="w-full lg:w-64 space-y-8">
      {/* PRICE RANGE */}
      <div>
        <h3 className="text-lg font-bold mb-4">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) =>
              updateFilters({
                ...filters,
                priceRange: [Number(e.target.value), filters.priceRange[1]],
              })
            }
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2 text-sm font-bold"
            placeholder="Min"
          />
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) =>
              updateFilters({
                ...filters,
                priceRange: [filters.priceRange[0], Number(e.target.value)],
              })
            }
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2 text-sm font-bold"
            placeholder="Max"
          />
        </div>
      </div>

      {/* CATEGORY */}
      <div>
        <h3 className="text-lg font-bold mb-4">Category</h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category.includes(cat)}
                onChange={() => toggleStringFilter("category", cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* TRANSMISSION */}
      <div>
        <h3 className="text-lg font-bold mb-4">Transmission</h3>
        <div className="space-y-3">
          {["automatic", "mechanic"].map((t) => (
            <label key={t} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.transmission.includes(t)}
                onChange={() => toggleStringFilter("transmission", t)}
              />
              <span className="capitalize">{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* FUEL TYPE */}
      <div>
        <h3 className="text-lg font-bold mb-4">Fuel Type</h3>
        <div className="space-y-3">
          {["gasoline", "gas", "electricity"].map((f) => (
            <label key={f} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.fuel_type.includes(f)}
                onChange={() => toggleStringFilter("fuel_type", f)}
              />
              <span className="capitalize">
                {f === "electricity" ? "Electric" : f}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* PASSENGERS */}
      <div>
        <h3 className="text-lg font-bold mb-4">Passengers</h3>
        <div className="space-y-3">
          {[2, 4, 5, 7].map((p) => (
            <label key={p} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.passengers.includes(p)}
                onChange={() => toggleNumberFilter("passengers", p)}
              />
              <span>{p} Passengers</span>
            </label>
          ))}
        </div>
      </div>

      {/* LUGGAGE */}
      <div>
        <h3 className="text-lg font-bold mb-4">Luggage</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((l) => (
            <label key={l} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.luggage.includes(l)}
                onChange={() => toggleNumberFilter("luggage", l)}
              />
              <span>{l} Bags</span>
            </label>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div>
        <h3 className="text-lg font-bold mb-4">Features</h3>
        <div className="space-y-3">
          {["gps", "bluetooth", "air_conditioning", "heated_seats"].map(
            (feature) => (
              <label key={feature} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.features.includes(feature)}
                  onChange={() => toggleStringFilter("features", feature)}
                />
                <span className="capitalize">
                  {feature.replace("_", " ")}
                </span>
              </label>
            )
          )}
        </div>
      </div>
    </aside>
  );
}