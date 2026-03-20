"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import WhatsappButton from "./WhatsappButton";

export default function Catalog({ categories }: any) {
  const [activeCategory, setActiveCategory] = useState<any>(null);

  // 🔥 DEBUG
  categories.forEach((cat: any) => {
    cat.products?.forEach((p: any) => {
      if (p?.name === "COLO COLO 2006 Local") {
        console.log("PRODUCTO ENCONTRADO:", p);
      }
    });
  });

  // 🔥 FUNCIÓN LIMPIA
  const cleanProducts = (products: any[]) => {
    return (products || []).filter((p) => p && p.available === true);
  };

  // 🔥 PRODUCTOS EN STOCK
  const stockProducts = categories
    .flatMap((cat: any) => cat.products || [])
    .filter((p: any) => p && p.available === true && p.inStock === true);

  // 🔥 CATEGORÍA DINÁMICA (solo si hay productos)
  const stockCategory =
    stockProducts.length > 0
      ? {
          _id: "stock-inmediato",
          name: "Stock inmediato",
          icon: null,
          products: stockProducts,
        }
      : null;

  // 🔥 CATEGORÍAS FINALES
  const allCategories = stockCategory
    ? [stockCategory, ...categories]
    : categories;

  const isStockCategory = activeCategory?._id === "stock-inmediato";

  return (
    <>
      {/* 🔥 CATEGORÍAS */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
        {allCategories.map((cat: any) => {
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
              {cat.icon?.asset?.url ? (
                <img
                  src={cat.icon.asset.url}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <span className="text-lg">⚡</span>
              )}

              <span className="text-sm whitespace-nowrap">{cat.name}</span>
            </div>
          );
        })}
      </div>

      {/* 🔥 MODO FILTRADO */}
      {activeCategory && (
        <div>
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setActiveCategory(null)}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-100 transition"
            >
              ← Volver
            </button>

            {activeCategory.icon?.asset?.url ? (
              <img src={activeCategory.icon.asset.url} className="w-6 h-6" />
            ) : (
              <span className="text-lg">⚡</span>
            )}

            <h2 className="text-xl font-semibold">{activeCategory.name}</h2>
          </div>

          {/* 🔥 STOCK INMEDIATO AGRUPADO */}
          {isStockCategory ? (
            categories.map((cat: any) => {
              const products = (cat.products || []).filter(
                (p: any) => p && p.available === true && p.inStock === true
              );

              if (products.length === 0) return null;

              return (
                <div key={cat._id} className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <img src={cat.icon?.asset?.url} className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">{cat.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map((p: any) => (
                      <ProductCard key={p._id} p={p} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // 🔥 NORMAL
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cleanProducts(activeCategory.products).map((p: any) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 🔥 MODO INICIAL */}
      {!activeCategory &&
        allCategories.map((cat: any) => {
          const products = cleanProducts(cat.products);

          if (products.length === 0) return null;

          const preview = products.slice(0, 4);

          return (
            <div key={cat._id} className="mb-12">
              {/* HEADER */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {cat.icon?.asset?.url ? (
                    <img src={cat.icon.asset.url} className="w-6 h-6" />
                  ) : (
                    <span className="text-lg">⚡</span>
                  )}

                  <h2 className="text-xl font-semibold">{cat.name}</h2>
                </div>

                {(cat._id === "stock-inmediato" || products.length > 4) && (
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className="text-sm px-3 py-1 border rounded hover:bg-gray-100 transition"
                  >
                    Ver más →
                  </button>
                )}
              </div>

              {/* GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {preview.map((p: any) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            </div>
          );
        })}

      <WhatsappButton />
    </>
  );
}
