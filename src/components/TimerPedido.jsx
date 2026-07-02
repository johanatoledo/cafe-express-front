"use client";

import { useEffect, useState } from "react";
import { Check, Clock3, ChefHatIcon } from "lucide-react";

const TIEMPO_ESPERA_MS = 20 * 60 * 1000;

export default function TimerPedido({
  pagoConfirmadoEn,
  pagoVerificado,
  estado,
  compacto = false,
}) {
  const [tiempoRestante, setTiempoRestante] = useState(null);

  useEffect(() => {
    if (!pagoVerificado || !pagoConfirmadoEn || estado === "entregado") {
      setTiempoRestante(null);
      return;
    }

    const calcularTiempo = () => {
      const inicio = new Date(pagoConfirmadoEn).getTime();

      if (Number.isNaN(inicio)) {
        setTiempoRestante(null);
        return;
      }

      const ahora = Date.now();
      const restante = TIEMPO_ESPERA_MS - (ahora - inicio);

      setTiempoRestante(Math.max(restante, 0));
    };

    calcularTiempo();

    const intervalo = setInterval(calcularTiempo, 1000);

    return () => clearInterval(intervalo);
  }, [pagoConfirmadoEn, pagoVerificado, estado]);

  const estadoNormalizado = estado?.toLowerCase();
  const pedidoListo = estadoNormalizado === "listo" || tiempoRestante === 0;

  if (!pagoVerificado) {
    return compacto ? (
      <div className="inline-flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-sm font-black text-red-700">
        <Clock3 size={18} />
        <span>Pago pendiente</span>
      </div>
    ) : (
      <div className="rounded-3xl border border-red-200 bg-white p-5 text-center shadow-xl">
        <p className="text-sm font-black text-red-700">
          Esperando confirmación de pago
        </p>
      </div>
    );
  }

  if (tiempoRestante === null) {
    return compacto ? (
      <div className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm font-black text-gray-600">
        Sin iniciar
      </div>
    ) : (
      <div className="rounded-3xl border border-gray-200 bg-white p-5 text-center shadow-xl">
        <p className="text-sm font-black text-gray-600">
          El tiempo de preparación aún no inicia.
        </p>
      </div>
    );
  }

  const minutos = Math.floor(tiempoRestante / 60000);
  const segundos = Math.floor((tiempoRestante % 60000) / 1000);
  const tiempoFormateado = `${minutos}:${String(segundos).padStart(2, "0")}`;

  if (compacto) {
    if (pedidoListo) {
      return (
        <div className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-3 py-2 text-sm font-black text-green-700">
          <Check size={18} />
          <span>Listo</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-2 rounded-xl bg-yellow-50 px-3 py-2 text-sm font-black text-yellow-800 ring-1 ring-yellow-100">
        <Clock3 size={18} />
        <span>{tiempoFormateado}</span>
      </div>
    );
  }

  if (pedidoListo) {
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
            <p className="text-xs font-black tracking-widest text-green-100">
              Puedes acercarte con tu número de pedido para recogerlo o esperarlo en la mesa si es un pedido para comer en el local.
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
            {tiempoFormateado}
          </span>
        </div>
      </div>
    </div>
  );
}