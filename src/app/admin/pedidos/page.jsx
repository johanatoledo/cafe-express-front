"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AdminPedidosTable from "@/components/AdminPedidosTable";
import {
  marcarPedidoEntregado,
  obtenerPedidosAdmin,
  confirmarPagoPedido,
  asignarUbicacionPedido,
} from "@/services/pedidoService";


export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarPedidos = async () => {
    try {
      const data = await obtenerPedidosAdmin();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();

    const intervalo = setInterval(cargarPedidos, 10000);

    return () => clearInterval(intervalo);
  }, []);

  const entregarPedido = async (id) => {
    try {
      await marcarPedidoEntregado(id);

      setPedidos((prev) =>
        prev.filter((pedido) => pedido.id !== id)
      );
    } catch (error) {
      console.error("Error al entregar pedido:", error);
    }
  };

 const confirmarPago = async (id) => {
  try {
    const respuesta = await confirmarPagoPedido(id);

    if (!respuesta?.pago_confirmado_en) {
      console.error(
        "El backend confirmó el pago, pero no devolvió pago_confirmado_en:",
        respuesta
      );

      await cargarPedidos();
      return;
    }

    setPedidos((prev) =>
      prev.map((pedido) =>
        Number(pedido.id) === Number(id)
          ? {
              ...pedido,
              pago_verificado: true,
              pago_confirmado_en:
                respuesta.pago_confirmado_en,
              estado: respuesta.estado ?? "preparando",
            }
          : pedido
      )
    );
  } catch (error) {
    console.error("Error al confirmar pago:", error);
  }
};

  const asignarUbicacion = async (id, ubicacion) => {
    const ubicacionLimpia = ubicacion.trim();

    if (!ubicacionLimpia) {
      alert("Ingresa una ubicación válida.");
      return;
    }

    try {
      await asignarUbicacionPedido(id, ubicacionLimpia);

      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === id
            ? { ...pedido, ubicacion: ubicacionLimpia }
            : pedido
        )
      );
    } catch (error) {
      console.error("Error al asignar ubicación:", error);
    }
  };

  return (
    <main className="min-h-screen bg-cafe-crema">
      <Navbar />

      <section className="mx-auto max-w-10xl px-2 py-10">
        <div className="mb-8 flex flex-col justify-between sm:justify-center gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="min-w-0 text-2xl sm:text-3xl lg:text-4xl font-black  text-pedido-dark">
              Panel de pedidos
            </h1>
          </div>

          <button onClick={cargarPedidos} className="cafe-button-add shrink-0 w-auto! min-w-0! rounded-xl px-3! py-2! text-xs! sm:px-5! sm:py-3! sm:text-sm!">
            Actualizar
          </button>
        </div>

        {cargando ? (
          <p className="text-center font-black">Cargando pedidos...</p>
        ) : (
          <AdminPedidosTable
            pedidos={pedidos}
            onEntregar={entregarPedido}
            onConfirmarPago={confirmarPago}
            onAsignarUbicacion={asignarUbicacion}
          />
        )}
      </section>
    </main>
  );
}