"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import TimerPedido from "@/components/TimerPedido";
import { obtenerPedido } from "@/services/pedidoService";
import { CheckSquare, PackageCheck } from "lucide-react";

export default function PedidoDetallePage() {
  const params = useParams();
  const id = params?.id;

  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;

    let activo = true;

    const cargarPedido = async () => {
      try {
        const data = await obtenerPedido(id);
        if (activo && data) {
          setPedido(data);
        }
      } catch (error) {
        console.error("Error al cargar el pedido:", error);
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    // Carga inicial
    cargarPedido();

    // Polling cada 4 segundos para actualizar el estado cuando Admin confirme el pago
    const intervalo = window.setInterval(() => {
      cargarPedido();
    }, 4000);

    return () => {
      activo = false;
      window.clearInterval(intervalo);
    };
  }, [id]);

  if (cargando) {
    return (
      <main className="min-h-screen bg-orange-50">
        <Navbar />
        <div className="flex justify-center p-10">
          <p className="font-black text-gray-700 animate-pulse">
            Cargando estado del pedido...
          </p>
        </div>
      </main>
    );
  }

  if (!pedido) {
    return (
      <main className="min-h-screen bg-orange-50">
        <Navbar />
        <div className="flex justify-center p-10">
          <p className="font-black text-red-600">Pedido no encontrado.</p>
        </div>
      </main>
    );
  }

  // Parsear productos de forma segura
  let productos = [];
  try {
    productos =
      typeof pedido.productos === "string"
        ? JSON.parse(pedido.productos)
        : pedido.productos || [];
  } catch {
    productos = [];
  }

  // Normalizar booleano de pago
  const pagoVerificado = Boolean(
    pedido.pago_verificado === 1 ||
      pedido.pago_verificado === "1" ||
      pedido.pago_verificado === true
  );

  // Vista de Pedido Entregado
  if (pedido.estado?.toLowerCase() === "entregado") {
    return (
      <main className="min-h-screen bg-orange-50">
        <Navbar />
        <section className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-3xl bg-emerald-600 p-8 shadow-xl text-white">
            <div className="flex w-full flex-col items-center justify-center p-4">
              <PackageCheck size={160} className="mb-4 text-emerald-100" />
              <p className="text-xs font-black uppercase tracking-widest text-emerald-200">
                Pedido entregado
              </p>
              <h1 className="mt-2 text-2xl font-black text-center">
                ¡Gracias por tu compra!
              </h1>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl">
          {/* Encabezado del Pedido */}
          <div className="flex w-full items-center justify-center">
            <div className="flex flex-col items-center rounded-2xl bg-green-50 p-6 text-green-700 w-full border border-green-100">
              <CheckSquare size={64} className="mb-2 opacity-90" />
              <h1 className="text-center font-black uppercase text-lg text-green-800">
                Pedido generado correctamente
              </h1>
            </div>
          </div>

          {/* Datos del Cliente y Estado */}
          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-5 space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-black text-gray-900 text-sm uppercase">
                Estado actual:{" "}
                <span className="text-amber-700 font-extrabold">
                  {pagoVerificado ? pedido.estado || "En preparación" : "Pendiente de pago"}
                </span>
              </span>
              <span className="text-xs font-bold text-gray-500">
                ID Pedido #{pedido.id}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-800">
              Cliente: {pedido.cliente_nombre}
            </p>
            {pedido.ubicacion && (
              <p className="text-xs font-medium text-gray-600">
                Ubicación: {pedido.ubicacion}
              </p>
            )}
          </div>

          {/* Detalle de Productos */}
          <div className="mt-6">
            <p className="font-black text-gray-900 text-sm">Detalle del pedido</p>

            <ul className="mt-3 space-y-2">
              {productos.map((item, index) => (
                <li
                  key={item.id || index}
                  className="flex justify-between items-center rounded-xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 border border-gray-100"
                >
                  <div>
                    <span className="font-black text-amber-800 mr-2">
                      {item.cantidad}x
                    </span>
                    <span>{item.nombre}</span>
                  </div>
                  <span className="text-gray-900 font-mono">
                    S/ {Number(item.precio || 0).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-between items-center border-t border-dashed border-gray-200 pt-3">
              <span className="font-black text-gray-800">Total a pagar:</span>
              <span className="font-black text-lg text-red-600">
                S/ {Number(pedido.total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Cronómetro en Tiempo Real */}
          <div className="mt-8">
            <TimerPedido
              pagoConfirmadoEn={pedido.pago_confirmado_en}
              pagoVerificado={pagoVerificado}
              estado={pedido.estado}
            />
          </div>
        </div>
      </section>
    </main>
  );
}