"use client";

import { useState } from "react";
import TimerPedido from "./TimerPedido";

function EstadoBadge({ estado }) {
  const estaListo = estado === "listo";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-1 text-xs font-black uppercase ${
        estaListo
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {estado}
    </span>
  );
}

function PagoBadge({ pagoVerificado }) {
  return (
    <span
      className={`inline-flex rounded-xl px-3 py-1 text-xs font-black uppercase ${
        pagoVerificado
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {pagoVerificado ? "Pago verificado" : "Pago pendiente"}
    </span>
  );
}

export default function AdminPedidosTable({
  pedidos = [],
  onEntregar,
  onConfirmarPago,
  onAsignarUbicacion,
}) {
  const [ubicaciones, setUbicaciones] = useState({});
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (filtroTipo === "todos") return true;
    return pedido.tipo_pedido === filtroTipo;
  });

  const totalRestaurante = pedidos.filter(
    (pedido) => pedido.tipo_pedido === "restaurante"
  ).length;

  const totalLlevar = pedidos.filter(
    (pedido) => pedido.tipo_pedido === "llevar"
  ).length;

  if (!pedidos.length) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
        <p className="text-xl font-black text-gray-800">
          No hay pedidos activos
        </p>
        <p className="mt-2 text-gray-500">
          Los nuevos pedidos aparecerán aquí automáticamente al recargar.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
      <div className="flex flex-wrap gap-3 border-b bg-gray-50 p-4">
        <button
          onClick={() => setFiltroTipo("todos")}
          className={`rounded-xl px-4 py-2 font-black transition ${
            filtroTipo === "todos"
              ? "bg-cafe-caramelo text-white"
              : "border bg-white text-gray-700"
          }`}
        >
          Todos ({pedidos.length})
        </button>

        <button
          onClick={() => setFiltroTipo("restaurante")}
          className={`rounded-xl px-4 py-2 font-black transition ${
            filtroTipo === "restaurante"
              ? "bg-green-700 text-white"
              : "border bg-white text-gray-700"
          }`}
        >
          Restaurante ({totalRestaurante})
        </button>

        <button
          onClick={() => setFiltroTipo("llevar")}
          className={`rounded-xl px-4 py-2 font-black transition ${
            filtroTipo === "llevar"
              ? "bg-purple-700 text-white"
              : "border bg-white text-gray-700"
          }`}
        >
          Para llevar ({totalLlevar})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse">
          <thead className="bg-cafe-caramelo text-white">
            <tr>
              <th className="p-4 text-left">Id</th>
              <th className="p-4 text-left">Cliente</th>
              <th className="p-4 text-left">Tipo</th>
              <th className="p-4 text-left">Ubicación</th>
              <th className="p-4 text-left">Pedido</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Yape</th>
              <th className="p-4 text-left">Pago</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-left">Tiempo</th>
              <th className="p-4 text-left">Acción</th>
            </tr>
          </thead>

          <tbody>
            {pedidosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan="11"
                  className="p-8 text-center font-bold text-gray-500"
                >
                  No existen pedidos para este filtro.
                </td>
              </tr>
            )}

            {pedidosFiltrados.map((pedido) => {
              let productos = [];

              try {
                productos =
                  typeof pedido.productos === "string"
                    ? JSON.parse(pedido.productos)
                    : pedido.productos || [];
              } catch {
                productos = [];
              }

              const esRestaurante = pedido.tipo_pedido === "restaurante";
              const pagoVerificado = Boolean(pedido.pago_verificado);
              const ubicacionActual =
                ubicaciones[pedido.id] ?? pedido.ubicacion ?? "";

              return (
                <tr key={pedido.id} className="border-b border-gray-100">
                  <td className="p-4 font-black text-gray-900">
                    #{pedido.id}
                  </td>

                  <td className="p-4 font-black uppercase text-gray-900">
                    {pedido.cliente_nombre}
                  </td>

                  <td className="p-4">
                    <span className="rounded-xl bg-gray-100 px-3 py-1 text-xs font-black uppercase text-gray-700">
                      {esRestaurante ? "Restaurante" : "Para llevar"}
                    </span>
                  </td>

                  <td className="p-4">
                    {esRestaurante ? (
                      <div className="flex min-w-[190px] flex-col gap-2">
                        <input
                          type="text"
                          value={ubicacionActual}
                          onChange={(e) =>
                            setUbicaciones((prev) => ({
                              ...prev,
                              [pedido.id]: e.target.value,
                            }))
                          }
                          placeholder="Ej: Mesa 4, terraza"
                          className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold outline-none focus:border-red-700"
                        />

                        <button
                          onClick={() =>
                            onAsignarUbicacion(pedido.id, ubicacionActual)
                          }
                          className="rounded-xl bg-gray-900 px-3 py-2 text-xs font-black text-white hover:bg-black"
                        >
                          Guardar ubicación
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-500">
                        Recojo en mostrador
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-sm text-gray-700">
                    {productos.length
                      ? productos
                          .map((item) => `${item.nombre} x${item.cantidad}`)
                          .join(", ")
                      : "Sin productos"}
                  </td>

                  <td className="p-4 font-black text-red-700">
                    S/ {Number(pedido.total).toFixed(2)}
                  </td>

                  <td className="p-4 font-bold text-gray-700">
                    {pedido.yape_operacion}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <PagoBadge pagoVerificado={pagoVerificado} />

                      {!pagoVerificado && (
                        <button
                          onClick={() => onConfirmarPago(pedido.id)}
                          className="rounded-xl bg-purple-700 px-3 py-2 text-xs font-black text-white hover:bg-purple-800"
                        >
                          Confirmar pago
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <EstadoBadge estado={pedido.estado} />
                  </td>

                  <td className="p-4">
                    <TimerPedido
                      pagoConfirmadoEn={pedido.pago_confirmado_en}
                      pagoVerificado={pagoVerificado}
                      estado={pedido.estado}
                      compacto
                    />
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => onEntregar(pedido.id)}
                      disabled={!pagoVerificado}
                      className={`rounded-xl px-4 py-2 text-sm font-black text-white ${
                        pagoVerificado
                          ? "bg-green-700 hover:bg-green-800"
                          : "cursor-not-allowed bg-gray-300"
                      }`}
                    >
                      Marcar entregado
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}