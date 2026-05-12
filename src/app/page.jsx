"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CartBar from "@/components/CartBar";
import CheckoutPanel from "@/components/CheckoutPanel";
import { productos } from "@/data/productos";

export default function HomeMenuPage() {
  const [carrito, setCarrito] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const categorias = [
    "Todos",
    ...new Set(productos.map((p) => p.categoria)),
  ];

  const productosFiltrados =
    categoriaActiva === "Todos"
      ? productos
      : productos.filter(
          (producto) => producto.categoria === categoriaActiva
        );

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const agregarProducto = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);

      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarProducto = (id) => {
    setCarrito((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    setCheckoutAbierto(false);
  };

  const obtenerCantidad = (id) => {
    const item = carrito.find(
      (producto) => producto.id === id
    );

    return item ? item.cantidad : 0;
  };

  return (
    <main className="min-h-screen bg-pedido-orange pb-40">
      <Navbar />

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="text-center">
          <h1 className="mt-5 text-3xl font-black tracking-tight text-pedido-dark sm:text-4xl md:text-5xl">
            Nuestro Menú
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-pedido-dark sm:text-base">
            Elige tus platos favoritos, paga con Yape y
            recoge tu pedido rápidamente.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaActiva(categoria)}
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide transition-all sm:px-5 sm:text-sm ${
                categoriaActiva === categoria
                  ? "bg-pedido-red text-pedido-white shadow-lg"
                  : "bg-white text-pedido-dark ring-1 ring-gray-200 hover:bg-pedido-red2-50"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              cantidad={obtenerCantidad(producto.id)}
              onAgregar={agregarProducto}
              onEliminar={eliminarProducto}
            />
          ))}
        </div>
      </section>

      <CartBar
        carrito={carrito}
        onOpenCheckout={() =>
          setCheckoutAbierto(true)
        }
      />

      {checkoutAbierto && (
        <CheckoutPanel
          carrito={carrito}
          total={total}
          onClose={() =>
            setCheckoutAbierto(false)
          }
          onPedidoCreado={limpiarCarrito}
        />
      )}
    </main>
  );
}