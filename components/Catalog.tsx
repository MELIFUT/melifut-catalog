"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import WhatsappButton from "./WhatsappButton";

const THEMATIC_SLUGS = new Set([
  "lo-mas-vendido",
  "stock-inmediato",
  "cr7",
  "leyendas",
  "leyendas-chilenas",
]);

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";

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

  // Botón "Ver catálogo": en mobile abre el drawer, en desktop scrollea
  const handleVerCatalogo = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setDrawerOpen(true);
    } else {
      scrollToProducts();
    }
  };

  // Botón "Cajita de regalo": navega a la categoría
  const goToCajitas = () => {
    const cajitas = categories.find(
      (c: any) => getSlug(c) === "cajas-de-regalo"
    );
    if (cajitas) {
      selectCategory(cajitas);
    } else {
      scrollToProducts();
    }
  };

  // Botón "No encontraste": abre WhatsApp con mensaje pre-armado
  const handleNotFound = () => {
    const message = encodeURIComponent(
      "Hola! Estoy buscando una camiseta que no aparece en el catálogo (insertar fotografía en el chat)"
    );
    window.open(
      `https://wa.me/${WHATSAPP_PHONE}?text=${message}`,
      "_blank"
    );
  };

  const getSlug = (cat: any) =>
    typeof cat.slug === "string" ? cat.slug : cat.slug?.current || "";

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

  const renderSubTile = (sub: any, parent: any) => {
    const subProducts = (sub.products || []).filter(
      (p: any) => p && p.available === true
    );
    const previews = subProducts.slice(0, 4);
    return (
      <button
        key={sub._id}
        onClick={() => selectCategory(sub, parent)}
        className="group bg-[#0f0f0f] border border-white/5 rounded-xl md:rounded-2xl overflow-hidden hover:border-cyan-500/40 hover:shadow-xl transition text-left"
      >
        <div className="aspect-square grid grid-cols-2 gap-px bg-white/5">
          {[0, 1, 2, 3].map((i) => {
            const p = previews[i];
            return (
              <div
                key={i}
                className="relative overflow-hidden bg-[#0a0a14] flex items-center justify-center"
              >
                {p?.images?.[0]?.asset?.url ? (
                  <img
                    src={p.images[0].asset.url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <span className="text-2xl text-gray-700">⚡</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="p-2 md:p-3">
          <h3 className="font-bold text-white text-xs md:text-base truncate group-hover:text-cyan-400 transition">
            {sub.name}
          </h3>
          <p className="text-[10px] md:text-xs text-gray-400">
            {subProducts.length}{" "}
            {subProducts.length === 1 ? "producto" : "productos"}
          </p>
        </div>
      </button>
    );
  };

  return (
    <>
      <button
        onClick={() => setDrawerOpen(true)}
        className="md:hidden fixed top-3 left-3 z-[60] bg-black/70 backdrop-blur text-white rounded-lg w-10 h-10 flex items-center justify-center shadow-lg border border-white/20"
        aria-label="Abrir menú de categorías"
      >
        ☰
      </button>

      {showHero && (
        <section className="relative overflow-hidden px-6 py-12 md:py-24 text-center border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              La camiseta de tu equipo
            </h1>
            <p className="text-base md:text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              Camisetas actuales y retro · Stock inmediato · Envíos a todo Chile
            </p>
            <button
              onClick={handleVerCatalogo}
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

        <main className="px-3 md:px-8 pb-12">
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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
            <>
              {categories.map((cat: any) => {
                const slug = getSlug(cat);
                const isThematic = THEMATIC_SLUGS.has(slug);
                const hasSubs = (cat.subcategories?.length || 0) > 0;

                if (!isThematic && hasSubs) {
                  const subsWithProducts = cat.subcategories.filter((sub: any) =>
                    (sub.products || []).some((p: any) => p?.available === true)
                  );
                  if (subsWithProducts.length === 0) return null;

                  const subsToShow = subsWithProducts.slice(0, 4);
                  const hasMore = subsWithProducts.length > 4;

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
                        {hasMore && (
                          <button
                            onClick={() => selectCategory(cat)}
                            className="text-sm text-gray-400 hover:text-white border border-white/20 rounded px-3 py-1 transition whitespace-nowrap"
                          >
                            Ver todas →
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {subsToShow.map((sub: any) => renderSubTile(sub, cat))}
                      </div>
                    </div>
                  );
                } else {
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
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {preview.map((p: any) => (
                          <ProductCard key={p._id} p={p} />
                        ))}
                      </div>
                    </div>
                  );
                }
              })}

              {/* HERO 2 — Cajita de regalo */}
              <section className="my-12 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 rounded-2xl p-6 md:p-8 text-center">
                  <div className="text-4xl md:text-5xl mb-3">🎁</div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                    ¿Vas a hacer un regalo?
                  </h2>
                  <p className="text-sm md:text-base text-gray-300 mb-6">
                    Agrega tu cajita de regalo por $1.990
                  </p>
                  <button
                    onClick={goToCajitas}
                    className="inline-block bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-white font-bold px-6 py-3 rounded-lg transition shadow-lg shadow-cyan-500/30"
                  >
                    Ver cajitas →
                  </button>
                </div>
              </section>

              {/* HERO 3 — No encontraste */}
              <section className="mb-12 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-2xl p-6 md:p-8 text-center">
                  <div className="text-4xl md:text-5xl mb-3">🔍</div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                    ¿No encontraste la camiseta que buscas?
                  </h2>
                  <p className="text-sm md:text-base text-gray-300 mb-6">
                    Consúltanos directamente al WhatsApp para verificar
                    disponibilidad
                  </p>
                  <button
                    onClick={handleNotFound}
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold px-6 py-3 rounded-lg transition shadow-lg shadow-green-500/30"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M16 .396C7.163.396 0 7.559 0 16.396c0 2.887.75 5.708 2.177 8.2L0 32l7.61-2.153c2.43 1.326 5.164 2.026 7.99 2.026h.006c8.835 0 16-7.163 16-16S24.835.396 16 .396zm0 29.21c-2.53 0-5.007-.68-7.165-1.967l-.514-.305-4.515 1.276 1.206-4.4-.334-.534a13.224 13.224 0 01-2.032-7.086c0-7.302 5.942-13.244 13.246-13.244 3.536 0 6.86 1.376 9.365 3.88a13.168 13.168 0 013.88 9.364c-.002 7.304-5.945 13.246-13.237 13.246zm7.272-9.92c-.397-.2-2.35-1.16-2.713-1.292-.363-.134-.628-.2-.893.2-.265.397-1.025 1.292-1.257 1.558-.232.265-.464.298-.86.1-.397-.2-1.676-.618-3.192-1.97-1.18-1.053-1.977-2.35-2.21-2.747-.232-.397-.025-.61.175-.808.18-.18.397-.464.595-.695.2-.232.265-.397.397-.662.132-.265.066-.497-.033-.695-.1-.2-.893-2.154-1.223-2.95-.32-.77-.647-.665-.893-.678l-.76-.014c-.265 0-.695.1-1.06.497-.363.397-1.39 1.36-1.39 3.314 0 1.954 1.423 3.84 1.62 4.105.2.265 2.8 4.27 6.79 5.985.95.41 1.69.654 2.267.837.952.303 1.817.26 2.5.158.762-.114 2.35-.96 2.68-1.89.33-.927.33-1.722.232-1.89-.1-.166-.364-.265-.76-.463z" />
                    </svg>
                    Consultar por WhatsApp
                  </button>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      <WhatsappButton />
    </>
  );
}
