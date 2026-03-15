"use client";

import { useState, useEffect } from "react";
import { X, Save, Trash2 } from "lucide-react";
import { Car } from "@/types";

interface CarModalProps {
  car?: Car;
  onClose: () => void;
  onSave: () => void;
}

export default function CarModal({ car, onClose, onSave }: CarModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<Car>>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    license_plate: "",
    color: "",
    passengers: 5,
    luggage: 2,
    transmission: "automatic",
    fuel_type: "gasoline",
    features: "",
    description: "",
    images: "",
    price_per_day: 0,
    status: "available"
  });

  useEffect(() => {
    if (car) {
      setFormData(car);
    }
  }, [car]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const url = car ? `/api/admin/cars/${car.id}` : "/api/admin/cars";
      const method = car ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to save car");
      }

      onSave();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-black tracking-tight">
            {car ? "Edit Vehicle" : "Add New Vehicle"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Model</label>
              <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Year</label>
              <input type="number" name="year" value={formData.year} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">License Plate</label>
              <input type="text" name="license_plate" value={formData.license_plate} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Color</label>
              <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Price Per Day ($)</label>
              <input type="number" name="price_per_day" value={formData.price_per_day} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Transmission</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5">
                <option value="automatic">Automatic</option>
                <option value="mechanic">Mechanic</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Fuel Type</label>
              <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5">
                <option value="gasoline">Gasoline</option>
                <option value="gas">Gas</option>
                <option value="electricity">Electricity</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Passengers</label>
              <input type="number" name="passengers" value={formData.passengers} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Luggage</label>
              <input type="number" name="luggage" value={formData.luggage} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5">
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="in_service">In Service</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Image URL</label>
            <input type="text" name="images" value={formData.images} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Features (comma separated)</label>
            <input type="text" name="features" value={formData.features} onChange={handleChange} placeholder="GPS, Bluetooth, Leather Seats..." className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-black/5 resize-none" />
          </div>

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white z-10">
            <button type="button" onClick={onClose} className="flex-1 py-4 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              {loading ? "Saving..." : "Save Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
