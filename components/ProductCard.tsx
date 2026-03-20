"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

export default function ProductCard({ p }: any) {
  const [open, setOpen] = useState(false);
  const phone = "569XXXXXXXX";

  const handleWhatsapp = () => {
    const message = encodeURIComponent(
      `Hola! Me interesa la camiseta ${p.name} 👀`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  // 🔒 BLOQUEAR SCROLL
  useEffect(() => {
    if (open) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [open]);

  return (
    <>
      {/* 🔥 CARD */}
      <div className="group bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:shadow-2xl transition-all duration-300">
        {/* 🔥 IMAGEN CLICKABLE */}
        <div className="relative cursor-pointer" onClick={() => setOpen(true)}>
          <Swiper modules={[Pagination]} pagination={{ clickable: true }}>
            {p.images?.map((img: any, i: number) => (
              <SwiperSlide key={i}>
                <img
                  src={img.asset.url}
                  className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          {/* BADGE */}
          {p.isRetro && (
            <span className="absolute top-3 left-3 bg-white/10 backdrop-blur px-2 py-1 text-[10px] rounded-full text-white border border-white/10">
              Retro
            </span>
          )}
        </div>

        {/* INFO */}
        <div className="p-4 flex flex-col gap-2">
          <h2 className="text-sm font-medium text-white line-clamp-2">
            {p.name}
          </h2>

          <p className="text-xs text-gray-400">
            {p.team} · {p.year}
          </p>

          {/* WHATSAPP MINIMAL */}
          <button
            onClick={handleWhatsapp}
            className="mt-4 flex items-center justify-center gap-2 text-green-400 hover:text-green-300 text-xs font-medium transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M16 .396C7.163.396 0 7.559 0 16.396c0 2.887.75 5.708 2.177 8.2L0 32l7.61-2.153c2.43 1.326 5.164 2.026 7.99 2.026h.006c8.835 0 16-7.163 16-16S24.835.396 16 .396zm0 29.21c-2.53 0-5.007-.68-7.165-1.967l-.514-.305-4.515 1.276 1.206-4.4-.334-.534a13.224 13.224 0 01-2.032-7.086c0-7.302 5.942-13.244 13.246-13.244 3.536 0 6.86 1.376 9.365 3.88a13.168 13.168 0 013.88 9.364c-.002 7.304-5.945 13.246-13.237 13.246zm7.272-9.92c-.397-.2-2.35-1.16-2.713-1.292-.363-.134-.628-.2-.893.2-.265.397-1.025 1.292-1.257 1.558-.232.265-.464.298-.86.1-.397-.2-1.676-.618-3.192-1.97-1.18-1.053-1.977-2.35-2.21-2.747-.232-.397-.025-.61.175-.808.18-.18.397-.464.595-.695.2-.232.265-.397.397-.662.132-.265.066-.497-.033-.695-.1-.2-.893-2.154-1.223-2.95-.32-.770-.647-.665-.893-.678l-.76-.014c-.265 0-.695.1-1.06.497-.363.397-1.39 1.36-1.39 3.314 0 1.954 1.423 3.84 1.62 4.105.2.265 2.8 4.27 6.79 5.985.95.41 1.69.654 2.267.837.952.303 1.817.26 2.5.158.762-.114 2.35-.96 2.68-1.89.33-.927.33-1.722.232-1.89-.1-.166-.364-.265-.76-.463z" />
            </svg>
            Consultar
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
          {/* 🔝 HEADER (cerrar) */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setOpen(false)}
              className="text-white text-2xl hover:opacity-70"
            >
              ✕
            </button>
          </div>

          {/* 🖼️ CONTENIDO (IMAGEN + SWIPE + ZOOM) */}
          <div className="flex-1 flex items-center justify-center overflow-hidden px-4">
            <Swiper
              modules={[Navigation, Pagination, Zoom]}
              navigation
              pagination={{ clickable: true }}
              zoom
              className="w-full max-w-5xl h-full"
            >
              {p.images?.map((img: any, i: number) => (
                <SwiperSlide
                  key={i}
                  className="flex items-center justify-center"
                >
                  <div className="swiper-zoom-container flex items-center justify-center h-full">
                    <img
                      src={img.asset.url}
                      className="max-h-[70vh] object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 🔽 INFO */}
          <div className="border-t border-white/10 bg-black p-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
              {/* 📝 TEXTO */}
              <div>
                <h2 className="text-white text-base md:text-lg font-semibold">
                  {p.name}
                </h2>

                <p className="text-gray-400 text-sm">
                  {p.team} · {p.year}
                </p>
              </div>

              {/* 💬 BOTÓN CONSULTAR */}
              <button
                onClick={handleWhatsapp}
                className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M16 .396C7.163.396 0 7.559 0 16.396c0 2.887.75 5.708 2.177 8.2L0 32l7.61-2.153c2.43 1.326 5.164 2.026 7.99 2.026h.006c8.835 0 16-7.163 16-16S24.835.396 16 .396zm0 29.21c-2.53 0-5.007-.68-7.165-1.967l-.514-.305-4.515 1.276 1.206-4.4-.334-.534a13.224 13.224 0 01-2.032-7.086c0-7.302 5.942-13.244 13.246-13.244 3.536 0 6.86 1.376 9.365 3.88a13.168 13.168 0 013.88 9.364c-.002 7.304-5.945 13.246-13.237 13.246zm7.272-9.92c-.397-.2-2.35-1.16-2.713-1.292-.363-.134-.628-.2-.893.2-.265.397-1.025 1.292-1.257 1.558-.232.265-.464.298-.86.1-.397-.2-1.676-.618-3.192-1.97-1.18-1.053-1.977-2.35-2.21-2.747-.232-.397-.025-.61.175-.808.18-.18.397-.464.595-.695.2-.232.265-.397.397-.662.132-.265.066-.497-.033-.695-.1-.2-.893-2.154-1.223-2.95-.32-.770-.647-.665-.893-.678l-.76-.014c-.265 0-.695.1-1.06.497-.363.397-1.39 1.36-1.39 3.314 0 1.954 1.423 3.84 1.62 4.105.2.265 2.8 4.27 6.79 5.985.95.41 1.69.654 2.267.837.952.303 1.817.26 2.5.158.762-.114 2.35-.96 2.68-1.89.33-.927.33-1.722.232-1.89-.1-.166-.364-.265-.76-.463z" />
                </svg>
                Consultar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
