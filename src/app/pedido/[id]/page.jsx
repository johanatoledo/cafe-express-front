"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import TimerPedido from "@/components/TimerPedido";
import { obtenerPedido } from "@/services/pedidoService";
import { CheckSquare,PackageCheck } from "lucide-react";

 // ===== Funcion Detalle de pago del pedido =====
  
export default function PedidoDetallePage() {
  const params = useParams();
  const id = params?.id; 

  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 1. Evitamos ejecutar la lógica si aún no tenemos el ID
    if (!id) return;

    const cargarPedido = async () => {
      try {
        const data = await obtenerPedido(id);
        setPedido(data);
      } catch (error) {
        console.error("Error al cargar el pedido:", error);
      } finally {
        setCargando(false);
      }
    };

    // Ejecución inmediata
    cargarPedido();

    // 2. Configuramos el intervalo para el seguimiento en tiempo real
    const intervalo = setInterval(() => {
      cargarPedido();
    }, 10000); // 10 segundos es ideal para no saturar el servidor

    // 3. Limpieza: Importante para evitar fugas de memoria
    return () => clearInterval(intervalo);
  }, [id]); // El efecto se reinicia si el ID cambia

 

  if (cargando) {
    return (
      <main className="min-h-screen bg-orange-50">
        <Navbar />
        <p className="p-10 text-center font-black">Cargando pedido...</p>
      </main>
    );
  }

  if (!pedido) {
    return (
      <main className="min-h-screen bg-orange-50">
        <Navbar />
        <p className="p-10 text-center font-black">Pedido no encontrado.</p>
      </main>
    );
  }

  const productos =
    typeof pedido.productos === "string"
      ? JSON.parse(pedido.productos)
      : pedido.productos;

  if (pedido.estado?.toLowerCase() === "entregado") {
    return (
      <main className="min-h-screen bg-orange-50">
        <Navbar />
       <section className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-3xl bg-pedido-green p-8 shadow-xl">
            <div className="flex w-full flex-grow items-center justify-center px-5 py-4 text-white">
              <div className="flex flex-col items-center rounded-2xl  p-8 text-pedido-white ">
               <PackageCheck size={200} />
                <p className="text-xs text-center font-black uppercase tracking-widest text-slate-300">
              Pedido entregado
            </p>

            <h1 className="mt-1 text-lg  text-center font-black">
              Gracias por tu compra!
            </h1>
          </div>
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
        <div className="rounded-3xl bg-white p-8 shadow-xl">
             {/* contenedor de check de pedido generado correctamente */}
          <div className="flex w-full flex-grow items-center justify-center px-5 py-4">
             <div className="flex flex-col items-center rounded-2xl bg-white/10 p-8 text-green-700 shadow-inner">
              <CheckSquare 
                size={80} 
                className="mb-4 opacity-90" // Espacio debajo del icono
              />
             <h1 className="text-center font-black uppercase text-green-700">
              Pedido generado correctamente
            </h1>
          </div>
        </div>
             {/* contenedor de con los datos del cliente y estado del pedido */}
            <div className="mt-4 rounded-2xl border border-gray-100 p-5">
              <ul>
                 <li className=" font-black uppercase text-gray-900">Estado actual: {pedido.estado}</li>
                  <li className=" text-gray-900">  Cliente: {pedido.cliente_nombre}</li>
                  <li className="mt-2 text-gray-600">Id Pedido #{pedido.id} </li>
              </ul>
            </div>
             {/* contenedor de detalle del pedido */}
             <div className="mt-6">
                 <p className="font-black text-gray-900">Detalle del pedido</p>

                  <ul className="mt-2 space-y-2">
                    {productos.map((item) => (
                      <li
                       key={item.id}
                       className="rounded-xl  px-3 py-2 text-sm font-bold text-gray-700"
                      >
                     <p>  {item.nombre} x {item.cantidad}</p>
                     <p>  S/ {item.precio}  </p>  
                    </li>
                   ))}
                  </ul>
                     <p className="mt-2 font-black text-red-700">
                       Total: S/ {Number(pedido.total).toFixed(2)}
                     </p>
              </div>
              {/*contenedor con el estado del pedido */}
              
          <div className="mt-8">
            <TimerPedido creadoEn={pedido.creado_en} estado={pedido.estado} />
          </div>
        </div>
      </section>
    </main>
  );
}