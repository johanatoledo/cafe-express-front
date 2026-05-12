"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Clock3,
  PackageCheck,
  ChefHatIcon,
} from "lucide-react";

const TIEMPO_ESPERA_MS = 20 * 60 * 1000;

function calcularTiempoRestante(creadoEn) {
  if (!creadoEn) return TIEMPO_ESPERA_MS;

  const inicio = new Date(creadoEn).getTime();

  if (Number.isNaN(inicio)) return TIEMPO_ESPERA_MS;

  const final = inicio + TIEMPO_ESPERA_MS;
  const ahora = Date.now();

  return Math.max(final - ahora, 0);
}

export default function TimerPedido({
  creadoEn,
  estado,
  compacto = false,
}) {
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_ESPERA_MS);

  useEffect(() => {
    const actualizarTiempo = () => {
      setTiempoRestante(calcularTiempoRestante(creadoEn));
    };

    actualizarTiempo();

    const intervalo = setInterval(actualizarTiempo, 1000);

    return () => clearInterval(intervalo);
  }, [creadoEn]);

  const minutos = Math.floor(tiempoRestante / 1000 / 60);
  const segundos = Math.floor((tiempoRestante / 1000) % 60);

  // ===== MODO COMPACTO ADMIN =====

  if (compacto) {
    if ( estado?.toLowerCase() === "listo" || tiempoRestante <= 0) {
      return (
        <div className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-3 py-2 text-sm font-black text-green-700">
          <Check size={18} />
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-2 rounded-xl bg-yellow-50 px-3 py-2 text-sm font-black text-yellow-800 ring-1 ring-yellow-100">
        <Clock3 size={18} />

        <span>
          {minutos}:{segundos.toString().padStart(2, "0")}
        </span>
      </div>
    );
  }

  // ===== VISTA CLIENTE =====


  if (estado === "listo" || tiempoRestante <= 0) {
    return (
      <div className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-xl">
        <div className="flex items-center gap-4 bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-4 text-white">
          <div className="rounded-2xl bg-white/10 p-3">
            <Check size={28} />
          </div>

          <div>
            <h3 className="mt-1 text-lg font-black">
              Tu pedido está listo
            </h3>
            <p className="text-xs font-black  tracking-widest text-green-100">
              Puedes acercarte con tu numero de ID para recogerlo
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-yellow-200 bg-white shadow-xl">
      <div className="flex items-center gap-4 bg-gradient-to-r from-yellow-400 to-orange-400 px-5 py-4 text-white">
        <div className="rounded-2xl bg-white/10 p-3">
          <ChefHatIcon size={28} />
        </div>

        <div>
          <h3 className="mt-1 text-lg font-black">
            Estamos preparando tu orden
          </h3>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-5 py-6">
        <div className="flex items-center gap-3 rounded-2xl bg-yellow-50 px-5 py-3 ring-1 ring-yellow-100">
          <Clock3 className="text-yellow-700" size={24} />

          <span className="text-3xl font-black tracking-tight text-yellow-900">
            {minutos}:{segundos.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}