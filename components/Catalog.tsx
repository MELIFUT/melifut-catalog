"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import WhatsappButton from "./WhatsappButton";

export default function Catalog({ categories }: any) {
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [openParents, setOpenParents] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Junta productos directos del padre + productos de sus subcategorías
  const collectProducts = (cat: any): any[] => {
    const direct = (cat.products || []).filter(
      (p: any) => p && p.available === true
    );
    const sub = (cat.subcategories || []).flatMap((s: any) =>
      (s.products || []).filter((p: any) => p && p.available === true)
    );
    return [...direct, ...sub];
  };

  const toggleParent = (id: string) => {
    setOpenParents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectCategory = (cat: any, parent?: any) => {
    setActiveCategory({ ...cat, _parent: parent });
    setDrawerOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goHome = () => {
    setActiveCategory(null);
    setDrawerOpen(false);
  };

  // Productos a mostrar en el área principal
  let productsToShow: any[] = [];
  if (activeCategory) {
    if (activeCategory._parent) {
      // subcategoría: solo sus propios productos
      productsToShow = (activeCategory.products || []).filter(
        (p: any) => p && p.available === true
      );
    } else {
      // padre: todos los productos directos + de subcategorías
      productsToShow = collectProducts(activeCategory);
    }
  }

  const sidebarContent = (
    <div className="py-4">
      <button
        onClick={goHome}
        className={`w-full text-left px-5 py-2 mb-2 text-xs uppercase tracking-wider font-bold transition
          ${!activeCategory ? "text-cyan-400" : "text-gray-500 hover:text-white"}`}
      >
        ← Inicio
      </button>
      {categories.map((cat: any) => {
        const isOpen = openParents.has(cat._id);
        const isSelected =
          activeCategory?._id === cat._id && !activeCategory._parent;
        const hasSubs = cat.subcategories?.length > 0;
        return (
          <div key={cat._id}>
            <button
              onClick={() => {
                if (hasSubs) toggleParent(cat._id);
                else selectCategory(cat);
              }}
              className={`w-full flex items-center justify-between px-5 py-3 text-sm text-left transition border-l-[3px]
                ${
                  isOpen || isSelected
                    ? "bg-white/5 font-semibold border-red-500"
                    : "border-transparent hover:bg-white/5"
                }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                {cat.icon?.asset?.url ? (
                  <img
                    src={cat.icon.asset.url}
                    className="w-5 h-5 object-contain flex-shrink-0"
                  />
                ) : (
                  <span className="text-base flex-shrink-0">⚡</span>
                )}
                <span className="text-white truncate">{cat.name}</span>
              </span>
              {hasSubs && (
                <span
                  className={`text-xs text-gray-500 transition-transform flex-shrink-0 ml-2 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              )}
            </button>
            {isOpen && hasSubs && (
              <div className="bg-black/40 py-1">
                {cat.subcategories.map((sub: any) => {
                  const subSelected = activeCategory?._id === sub._id;
                  return (
                    <button
                      key={sub._id}
                      onClick={() => selectCategory(sub, cat)}
                      className={`w-full text-left pl-12 pr-5 py-2 text-[13px] transition
                        ${
                          subSelected
                            ? "text-cyan-400 font-semibold"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="grid md:grid-cols-[260px_1fr] min-h-[calc(100vh-180px)]">
      {/* Botón hamburguesa mobile */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="md:hidden fixed top-[180px] left-3 z-30 bg-white/10 backdrop-blur text-white rounded-lg w-11 h-11 flex items-center justify-center shadow-lg border border-white/20"
        aria-label="Abrir menú de categorías"
      >
        ☰
      </button>

      {/* Overlay mobile */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-[#0a0a14] border-r border-white/10
          fixed md:sticky top-0 md:top-[180px] left-0 h-screen md:h-[calc(100vh-180px)]
          w-[280px] md:w-auto z-50 md:z-10 overflow-y-auto
          transition-transform ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="md:hidden flex justify-between items-center px-5 py-4 border-b border-white/10">
          <span className="font-bold text-white">Categorías</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-white text-2xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Área principal */}
      <main className="px-4 md:px-8 pb-12 pl-16 md:pl-8">
        {activeCategory ? (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-6 mt-4">
              {activeCategory._parent && (
                <button
                  onClick={() => selectCategory(activeCategory._parent)}
                  className="text-xs text-gray-400 hover:text-white border border-white/20 rounded px-3 py-1 transition"
                >
                  ← {activeCategory._parent.name}
                </button>
              )}
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {activeCategory.name}
              </h1>
              <span className="text-sm text-gray-400">
                {productsToShow.length}{" "}
                {productsToShow.length === 1 ? "producto" : "productos"}
              </span>
            </div>
            {productsToShow.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productsToShow.map((p: any) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-12">
                Aún no hay productos en {activeCategory.name}. ¡Pronto subiremos
                más!
              </p>
            )}
          </>
        ) : (
          // Vista inicial: categorías padre con preview de productos
          categories.map((cat: any) => {
            const products = collectProducts(cat);
            if (products.length === 0) return null;
            const preview = products.slice(0, 4);
            return (
              <div key={cat._id} className="mb-12 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {cat.icon?.asset?.url ? (
                      <img src={cat.icon.asset.url} className="w-6 h-6" />
                    ) : (
                      <span className="text-lg">⚡</span>
                    )}
                    <h2 className="text-lg md:text-xl font-semibold text-white">
                      {cat.name}
                    </h2>
                  </div>
                  {products.length > 4 && (
                    <button
                      onClick={() => selectCategory(cat)}
                      className="text-sm text-gray-400 hover:text-white border border-white/20 rounded px-3 py-1 transition whitespace-nowrap"
                    >
                      Ver más →
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {preview.map((p: any) => (
                    <ProductCard key={p._id} p={p} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </main>

      <WhatsappButton />
    </div>
  );
}
