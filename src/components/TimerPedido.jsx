"use client";

import { useEffect, useState } from "react";
import { Check, Clock3, ChefHatIcon } from "lucide-react";

// Tiempo estándar de preparación: 20 minutos
const TIEMPO_ESPERA_MS = 20 * 60 * 1000;

export default function TimerPedido({
  pagoConfirmadoEn,
  pagoVerificado,
  estado,
  compacto = false,
}) {
  const [tiempoRestante, setTiempoRestante] = useState(null);

  useEffect(() => {
    // 1. Si el pago no está verificado o ya fue entregado, destruimos el timer
    if (!pagoVerificado || estado === "entregado") {
      setTiempoRestante(null);
      return;
    }

    const calcularTiempo = () => {
      // 2. Si no viene fecha del servidor, usamos la hora actual como fallback para iniciar el conteo
      const timestampInicio = pagoConfirmadoEn
        ? new Date(pagoConfirmadoEn).getTime()
        : Date.now();

      // Si la conversión resulta en NaN, caemos a Date.now()
      const inicio = Number.isNaN(timestampInicio) ? Date.now() : timestampInicio;
      const ahora = Date.now();
      const restante = TIEMPO_ESPERA_MS - (ahora - inicio);

      // Seteamos el tiempo restante asegurando que no baje de 0
      setTiempoRestante(Math.max(restante, 0));
    };

    calcularTiempo();
    const intervalo = setInterval(calcularTiempo, 1000);

    return () => clearInterval(intervalo);
  }, [pagoConfirmadoEn, pagoVerificado, estado]);

  const estadoNormalizado = estado?.toLowerCase();
  const pedidoListo = estadoNormalizado === "listo" || tiempoRestante === 0;

  // CASO A: Pago no verificado aún
  if (!pagoVerificado) {
    return compacto ? (
      <div className="inline-flex items-center gap-1.5 rounded-xl bg-red-100 px-3 py-1.5 text-xs font-black text-red-700">
        <Clock3 size={15} />
        <span>Confirme pago para iniciar</span>
      </div>
    ) : (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-xs font-black uppercase text-red-700">
          Esperando confirmación de pago
        </p>
      </div>
    );
  }

  // CASO B: El tiempo aún no se calcula (Cargando)
  if (tiempoRestante === null) {
    return compacto ? (
      <div className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-500">
        <Clock3 size={15} className="animate-spin" />
        <span>Calculando...</span>
      </div>
    ) : (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-xs font-bold text-gray-500">Iniciando cronómetro...</p>
      </div>
    );
  }

  // Formatear tiempo M:SS
  const minutos = Math.floor(tiempoRestante / 60000);
  const segundos = Math.floor((tiempoRestante % 60000) / 1000);
  const tiempoFormateado = `${minutos}:${String(segundos).padStart(2, "0")}`;

  // VISTA COMPACTA (Para la tabla del Admin)
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
        <Clock3 size={15} className="animate-pulse text-amber-700" />
        <span className="font-mono">{tiempoFormateado}</span>
      </div>
    );
  }

  // VISTA COMPLETA (Para el cliente / seguimiento)
  if (pedidoListo) {
    return (
      <div className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-xl">
        <div className="flex items-center gap-4 bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-4 text-white">
          <div className="rounded-2xl bg-white/20 p-3">
            <Check size={28} />
          </div>
          <div>
            <h3 className="text-lg font-black">Tu pedido está listo</h3>
            <p className="text-xs font-medium text-green-100">
              Puedes acercarte a recoger tu pedido o esperarlo en la mesa asignada.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-xl">
      <div className="flex items-center gap-4 bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 text-white">
        <div className="rounded-2xl bg-white/20 p-3">
          <ChefHatIcon size={28} />
        </div>
        <div>
          <h3 className="text-lg font-black">Estamos preparando tu orden</h3>
          <p className="text-xs font-medium text-amber-100">
            Tu pedido ingresó a la cocina.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-5 py-6">
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 px-6 py-3 ring-1 ring-amber-200">
          <Clock3 className="text-amber-700 animate-pulse" size={24} />
          <span className="font-mono text-3xl font-black tracking-tight text-amber-950">
            {tiempoFormateado}
          </span>
        </div>
      </div>
    </div>
  );
}