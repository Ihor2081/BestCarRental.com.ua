"use client";

import { useState, useEffect } from "react";
import { X, Save, Percent } from "lucide-react";
import { Discount } from "@/types";

interface DiscountModalProps {
  discount?: Discount;
  onClose: () => void;
  onSave: () => void;
}

export default function DiscountModal({ discount, onClose, onSave }: DiscountModalProps) {
  const [formData, setFormData] = useState({
    min_days: 1,
    max_days: 7,
    discount_percent: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (discount) {
      setFormData({
        min_days: discount.min_days,
        max_days: discount.max_days,
        discount_percent: discount.discount_percent
      });
    }
  }, [discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const url = discount ? `/api/admin/discounts/${discount.id}` : "/api/admin/discounts";
      const method = discount ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to save discount");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
      console.error("Error saving discount:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Percent className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">
                {discount ? "Edit Discount" : "Add New Discount"}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Min Days</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={isNaN(formData.min_days) ? "" : formData.min_days}
                  onChange={(e) => setFormData({ ...formData, min_days: e.target.value === "" ? NaN : parseInt(e.target.value) })}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-black transition-all font-bold" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Max Days</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={isNaN(formData.max_days) ? "" : formData.max_days}
                  onChange={(e) => setFormData({ ...formData, max_days: e.target.value === "" ? NaN : parseInt(e.target.value) })}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-black transition-all font-bold" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Discount Percent (%)</label>
              <input 
                type="number" 
                required
                min="0"
                max="100"
                step="0.1"
                value={isNaN(formData.discount_percent) ? "" : formData.discount_percent}
                onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value === "" ? NaN : parseFloat(e.target.value) })}
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-black transition-all font-bold" 
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-5 rounded-2xl font-black text-gray-400 hover:text-black transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white py-5 rounded-2xl font-black hover:bg-gray-900 transition-all shadow-lg hover:shadow-black/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {discount ? "Update Discount" : "Save Discount"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
