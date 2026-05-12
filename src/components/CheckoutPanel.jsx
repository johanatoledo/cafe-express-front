"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearPedido } from "@/services/pedidoService";
import Image from "next/image";
export default function CheckoutPanel({
  carrito,
  total,
  onClose,
  onPedidoCreado,
}) {
  const router = useRouter();
  const itemsPedido = Array.isArray(carrito) ? carrito : [];

  const [clienteNombre, setClienteNombre] = useState("");
  const [yapeOperacion, setYapeOperacion] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const confirmarPedido = async () => {
  setMensajeError("");
  setMensajeExito("");

  const nombreLimpio = clienteNombre.trim();
  const operacionLimpia = yapeOperacion.trim();
  const totalPedido = Number(total);

  if (!nombreLimpio) {
    setMensajeError("Ingresa tu nombre para identificar tu pedido.");
    return;
  }

  if (!operacionLimpia) {
    setMensajeError("Ingresa el ID de operación de Yape.");
    return;
  }

  if (itemsPedido.length === 0) {
    setMensajeError("Agrega productos antes de confirmar el pedido.");
    return;
  }

  if (!totalPedido || totalPedido <= 0) {
    setMensajeError("El total del pedido no es válido.");
    return;
  }

  try {
    setCargando(true);
     const data = {
      cliente_nombre: nombreLimpio,

      productos: itemsPedido.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      precio: Number(item.precio),
      cantidad: Number(item.cantidad),
  })),

  total: totalPedido,

  yape_operacion: operacionLimpia,
};
   

    const respuesta = await crearPedido(data);

    if (!respuesta?.pedidoId) {
      throw new Error("No se recibió el número de pedido.");
    }

    setMensajeExito("Pedido registrado correctamente. Redirigiendo...");

    localStorage.removeItem("carrito");
    onPedidoCreado();

    router.push(`/pedido/${respuesta.pedidoId}`);
  } catch (error) {
    console.error("Error al crear pedido:", error);

    setMensajeError(
      error.message ||
        "No pudimos registrar tu pedido. Verifica tu conexión e inténtalo nuevamente."
    );
  } finally {
    setCargando(false);
  }
};

  return (
  <div className="fixed inset-0 z-[100] bg-black/50 px-4 py-6 backdrop-blur-sm">
    <div className="mx-auto flex max-h-[90vh] max-w-xl flex-col overflow-hidden rounded-3xl bg-pedido-white shadow-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-pedido-white px-6 py-5">
        <h2 className="text-2xl font-black text-pedido-red">
          CONFIRMAR PEDIDO
        </h2>

        <button
          onClick={onClose}
          className="rounded-full bg-gray-100 p-2 text-pedido-gray hover:bg-red-100 hover:text-red-700"
        >
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="mt-6 overflow-hidden rounded-3xl bg-purple-900 p-6 shadow-lg ring-1 ring-purple-200">
          <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-center lg:text-left">
              <span className="rounded-full bg-green-400 px-4 py-2 text-xs font-black uppercase tracking-wide text-pedido-white">
                Paga rápido con Yape
              </span>

              <p className="mt-4 text-xl font-black text-pedido-white">
                Escanea el QR
              </p>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-pedido-white">
                Realiza el pago desde tu aplicación Yape y luego coloca el ID de
                operación para confirmar automáticamente tu pedido.
              </p>

              <div className="mt-5">
                <p className="text-xl font-black uppercase tracking-wider text-pedido-white">
                  Número 
                </p>

                <p className="mt-1 text-2xl font-black text-pedido-white">
                  999 999 999
                </p>
              </div>
            </div>

            <div className="relative flex h-56 w-56 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-pedido-white p-2 shadow-2xl ring-1 ring-purple-200">
              <Image
                src="/branding/yape-qr.jpg"
                alt="QR Yape Chifa Express"
                fill
                sizes="224px"
                className="object-contain p-4"
                priority
              />
            </div>
            
          </div>
        </div>

        <div className="mt-6 max-h-56 space-y-3 overflow-y-auto rounded-2xl border border-gray-100 p-3">
          {carrito.map((item) => (
            <div
              key={item.id}
              className="flex justify-between rounded-2xl px-4 py-3 text-sm font-bold"
            >
              <span>
                {item.nombre} x{item.cantidad}
              </span>

              <span className="text-red-700">
                S/ {(item.precio * item.cantidad).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="text-sm font-black text-pedido-gray">
            Nombre del cliente <span className="text-pedido-red">*</span>
          </label>

          <input
            type="text"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
            placeholder="Ejemplo: María López"
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-red-700"
          />
        </div>

        <div className="mt-5">
          <label className="text-sm font-black text-gray-700">
            ID de operación Yape <span className="text-pedido-red">*</span>
          </label>

          <input
            type="text"
            value={yapeOperacion}
            onChange={(e) => setYapeOperacion(e.target.value)}
            placeholder="Ejemplo: 84592136"
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-red-700"
          />
        </div>
      </div>

      <div className="sticky bottom-0 flex items-center justify-between border-t bg-white px-6 py-5">
        <p className="text-xl font-black text-gray-950">
          Total: S/ {total.toFixed(2)}
        </p>

        <button
          onClick={confirmarPedido}
          disabled={cargando}
          className="rounded-2xl bg-red-700 px-6 py-3 font-black text-white hover:bg-red-800 disabled:bg-gray-400"
        >
          {cargando ? "Enviando..." : "Confirmar"}
        </button>
        {mensajeError && (
         <div className="mt-4 rounded-2xl border border-red-200 border-none px-2 py-3 text-sm text-center font-bold text-red-700">
          * {mensajeError}
         </div>
         )}

        {mensajeExito && (
         <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
         {mensajeExito}
       </div>
       )}
      </div>
    </div>
  </div>
);
}