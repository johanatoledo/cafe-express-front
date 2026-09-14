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

  const estadoNormalizado = String(estado || "").toLowerCase();
  const estaEntregado = estadoNormalizado === "entregado";
  const estaListo = estadoNormalizado === "listo";

  useEffect(() => {
    if (!pagoVerificado || !pagoConfirmadoEn || estaEntregado) {
      setTiempoRestante(null);
      return;
    }

    const inicio = new Date(pagoConfirmadoEn).getTime();

    if (Number.isNaN(inicio)) {
      console.error(
        "Fecha de confirmación de pago inválida:",
        pagoConfirmadoEn
      );

      setTiempoRestante(null);
      return;
    }

    const calcularTiempo = () => {
      const tiempoTranscurrido = Date.now() - inicio;
      const restante = TIEMPO_ESPERA_MS - tiempoTranscurrido;

      setTiempoRestante(Math.max(restante, 0));
    };

    calcularTiempo();

    const intervalo = window.setInterval(calcularTiempo, 1000);

    return () => {
      window.clearInterval(intervalo);
    };
  }, [
    pagoConfirmadoEn,
    pagoVerificado,
    estaEntregado,
  ]);

  if (!pagoVerificado) {
    return compacto ? (
      <div className="inline-flex items-center gap-1.5 rounded-xl bg-red-100 px-3 py-1.5 text-xs font-black text-red-700">
        <Clock3 size={15} />
        <span>Confirmar pago</span>
      </div>
    ) : (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-xs font-black uppercase text-red-700">
          Esperando confirmación de pago
        </p>
      </div>
    );
  }

  if (!pagoConfirmadoEn) {
    return compacto ? (
      <div className="inline-flex items-center gap-1.5 rounded-xl bg-orange-100 px-3 py-1.5 text-xs font-black text-orange-700">
        <Clock3 size={15} />
        <span>Fecha no registrada</span>
      </div>
    ) : (
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-center">
        <p className="text-xs font-black uppercase text-orange-700">
          El pago está verificado, pero falta la hora de confirmación
        </p>
      </div>
    );
  }

  if (estaEntregado) {
    return compacto ? (
      <div className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-600">
        <Check size={16} />
        <span>Entregado</span>
      </div>
    ) : null;
  }

  if (tiempoRestante === null) {
    return compacto ? (
      <div className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-500">
        <Clock3 size={15} className="animate-pulse" />
        <span>Calculando</span>
      </div>
    ) : (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-xs font-bold text-gray-500">
          Iniciando cronómetro...
        </p>
      </div>
    );
  }

  const pedidoListo = estaListo || tiempoRestante <= 0;

  const minutos = Math.floor(tiempoRestante / 60000);
  const segundos = Math.floor(
    (tiempoRestante % 60000) / 1000
  );

  const tiempoFormateado = `${minutos}:${String(segundos).padStart(
    2,
    "0"
  )}`;

  if (compacto) {
    if (pedidoListo) {
      return (
        <div className="inline-flex items-center gap-1.5 rounded-xl bg-green-100 px-3 py-1.5 text-xs font-black text-green-700">
          <Check size={16} />
          <span>Listo</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-900 ring-1 ring-amber-200">
        <Clock3
          size={15}
          className="animate-pulse text-amber-700"
        />

        <span className="font-mono">
          {tiempoFormateado}
        </span>
      </div>
    );
  }

  if (pedidoListo) {
    return (
      <div className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-xl">
        <div className="flex items-center gap-4 bg-linear-to-r from-green-500 to-emerald-600 px-5 py-4 text-white">
          <div className="rounded-2xl bg-white/20 p-3">
            <Check size={28} />
          </div>

          <div>
            <h3 className="text-lg font-black">
              Tu pedido está listo
            </h3>

            <p className="text-xs font-medium text-green-100">
              Puedes recogerlo o esperarlo en la ubicación asignada.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-xl">
      <div className="flex items-center gap-4 bg-linear-to-r from-amber-500 to-orange-500 px-5 py-4 text-white">
        <div className="rounded-2xl bg-white/20 p-3">
          <ChefHatIcon size={28} />
        </div>

        <div>
          <h3 className="text-lg font-black">
            Estamos preparando tu orden
          </h3>

        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-5 py-6">
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 px-6 py-3 ring-1 ring-amber-200">
          <Clock3
            className="animate-pulse text-amber-700"
            size={24}
          />

          <span className="font-mono text-3xl font-black tracking-tight text-amber-950">
            {tiempoFormateado}
          </span>
        </div>
      </div>
    </div>
  );
}