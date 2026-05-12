"use client";
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



export default function AdminPedidosTable({ pedidos, onEntregar }) {
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
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-4 text-left">Id Pedido</th>
              <th className="p-4 text-left">Cliente</th>
              <th className="p-4 text-left">Pedido</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Yape</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-left">Tiempo</th>
              <th className="p-4 text-left">Acción</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((pedido) => {
              const productos =
                typeof pedido.productos === "string"
                  ? JSON.parse(pedido.productos)
                  : pedido.productos;

              return (
                <tr key={pedido.id} className="border-b border-gray-100">
                  <td className="p-4 uppercase font-black text-gray-900">
                    {pedido.id}
                  </td>
                  <td className="p-4 uppercase font-black text-gray-900">
                    {pedido.cliente_nombre}
                  </td>

                  <td className="p-4 text-sm text-gray-700">
                    {productos
                      .map((item) => `${item.nombre} x${item.cantidad}`)
                      .join(", ")}
                  </td>

                  <td className="p-4 font-black text-red-700">
                    S/{Number(pedido.total).toFixed(2)}
                  </td>

                  <td className="p-4 text-gray-700">
                    {pedido.yape_operacion}
                  </td>

                  <td className="p-4">
                    <EstadoBadge estado={pedido.estado} />
                  </td>

                  <td className="p-4">
                    <TimerPedido
                     creadoEn={pedido.creado_en}
                     estado={pedido.estado}
                     compacto
                    />
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => onEntregar(pedido.id)}
                      className="rounded-xl bg-green-700 px-4 py-2 text-sm font-black text-white hover:bg-green-800"
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