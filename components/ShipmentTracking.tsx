"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  detectTrackingCarrier,
  normalizeTrackingNumber,
  trackingCarriers,
  trackingUrl,
  type TrackingCarrier,
} from "@/lib/tracking-routing";

type TrackingOptions = {
  YQ_ContainerId: string;
  YQ_Height: number;
  YQ_Fc: string;
  YQ_Lang: string;
  YQ_Num: string;
};

declare global {
  interface Window {
    YQV5?: { trackSingle: (options: TrackingOptions) => void };
  }
}

export default function ShipmentTracking() {
  const [number, setNumber] = useState("");
  const [manualCarrier, setManualCarrier] = useState<TrackingCarrier | null>(null);
  const [ready, setReady] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [error, setError] = useState("");
  const [request, setRequest] = useState<{ number: string } | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const normalizedNumber = normalizeTrackingNumber(number);
  const carrier = manualCarrier ?? detectTrackingCarrier(number);
  const carrierName = trackingCarriers.find((option) => option.id === carrier)?.name;
  const usesWidget = carrier === "17track";
  const showLocalSelector = Boolean(normalizedNumber) && !usesWidget;

  useEffect(() => {
    if (ready) return;
    const timeout = window.setTimeout(() => setScriptError(true), 15000);
    return () => window.clearTimeout(timeout);
  }, [ready]);

  useEffect(() => {
    if (!request || !ready) return;
    try {
      if (!window.YQV5?.trackSingle) throw new Error("Widget unavailable");
      container.current?.replaceChildren();
      window.YQV5.trackSingle({
        YQ_ContainerId: "melifut-tracking-results",
        YQ_Height: 640,
        YQ_Fc: "0",
        YQ_Lang: "es",
        YQ_Num: request.number,
      });
    } catch {
      setError("No pudimos abrir el seguimiento. Puedes consultar tu envío directamente en 17TRACK.");
    }
  }, [request, ready]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeTrackingNumber(number);
    if (!normalized) {
      setError("Ingresa tu número de seguimiento.");
      input.current?.focus();
      return;
    }
    if (!/^[A-Z0-9-]{1,50}$/.test(normalized)) {
      setError("Revisa el número: usa letras, números o guiones, sin espacios, hasta 50 caracteres.");
      input.current?.focus();
      return;
    }
    setNumber(normalized);
    setError("");
    if (carrier !== "17track") {
      window.location.assign(trackingUrl(carrier, normalized));
      return;
    }
    if (!ready) {
      setError("17TRACK aún no está disponible. Puedes consultar el envío con el enlace de abajo.");
      return;
    }
    setRequest({ number: normalized });
  }

  const externalUrl = trackingUrl(carrier, number);

  return (
    <main className="min-h-screen bg-[#0a0a14] px-4 pb-16 pt-[210px] text-white md:px-8">
      <Script
        id="17track-widget"
        src="https://www.17track.net/externalcall.js"
        strategy="afterInteractive"
        onReady={() => {
          const available = typeof window.YQV5?.trackSingle === "function";
          setReady(available);
          setScriptError(!available);
        }}
        onError={() => setScriptError(true)}
      />

      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-gray-400 transition hover:text-cyan-400">
          ← Volver al catálogo
        </Link>

        <header className="mb-8 mt-8 text-center md:mb-10">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8" aria-hidden="true">
              <path d="m12 3 9 5-9 5-9-5 9-5Z" strokeLinejoin="round" />
              <path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">Tu camiseta está en camino</p>
          <h1 className="text-3xl font-bold md:text-5xl">Sigue tu pedido</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-400 md:text-base">
            Ingresa el número de seguimiento que recibiste al despachar tu pedido y consulta las novedades de tu envío.
          </p>
        </header>

        <section aria-label="Consultar envío" className="rounded-2xl border border-white/10 bg-[#11111c] p-5 shadow-xl md:p-8">
          <form onSubmit={submit} noValidate>
            <label htmlFor="tracking-number" className="mb-2 block text-sm font-semibold">Número de seguimiento</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                ref={input}
                id="tracking-number"
                name="trackingNumber"
                value={number}
                onChange={(event) => {
                  setNumber(event.target.value);
                  setManualCarrier(null);
                  setError("");
                  setRequest(null);
                }}
                maxLength={50}
                placeholder="Ej.: RR123456789CN"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "tracking-error tracking-help" : "tracking-help"}
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#0a0a14] px-4 py-3.5 text-base text-white outline-none placeholder:text-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
              <button type="submit" className="rounded-xl bg-cyan-400 px-6 py-3.5 font-bold text-gray-950 transition hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">
                Consultar
              </button>
            </div>
            <p id="tracking-help" className="mt-3 text-xs leading-relaxed text-gray-500">Usa el código de envío, que es distinto del número de pedido.</p>
            {showLocalSelector && (
              <>
                <label htmlFor="tracking-carrier" className="mb-2 mt-5 block text-sm font-semibold">Empresa de envío</label>
                <select
                  id="tracking-carrier"
                  value={carrier}
                  onChange={(event) => {
                    setManualCarrier(event.target.value as TrackingCarrier);
                    setError("");
                    setRequest(null);
                  }}
                  aria-describedby="carrier-help"
                  className="w-full rounded-xl border border-white/15 bg-[#0a0a14] px-4 py-3 text-base text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                >
                  {trackingCarriers.filter((option) => option.id !== "17track").map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                </select>
                <p id="carrier-help" role="status" className="mt-3 text-sm leading-relaxed text-gray-400">
                  Al consultar, abriremos el sitio oficial de {carrierName} con tu código. Puedes cambiar la empresa seleccionada.
                </p>
              </>
            )}
            {error && <p id="tracking-error" role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
            {usesWidget && normalizedNumber && !ready && (
              <p role={scriptError ? "alert" : "status"} className="mt-3 text-sm text-amber-300">
                {scriptError ? "17TRACK está tardando en cargar. Puedes consultar tu envío con el enlace de abajo." : "Cargando el seguimiento de 17TRACK…"}
              </p>
            )}
          </form>
          {(showLocalSelector || (normalizedNumber && usesWidget && (scriptError || error))) && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-gray-500">
              <span>{usesWidget ? "Consulta tu envío en otra pestaña" : "Seguimiento en el sitio oficial del courier"}</span>
              <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline-offset-4 hover:underline">{usesWidget ? "Abrir seguimiento ↗" : `Abrir en ${carrierName} ↗`}</a>
            </div>
          )}
        </section>

        <section aria-label="Resultado del seguimiento" className={request ? "mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white" : "hidden"}>
          {request && <h2 className="bg-[#11111c] px-5 py-4 text-sm font-semibold">Envío <span className="break-all text-cyan-400">{request.number}</span></h2>}
          <div ref={container} id="melifut-tracking-results" className="w-full min-w-0" />
        </section>

        <section aria-labelledby="tracking-questions" className="mt-10">
          <h2 id="tracking-questions" className="mb-4 text-lg font-semibold">¿Tienes dudas sobre tu envío?</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
              <h3 className="mb-2 text-sm font-semibold">¿Dónde encuentro mi código?</h3>
              <p className="text-sm leading-relaxed text-gray-400">Revisa el mensaje de confirmación de despacho. Si aún no lo recibiste, contáctanos por el canal donde realizaste tu compra.</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
              <h3 className="mb-2 text-sm font-semibold">Mi envío aún no tiene movimientos</h3>
              <p className="text-sm leading-relaxed text-gray-400">El transportista puede tardar en registrar el primer movimiento. Verifica el código y vuelve a consultar más tarde.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
