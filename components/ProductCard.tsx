"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductCard({ p }: any) {
  const phone = "569XXXXXXXX"; // 👈 tu número

  const handleWhatsapp = () => {
    const message = encodeURIComponent(
      `Hola! Me interesa la camiseta ${p.name} 👀`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{ enabled: true }}
        pagination={{ clickable: true }}
        spaceBetween={8}
        slidesPerView={1.1}
        breakpoints={{
          768: {
            slidesPerView: 1,
          },
        }}
      >
        {p.images?.map((img: any, i: number) => (
          <SwiperSlide key={i}>
            <img src={img.asset.url} className="w-full h-60 object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="p-3 flex flex-col gap-2">
        <h2 className="font-semibold text-sm">{p.name}</h2>

        <p className="text-xs text-gray-500">
          {p.team} · {p.year}
        </p>

        {p.isRetro && <span className="text-xs text-red-500">Retro 🔥</span>}

        {/* 🔥 WHATSAPP (TU SVG) */}
        <button
          onClick={handleWhatsapp}
          className="mt-2 flex items-center justify-center gap-2 text-green-600 hover:text-green-700 text-xs font-medium transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M16 .396C7.163.396 0 7.559 0 16.396c0 2.887.75 5.708 2.177 8.2L0 32l7.61-2.153c2.43 1.326 5.164 2.026 7.99 2.026h.006c8.835 0 16-7.163 16-16S24.835.396 16 .396zm0 29.21c-2.53 0-5.007-.68-7.165-1.967l-.514-.305-4.515 1.276 1.206-4.4-.334-.534a13.224 13.224 0 01-2.032-7.086c0-7.302 5.942-13.244 13.246-13.244 3.536 0 6.86 1.376 9.365 3.88a13.168 13.168 0 013.88 9.364c-.002 7.304-5.945 13.246-13.237 13.246zm7.272-9.92c-.397-.2-2.35-1.16-2.713-1.292-.363-.134-.628-.2-.893.2-.265.397-1.025 1.292-1.257 1.558-.232.265-.464.298-.86.1-.397-.2-1.676-.618-3.192-1.97-1.18-1.053-1.977-2.35-2.21-2.747-.232-.397-.025-.61.175-.808.18-.18.397-.464.595-.695.2-.232.265-.397.397-.662.132-.265.066-.497-.033-.695-.1-.2-.893-2.154-1.223-2.95-.32-.77-.647-.665-.893-.678l-.76-.014c-.265 0-.695.1-1.06.497-.363.397-1.39 1.36-1.39 3.314 0 1.954 1.423 3.84 1.62 4.105.2.265 2.8 4.27 6.79 5.985.95.41 1.69.654 2.267.837.952.303 1.817.26 2.5.158.762-.114 2.35-.96 2.68-1.89.33-.927.33-1.722.232-1.89-.1-.166-.364-.265-.76-.463z" />
          </svg>
          Consultar
        </button>
      </div>
    </div>
  );
}
