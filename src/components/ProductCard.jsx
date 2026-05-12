import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";

export default function ProductCard({
  producto,
  cantidad = 0,
  onAgregar,
  onEliminar,
}) {
  const estaEnCarrito = cantidad > 0;

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-5">
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
          {producto.categoria}
        </span>

        <h3 className="mt-3 text-xl font-black text-gray-900">
          {producto.nombre}
        </h3>

        <p className="mt-2 min-h-12 text-sm leading-relaxed text-gray-600">
          {producto.descripcion}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-2xl font-black text-red-700">
            S/ {producto.precio.toFixed(2)}
          </p>

          {estaEnCarrito ? (
            <button
              onClick={() => onEliminar(producto.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
            >
              <Trash2 size={16} />
              Eliminar
            </button>
          ) : (
            <button
              onClick={() => onAgregar(producto)}
              className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
            >
              <Plus size={16} />
              Pedir
            </button>
          )}
        </div>

        {cantidad > 0 && (
          <p className="mt-3 text-sm font-bold text-green-700">
            Agregado: {cantidad}
          </p>
        )}
      </div>
    </article>
  );
}