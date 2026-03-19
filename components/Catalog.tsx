"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import WhatsappButton from "./WhatsappButton";

export default function Catalog({ categories }: any) {
  const [activeCategory, setActiveCategory] = useState<any>(null);

  return (
    <>
      {/* 🔥 CATEGORÍAS */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
        {categories.map((cat: any) => {
          const isActive = activeCategory?._id === cat._id;

          return (
            <div
              key={cat._id}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-full cursor-pointer transition min-w-fit
                ${
                  isActive
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              <img
                src={cat.icon?.asset?.url}
                className="w-6 h-6 object-contain"
              />
              <span className="text-sm whitespace-nowrap">{cat.name}</span>
            </div>
          );
        })}
      </div>

      {/* 🔥 MODO FILTRADO (VER MÁS) */}
      {activeCategory && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setActiveCategory(null)}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-100 transition"
            >
              ← Volver
            </button>

            <img src={activeCategory.icon?.asset?.url} className="w-6 h-6" />

            <h2 className="text-xl font-semibold">{activeCategory.name}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activeCategory.products?.map((p: any) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        </div>
      )}

      {/* 🔥 MODO INICIAL */}
      {!activeCategory &&
        categories.map((cat: any) => {
          if (!cat.products || cat.products.length === 0) return null;

          const previewProducts = cat.products.slice(0, 4);

          return (
            <div key={cat._id} className="mb-12">
              {/* HEADER */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img src={cat.icon?.asset?.url} className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">{cat.name}</h2>
                </div>

                {/* 🔥 BOTÓN VER MÁS */}
                {cat.products.length > 4 && (
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className="text-sm px-3 py-1 border rounded hover:bg-gray-100 transition"
                  >
                    Ver más →
                  </button>
                )}
              </div>

              {/* PRODUCTOS (MAX 4) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewProducts.map((p: any) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            </div>
          );
        })}

      {/* 🔥 WHATSAPP */}
      <WhatsappButton />
    </>
  );
}
