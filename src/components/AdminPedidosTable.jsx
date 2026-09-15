"use client";

import { useState } from "react";
import TimerPedido from "./TimerPedido";

function normalizarBooleano(valor) {
  return valor === true || valor === 1 || valor === "1";
}

function obtenerProductos(productos) {
  try {
    return typeof productos === "string" ? JSON.parse(productos) : productos || [];
  } catch {
    return [];
  }
}

function EstadoBadge({ estado, pagoVerificado }) {
  if (!pagoVerificado) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase leading-none text-amber-800">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        Pendiente
      </span>
    );
  }

  const estaListo = estado?.toLowerCase() === "listo";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase leading-none ${
        estaListo ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          estaListo ? "bg-green-500" : "bg-blue-500 animate-ping"
        }`}
      />
      {estado || "En preparación"}
    </span>
  );
}

function PagoBadge({ pagoVerificado }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase leading-none ${
        pagoVerificado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {pagoVerificado ? "Pago verificado" : "Pago pendiente"}
    </span>
  );
}

function PedidoDetalle({ productos }) {
  if (!productos.length) {
    return <span className="text-xs text-cafe-chocolate">Sin productos</span>;
  }

  return (
    <ul className="space-y-1.5">
      {productos.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2 text-xs font-medium text-black">
          <span className="shrink-0 font-black text-black">{item.cantidad}</span>
          <span className="min-w-0 leading-tight">{item.nombre}</span>
        </li>
      ))}
    </ul>
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
      <div className="rounded-3xl bg-white p-8 text-center shadow-xl sm:p-10">
        <p className="text-lg font-black text-gray-800 sm:text-xl">
          No hay pedidos activos
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Los nuevos pedidos aparecerán aquí automáticamente.
        </p>
      </div>
    );
  }

  const renderAccion = (pedido, pagoVerificado) => {
    const estaProcesando = cargandoId === pedido.id;

    return pagoVerificado ? (
      <button
        disabled={estaProcesando}
        onClick={() => handleAccionEntregar(pedido.id)}
        className="w-full rounded-xl bg-green-700 px-3 py-2 text-xs font-black leading-tight text-white shadow-sm transition hover:bg-green-800 disabled:opacity-50"
      >
        {estaProcesando ? "Procesando..." : "Marcar Entregado"}
      </button>
    ) : (
      <button
        disabled={estaProcesando}
        onClick={() => handleAccionConfirmar(pedido.id)}
        className="w-full rounded-xl bg-purple-700 px-3 py-2 text-xs font-black leading-tight text-white shadow-md transition hover:bg-purple-800 disabled:opacity-50"
      >
        {estaProcesando ? "Confirmando..." : "Confirmar Pago"}
      </button>
    );
  };

  const renderUbicacion = (pedido, esRestaurante) => {
    const ubicacionActual = ubicaciones[pedido.id] ?? pedido.ubicacion ?? "";

    if (!esRestaurante) {
      return (
        <span className="text-xs font-black uppercase text-black">
          Recojo en mostrador
        </span>
      );
    }

    if (pedido.ubicacion) {
      return (
        <span className="inline-flex rounded-xl px-2 py-1 text-xs font-black uppercase text-cafe-oscuro">
          {pedido.ubicacion}
        </span>
      );
    }

    return (
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
          placeholder="Ej: Mesa 4"
          className="w-full rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-bold outline-none focus:border-amber-700"
        />

        <button
          onClick={() => onAsignarUbicacion(pedido.id, ubicacionActual)}
          disabled={!ubicacionActual.trim()}
          className={`rounded-xl px-3 py-1.5 text-xs font-black text-white transition ${
            ubicacionActual.trim()
              ? "bg-cafe-caramelo hover:bg-cafe-espresso"
              : "cursor-not-allowed bg-gray-300"
          }`}
        >
          Guardar ubicación
        </button>
      </div>
    );
  };

  return (
    <section className="mx-auto w-full max-w-[1600px] px-3 py-6 sm:px-5 lg:px-6 xl:px-8">
      <div className="w-full overflow-hidden rounded-3xl bg-white shadow-xl">
        {/* Filtros */}
        <div className="flex w-full flex-wrap gap-2 border-b bg-gray-50 p-4 sm:gap-3 sm:p-5">
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
                : "border  bg-white text-cafe-chocolate hover:bg-cafe-espresso hover:text-white"
            }`}
          >
            Restaurante ({totalRestaurante})
          </button>

          <button
            onClick={() => setFiltroTipo("llevar")}
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${
              filtroTipo === "llevar"
                ? "bg-amber-700 text-white"
                : "border bg-white text-cafe-chocolate hover:bg-cafe-espresso hover:text-white"
            }`}
          >
            Para llevar ({totalLlevar})
          </button>
        </div>

        {pedidosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-sm font-black text-black">
            No existen pedidos para este filtro.
          </div>
        ) : (
          <>
            {/* Vista móvil y tablet */}
            <div className="grid gap-4 p-4 xl:hidden">
              {pedidosFiltrados.map((pedido) => {
                const productos = obtenerProductos(pedido.productos);
                const esRestaurante = pedido.tipo_pedido === "restaurante";
                const pagoVerificado = normalizarBooleano(pedido.pago_verificado);

                return (
                  <article
                    key={pedido.id}
                    className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase text-gray-500">
                          Pedido #{pedido.id}
                        </p>
                        <h3 className="mt-1 text-base font-black uppercase leading-tight text-gray-900">
                          {pedido.cliente_nombre}
                        </h3>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                          esRestaurante ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {esRestaurante ? "Restaurante" : "Para llevar"}
                      </span>
                    </div>

                    <div className="grid gap-3 text-sm">
                      <div>
                        <p className="text-[11px] font-black uppercase text-gray-400">
                          Ubicación
                        </p>
                        <div className="mt-1">{renderUbicacion(pedido, esRestaurante)}</div>
                      </div>

                      <div>
                        <p className="text-[11px] font-black uppercase text-gray-400">
                          Pedido
                        </p>
                        <div className="mt-1">
                          <PedidoDetalle productos={productos} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[11px] font-black uppercase text-gray-400">
                            Total
                          </p>
                          <p className="mt-1 text-sm font-black text-red-600">
                            S/ {Number(pedido.total || 0).toFixed(2)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] font-black uppercase text-gray-400">
                            N° Operación
                          </p>
                          <p className="mt-1 break-words text-xs font-bold text-gray-800">
                            {pedido.yape_operacion || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[11px] font-black uppercase text-gray-400">
                            Pago
                          </p>
                          <div className="mt-1">
                            <PagoBadge pagoVerificado={pagoVerificado} />
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-black uppercase text-gray-400">
                            Estado
                          </p>
                          <div className="mt-1">
                            <EstadoBadge
                              estado={pedido.estado}
                              pagoVerificado={pagoVerificado}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] font-black uppercase text-gray-400">
                          Tiempo
                        </p>
                        <div className="mt-1">
                          <TimerPedido
                            pagoConfirmadoEn={pedido.pago_confirmado_en}
                            pagoVerificado={pagoVerificado}
                            estado={pedido.estado}
                            compacto
                          />
                        </div>
                      </div>

                      <div className="pt-2">{renderAccion(pedido, pagoVerificado)}</div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Vista escritorio */}
            <div className="hidden w-full xl:block">
              <table className="w-full table-auto border-collapse text-left text-[11px] 2xl:text-xs">
                <colgroup>
                  <col className="w-[4%]" />
                  <col className="w-[10%]" />
                  <col className="w-[8%]" />
                  <col className="w-[11%]" />
                  <col className="w-[18%]" />
                  <col className="w-[7%]" />
                  <col className="w-[8%]" />
                  <col className="w-[9%]" />
                  <col className="w-[8%]" />
                  <col className="w-[7%]" />
                  <col className="w-[10%]" />
                </colgroup>

                <thead className="bg-cafe-caramelo font-black uppercase tracking-wider text-white">
                  <tr>
                    <th className="px-3 py-4">ID</th>
                    <th className="px-3 py-4">Cliente</th>
                    <th className="px-3 py-4">Tipo</th>
                    <th className="px-3 py-4">Ubicación</th>
                    <th className="px-3 py-4">Pedido</th>
                    <th className="px-3 py-4">Total</th>
                    <th className="px-3 py-4">N Oper</th>
                    <th className="px-3 py-4 text-center">Pago</th>
                    <th className="px-3 py-4 text-center">Estado</th>
                    <th className="px-3 py-4 text-center">Tiempo</th>
                    <th className="px-3 py-4 text-center">Acción</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/30">
                  {pedidosFiltrados.map((pedido) => {
                    const productos = obtenerProductos(pedido.productos);
                    const esRestaurante = pedido.tipo_pedido === "restaurante";
                    const pagoVerificado = normalizarBooleano(pedido.pago_verificado);

                    return (
                      <tr
                        key={pedido.id}
                        className="align-top transition-colors hover:bg-amber-50/40"
                      >
                        <td className="px-3 py-4 font-black text-gray-900">
                          #{pedido.id}
                        </td>

                        <td className="px-3 py-4 font-black uppercase leading-tight text-gray-900">
                          {pedido.cliente_nombre}
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`text-[10px] font-black uppercase leading-tight ${
                              esRestaurante ? "text-amber-700" : "text-red-800"
                            }`}
                          >
                            {esRestaurante ? "Restaurante" : "Para llevar"}
                          </span>
                        </td>

                        <td className="px-3 py-4">
                          {renderUbicacion(pedido, esRestaurante)}
                        </td>

                        <td className="px-3 py-4">
                          <PedidoDetalle productos={productos} />
                        </td>

                        <td className="px-3 py-4 font-black whitespace-nowrap text-red-600">
                          S/ {Number(pedido.total || 0).toFixed(2)}
                        </td>

                        <td className="px-3 py-4 break-words font-mono font-bold text-gray-800">
                          {pedido.yape_operacion || "—"}
                        </td>

                        <td className="px-3 py-4 text-center">
                          <PagoBadge pagoVerificado={pagoVerificado} />
                        </td>

                        <td className="px-3 py-4 text-center">
                          <EstadoBadge
                            estado={pedido.estado}
                            pagoVerificado={pagoVerificado}
                          />
                        </td>

                        <td className="px-3 py-4 text-center">
                          <TimerPedido
                            pagoConfirmadoEn={pedido.pago_confirmado_en}
                            pagoVerificado={pagoVerificado}
                            estado={pedido.estado}
                            compacto
                          />
                        </td>

                        <td className="px-3 py-4 text-center">
                          {renderAccion(pedido, pagoVerificado)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}