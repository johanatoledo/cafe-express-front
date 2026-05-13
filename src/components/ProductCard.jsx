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
    <article className="group cafe-product-card cafe-fade-in">
  <div className="relative h-60 w-full overflow-hidden">
    <Image
      src={producto.imagen}
      alt={producto.nombre}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,25vw"
    />

    <div className="cafe-product-image-overlay" />
  </div>

  <div className="p-5">
    <span className="cafe-product-category">
      {producto.categoria}
    </span>

    <h3 className="mt-4 cafe-title text-xl">
      {producto.nombre}
    </h3>

    <p className="mt-3 min-h-14 text-sm leading-relaxed text-gray-600">
      {producto.descripcion}
    </p>

    <div className="mt-2 flex items-center justify-between gap-3">
      <p className="cafe-product-price">
        S/ {producto.precio.toFixed(2)}
      </p>

      {estaEnCarrito ? (
        <button
          onClick={() => onEliminar(producto.id)}
          className="cafe-button-remove"
        >
          <Trash2 size={14} />
          Eliminar
        </button>
      ) : (
        <button
          onClick={() => onAgregar(producto)}
          className="cafe-button-add"
        >
          <Plus size={14} />
          Pedir
        </button>
      )}
    </div>

    {cantidad > 0 && (
      <p className="mt-4 text-sm font-black text-green-700">
        Agregado: {cantidad}
      </p>
    )}
  </div>
</article>
  );
}