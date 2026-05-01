"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import WhatsappButton from "./WhatsappButton";

export default function Catalog({ categories }: any) {
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [openParents, setOpenParents] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const collectProducts = (cat: any): any[] => {
    const direct = (cat.products || []).filter(
      (p: any) => p && p.available === true
    );
    const sub = (cat.subcategories || []).flatMap((s: any) =>
      (s.products || []).filter((p: any) => p && p.available === true)
    );
    return [...direct, ...sub];
  };

  // Todos los productos del catálogo (para el buscador), sin duplicados
  const allProducts = (): any[] => {
    const all: any[] = [];
    categories.forEach((cat: any) => {
      (cat.products || []).forEach(
        (p: any) => p && p.available === true && all.push(p)
      );
      (cat.subcategories || []).forEach((s: any) => {
        (s.products || []).forEach(
          (p: any) => p && p.available === true && all.push(p)
        );
      });
    });
    const seen = new Set<string>();
    return all.filter((p) => {
      if (seen.has(p._id)) return false;
      seen.add(p._id);
      return true;
    });
  };

  const searchResults = searchQuery.trim()
    ? allProducts().filter((p: any) => {
        const q = searchQuery.toLowerCase();
        return (
          (p.name || "").toLowerCase().includes(q) ||
          (p.team?.name || "").toLowerCase().includes(q) ||
          String(p.year || "").includes(q)
        );
      })
    : null;

  const isSearching = !!searchResults;

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
    setSearchQuery("");
    setDrawerOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goHome = () => {
    setActiveCategory(null);
    setSearchQuery("");
    setDrawerOpen(false);
  };

  const scrollToProducts = () => {
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
  };

  let productsToShow: any[] = [];
  if (activeCategory) {
    if (activeCategory._parent) {
      productsToShow = (activeCategory.products || []).filter(
        (p: any) => p && p.available === true
      );
    } else {
      productsToShow = collectProducts(activeCategory);
    }
  }

  const showHero = !activeCategory && !isSearching;

  const sidebarContent = (
    <div className="py-4">
      <button
        onClick={goHome}
        className={`w-full text-left px-5 py-2 mb-2 text-xs uppercase tracking-wider font-bold transition
          ${!activeCategory && !isSearching ? "text-cyan-400" : "text-gray-500 hover:text-white"}`}
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
    <>
      {showHero && (
        <section className="relative overflow-hidden px-6 py-16 md:py-24 text-center border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              La camiseta de tu equipo
            </h1>
            <p className="text-base md:text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              Camisetas actuales y retro · Stock inmediato · Envíos a todo Chile
            </p>
            <button
              onClick={scrollToProducts}
              className="inline-block bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold text-base md:text-lg px-8 py-4 rounded-lg transition shadow-lg shadow-red-500/30"
            >
              Ver catálogo →
            </button>
          </div>
        </section>
      )}

      <div
        id="productos"
        className="grid md:grid-cols-[260px_1fr] min-h-[calc(100vh-180px)]"
      >
        <button
          onClick={() => setDrawerOpen(true)}
          className="md:hidden fixed top-[180px] left-3 z-30 bg-white/10 backdrop-blur text-white rounded-lg w-11 h-11 flex items-center justify-center shadow-lg border border-white/20"
          aria-label="Abrir menú de categorías"
        >
          ☰
        </button>

        {drawerOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/70 z-40"
            onClick={() => setDrawerOpen(false)}
          />
        )}

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

        <main className="px-4 md:px-8 pb-12 pl-16 md:pl-8">
          {/* BUSCADOR */}
          <div className="relative mt-4 mb-6">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              🔍
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar camiseta, equipo o año…"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition text-sm md:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-lg"
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          {/* RESULTADOS DE BÚSQUEDA */}
          {isSearching ? (
            <>
              <div className="mb-4">
                <h2 className="text-lg md:text-xl font-bold text-white">
                  Resultados para "{searchQuery}"
                </h2>
                <p className="text-sm text-gray-400">
                  {searchResults!.length}{" "}
                  {searchResults!.length === 1 ? "producto" : "productos"}
                </p>
              </div>
              {searchResults!.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults!.map((p: any) => (
                    <ProductCard key={p._id} p={p} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12">
                  No encontramos productos para "{searchQuery}". Prueba con otra
                  palabra.
                </p>
              )}
            </>
          ) : activeCategory ? (
            <>
              <div className="flex flex-wrap items-center gap-3 mb-6">
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
            categories.map((cat: any) => {
              const products = collectProducts(cat);
              if (products.length === 0) return null;
              const preview = products.slice(0, 4);
              return (
                <div key={cat._id} className="mb-12">
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
      </div>

      <WhatsappButton />
    </>
  );
}
