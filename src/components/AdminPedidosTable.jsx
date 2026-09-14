"use client";

import { useState } from "react";
import TimerPedido from "./TimerPedido";

function EstadoBadge({ estado, pagoVerificado }) {
  if (!pagoVerificado) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-100 px-3 py-1 text-xs font-black uppercase text-amber-800">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
        Pendiente
      </span>
    );
  }

  const estaListo = estado?.toLowerCase() === "listo";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-black uppercase ${
        estaListo
          ? "bg-green-100 text-green-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          estaListo ? "bg-green-500" : "bg-blue-500 animate-ping"
        }`}
      ></span>
      {estado || "En Preparación"}
    </span>
  );
}

function PagoBadge({ pagoVerificado }) {
  return (
    <span
      className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-black uppercase ${
        pagoVerificado
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {pagoVerificado ? "Pago Verificado" : "Pago Pendiente"}
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
  const [cargandoId, setCargandoId] = useState(null);

  const handleAccionConfirmar = async (id) => {
    setCargandoId(id);
    try {
      await onConfirmarPago(id);
    } finally {
      setCargandoId(null);
    }
  };

  const handleAccionEntregar = async (id) => {
    setCargandoId(id);
    try {
      await onEntregar(id);
    } finally {
      setCargandoId(null);
    }
  };

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
          Los nuevos pedidos aparecerán aquí automáticamente.
        </p>
      </div>
    );
  }

  return (
  <section className="mx-auto max-w-10xl px-2 py-10 ">
    <div className="w-full overflow-hidden rounded-3xl bg-white shadow-xl">
     <div className="flex w-full flex-wrap gap-3 border-b bg-gray-50 p-5">
        <button
          onClick={() => setFiltroTipo("todos")}
          className={`rounded-xl px-4 py-2 text-sm font-black transition ${
            filtroTipo === "todos"
              ? "bg-cafe-espresso text-white"
              : "border bg-white text-black hover:bg-gray-100"
          }`}
        >
          Todos ({pedidos.length})
        </button>

        <button
          onClick={() => setFiltroTipo("restaurante")}
          className={`rounded-xl px-4 py-2 text-sm font-black transition ${
            filtroTipo === "restaurante"
              ? "bg-amber-700 text-white"
              : "border bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Restaurante ({totalRestaurante})
        </button>

        <button
          onClick={() => setFiltroTipo("llevar")}
          className={`rounded-xl px-4 py-2 text-sm font-black transition ${
            filtroTipo === "llevar"
              ? "bg-cafe-caramelo text-white"
              : "border bg-white text-cafe-chocolate hover:bg-cafe-oscuro"
          }`}
        >
          Para llevar ({totalLlevar})
        </button>
      </div>

      {/* Tabla principal */}
    
      <div className="w-full overflow-hidden rounded-3xl bg-white shadow-xl">
       <div div className="w-full max-w-none overflow-x-auto sm:overflow-x-auto md:overflow-hidden ">
        <table className="w-full table-fixed border-collapse text-left text-xs sm:text-sm">
          <thead className="bg-cafe-caramelo text-xs font-black uppercase text-white tracking-wider">
            <tr>
                <th className="w-[6%] p-2 sm:p-3 md:p-4">ID</th>
                <th className="w-[11%] p-2 sm:p-3 md:p-4">Cliente</th>
                <th className="w-[9%] p-2 sm:p-3 md:p-4">Tipo</th>
                <th className="w-[14%] p-2 sm:p-3 md:p-4">Ubicación</th>
                <th className="w-[20%] text-center p-2 sm:p-3 md:p-4">Pedido</th>
                <th className="w-[8%] p-2 sm:p-3 md:p-4">Total</th>
                <th className="w-[8%] p-2 sm:p-3 md:p-4">N OPER</th>
                <th className="w-[9%] p-2 sm:p-3 md:p-4">Pago</th>
                <th className="w-[7%] p-2 sm:p-3 md:p-4">Estado</th>
                <th className="w-[20%] text-center p-2 sm:p-3 md:p-4">Tiempo</th>
                <th className="w-[15%] text-center p-2 sm:p-3 md:p-4">Accion</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/80">
            {pedidosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan="11"
                  className="p-8 text-center font-bold text-black"
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
              function normalizarBooleano(valor) {
                   return (
                      valor === true ||
                      valor === 1 ||
                      valor === "1"
                   );
            }
             const pagoVerificado = normalizarBooleano(
             pedido.pago_verificado
        );

              const ubicacionActual =
                ubicaciones[pedido.id] ?? pedido.ubicacion ?? "";

              const estaProcesando = cargandoId === pedido.id;

              return (
                <tr
                  key={pedido.id}
                  className="hover:bg-amber-50/40 transition-colors"
                >
                  {/* Nro Pedido */}
                  <td className="p-2 sm:p-3 md:p-4 align-top wrap-break-word   font-black text-gray-900">
                    #{pedido.id}
                  </td>

                  {/* Cliente */}
                  <td className="p-2 sm:p-3 md:p-4 align-top wrap-break-word  font-black uppercase text-gray-900 min-w-[130px]">
                    {pedido.cliente_nombre}
                  </td>

                  {/* Tipo de Pedido */}
                  <td className="p-2 sm:p-3 md:p-4 align-top wrap-break-word ">
                    <span
                      className={`inline-block rounded-xl px-4 py-1 text-xs font-black uppercase ${
                        esRestaurante
                          ? " text-amber-700"
                          : " text-shadow-red-800"
                      }`}
                    >
                      {esRestaurante ? "Restaurante" : "Para Llevar"}
                    </span>
                  </td>

                  {/* Ubicación / Mesa */}
              <td className="p-2 sm:p-3 md:p-4 align-top wrap-break-word ">
                {esRestaurante ? (
                   pedido.ubicacion ? (
                    <div className="flex flex-col gap-2">
                      <span className="inline-flex items-center rounded-xl  px-3 py-2 text-xs font-black uppercase text-cafe-oscuro">
                         {pedido.ubicacion}
                      </span>
                    </div>
                  ) : (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={ubicacionActual}
                      onChange={(e) =>
                      setUbicaciones((prev) => ({
                      ...prev,
                      [pedido.id]: e.target.value,
                     }))
                    }
                    placeholder="Ej: Mesa 4, Terraza"
                    className="w-full rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-bold outline-none focus:border-amber-700"
                  />

                <button
                 onClick={() =>
                 onAsignarUbicacion(pedido.id, ubicacionActual)
                 }
                disabled={!ubicacionActual.trim()}
                className={`rounded-xl px-3 py-1.5 text-xs font-black text-white transition ${
                  ubicacionActual.trim()
                  ? "bg-cafe-caramelo hover:bg-cafe-espresso"
                  : "cursor-not-allowed bg-gray-300"
                }`}
             >
                Guardar Ubicación
                </button>
               </div>
                )
              ) : (
              <span className="text-xs font-bold uppercase text-black">
               Recojo en Mostrador
              </span>
             )}
            </td>
            

                  {/* Detalle del Pedido */}
                  <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm whitespace-normal">
                    {productos.length > 0 ? (
                      <ul className="space-y-1.5 text-xs">
                        {productos.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-1.5 text-black font-medium"
                          >
                            <span className="font-black text-black  px-1.5 py-0.5 ">
                              {item.cantidad}
                            </span>
                            <span className="leading-tight">{item.nombre}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-cafe-chocolate">Sin productos</span>
                    )}
                  </td>

                  {/* Total */}
                  <td className=" p-2 sm:p-3 md:p-4 align-top wrap-break-word  font-black text-red-600 whitespace-nowrap">
                    S/ {Number(pedido.total || 0).toFixed(2)}
                  </td>

                  {/* Yape */}
                  <td className="p-2 sm:p-3 md:p-4 align-top wrap-break-word font-mono font-bold text-gray-800">
                    {pedido.yape_operacion || "—"}
                  </td>

                  {/* Estado del Pago */}
                  <td className="p-2 sm:p-3 md:p-4 align-top wrap-break-word text-center">
                    <PagoBadge pagoVerificado={pagoVerificado} />
                  </td>

                  {/* Estado del Pedido */}
                  <td className="p-2 sm:p-3 md:p-6 align-top  text-center wrap-break-word">
                    <EstadoBadge
                      estado={pedido.estado}
                      pagoVerificado={pagoVerificado}
                    />
                  </td>

                  {/* Tiempo / Cronómetro */}
                  <td className="p-2 sm:p-3 md:p-6 align-top text-center whitespace-nowrap">
                    <TimerPedido
                      pagoConfirmadoEn={pedido.pago_confirmado_en}
                      pagoVerificado={pagoVerificado}
                      estado={pedido.estado}
                      compacto
                    />
                  </td>

                  {/* Acciones */}
                  <td className="p-2 sm:p-3 md:p-6 align-top wrap-break-word text-center">
                    {pagoVerificado ? (
                      <button
                        disabled={estaProcesando}
                        onClick={() => handleAccionEntregar(pedido.id)}
                        className="w-full min-w-32.5 rounded-xl bg-green-700 px-3 py-2 text-xs font-black text-white hover:bg-green-800 transition shadow-sm disabled:opacity-50"
                      >
                        {estaProcesando ? "Procesando..." : "Marcar Entregado"}
                      </button>
                    ) : (
                      <button
                        disabled={estaProcesando}
                        onClick={() => handleAccionConfirmar(pedido.id)}
                        className="w-full min-w-32.5 rounded-xl bg-purple-700 px-3 py-2 text-xs font-black text-white hover:bg-purple-800 transition shadow-md animate-pulse disabled:opacity-50"
                      >
                        {estaProcesando ? "Confirmando..." : "Confirmar Pago"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>   
     </div>
    </section>
  );
}