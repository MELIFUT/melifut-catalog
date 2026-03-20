"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLogoSize = () => {
    const min = 70;
    const max = 140;

    if (scrollY <= 0) return max;
    if (scrollY >= 200) return min;

    return max - (scrollY / 200) * (max - min);
  };

  const isScrolled = scrollY > 20;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300
        ${isScrolled ? "bg-black/90 shadow-lg" : "bg-black/60"}
      `}
    >
      <div className="flex items-center justify-center gap-6 px-6 py-4 max-w-5xl mx-auto">
        {/* INSTAGRAM */}
        <a
          href="https://www.instagram.com/melifut_cl"
          target="_blank"
          className="text-white hover:scale-110 transition hover:text-pink-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-10"
          >
            <path d="M7.75 2C4.678 2 2 4.678 2 7.75v8.5C2 19.322 4.678 22 7.75 22h8.5C19.322 22 22 19.322 22 16.25v-8.5C22 4.678 19.322 2 16.25 2h-8.5zm0 2h8.5C18.216 4 20 5.784 20 7.75v8.5c0 1.966-1.784 3.75-3.75 3.75h-8.5C5.784 20 4 18.216 4 16.25v-8.5C4 5.784 5.784 4 7.75 4zm9.25 1a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
          </svg>
        </a>

        {/* LOGO */}
        <img
          src="/melifut-logo.jpg"
          alt="logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer transition-all duration-500 ease-out rounded-full object-cover border-2 border-gray-700 shadow-lg hover:scale-105"
          style={{
            height: `${getLogoSize()}px`,
            width: `${getLogoSize()}px`,
          }}
        />

        {/* TIKTOK */}
        <a
          href="https://www.tiktok.com/@melifut.cl"
          target="_blank"
          className="text-white hover:scale-110 transition hover:text-cyan-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-10"
          >
            <path d="M16 3c.2 2.2 1.9 4 4 4v3c-1.5 0-3-.4-4-1v6.5a5.5 5.5 0 11-4-5.3v3.2a2.3 2.3 0 102 2.2V3h2z" />
          </svg>
        </a>
      </div>

      {/* 🔥 línea inferior con glow */}
      <div className="w-full h-[3px] flex shadow-[0_0_10px_rgba(0,255,255,0.5)]">
        <div className="w-1/2 bg-cyan-500"></div>
        <div className="w-1/2 bg-red-500"></div>
      </div>
    </nav>
  );
}
