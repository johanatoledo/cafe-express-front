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
  const [tipoPedido, setTipoPedido] = useState("restaurante");
  const [yapeOperacion, setYapeOperacion] = useState("");
  const [cargando, setCargando] = useState(false);
  const [nombreError, setNombreError] = useState("");
  const [yapeError, setYapeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const confirmarPedido = async () => {
    setNombreError("");
    setYapeError("");
    setMensajeExito("");

    const nombreLimpio = clienteNombre.trim();
    const operacionLimpia = yapeOperacion.trim();
    const totalPedido = Number(total);

    let hayError = false;

    if (!nombreLimpio) {
      setNombreError("Ingresa tu nombre para identificar tu pedido.");
      hayError = true;
    }

    if (!operacionLimpia) {
      setYapeError("Ingresa el ID de operación de Yape.");
      hayError = true;
    }

    if (hayError) return;
    if (itemsPedido.length === 0) return;
    if (!totalPedido || totalPedido <= 0) return;

    try {
      setCargando(true);

      const data = {
        cliente_nombre: nombreLimpio,
        tipo_pedido: tipoPedido,

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
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto flex max-h-[90vh] max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-pedido-white px-6 py-5">
          <h2 className="text-2xl font-black cafe-title">
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
                <span className="rounded-full bg-green-300 px-4 py-2 text-xs font-black uppercase tracking-wide text-pedido-white">
                  Paga rápido con Yape
                </span>

                <p className="mt-4 text-xl font-black text-white">
                  Escanea el QR
                </p>

                <p className="mt-3 max-w-md text-sm leading-relaxed text-white">
                  Realiza el pago desde tu aplicación Yape y coloca el ID de
                  operación. Al confirmar el pago, tu pedido será preparado.
                </p>

                <div className="mt-5">
                  <p className="text-xl font-black uppercase tracking-wider text-white">
                    Número
                  </p>

                  <p className="mt-1 text-2xl font-black text-white">
                    929 943 978
                  </p>
                </div>
              </div>

              <div className="relative flex h-56 w-56 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-pedido-white p-2 shadow-2xl ring-1 ring-purple-200">
                <Image
                  src="/branding/yape-qr.webp"
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
            {itemsPedido.map((item) => (
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
              Nombre del cliente <span className="text-red-700">*</span>
            </label>

            <input
              type="text"
              value={clienteNombre}
              onChange={(e) => {
                setClienteNombre(e.target.value);
                if (nombreError) setNombreError("");
              }}
              placeholder="Ejemplo: María López"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none cafe-input"
            />

            {nombreError && (
              <div className="mt-2 text-xs font-bold text-red-700">
                {nombreError}
              </div>
            )}
          </div>

          <div className="mt-5">
            <label className="text-sm font-black text-pedido-gray">
              ¿Dónde consumirás tu pedido? <span className="text-red-700">*</span>
            </label>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setTipoPedido("restaurante")}
                className={`rounded-2xl border px-4 py-4 text-left font-black transition ${
                  tipoPedido === "restaurante"
                    ? "border-red-700 bg-red-50 text-red-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-red-300"
                }`}
              >
                Comer en restaurante
                <span className="mt-1 block text-xs font-bold text-gray-500">
                  El pedido se entrega en mesa.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTipoPedido("llevar")}
                className={`rounded-2xl border px-4 py-4 text-left font-black transition ${
                  tipoPedido === "llevar"
                    ? "border-red-700 bg-red-50 text-red-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-red-300"
                }`}
              >
                Para llevar
                <span className="mt-1 block text-xs font-bold text-gray-500">
                  El pedido se recoge en mostrador.
                </span>
              </button>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-black cafe-subtitle">
              ID de operación Yape <span className="text-red-700">*</span>
            </label>

            <input
              type="text"
              value={yapeOperacion}
              onChange={(e) => {
                setYapeOperacion(e.target.value);
                if (yapeError) setYapeError("");
              }}
              placeholder="Ejemplo: 84592136"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-red-700"
            />

            {yapeError && (
              <div className="mt-2 text-xs font-bold text-red-700">
                {yapeError}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 border-t bg-white px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xl font-black text-gray-950">
              Total: S/ {total.toFixed(2)}
            </p>

            <button
              onClick={confirmarPedido}
              disabled={cargando}
              className="cafe-button-cart"
            >
              {cargando ? "Enviando..." : "Confirmar"}
            </button>
          </div>

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