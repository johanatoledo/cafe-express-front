const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002";   

const headersJson = {
  "Content-Type": "application/json",
  "Bypass-Tunnel-Reminder": "true",
};

async function manejarRespuesta(response, mensajeError) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || mensajeError);
  }

  return response.json();
}

export async function crearPedido(data) {
  const response = await fetch(`${API_URL}/api/pedidos`, {
    method: "POST",
    mode: 'cors',
    headers: headersJson,
    body: JSON.stringify(data),
  });

  return manejarRespuesta(response, "No se pudo crear el pedido");
}

export async function obtenerPedido(id) {
  const response = await fetch(
    `${API_URL}/api/pedidos/${id}`,
    {
      cache: "no-store",
    }
  );

  return manejarRespuesta(
    response,
    "No se pudo obtener el pedido"
  );
}

export async function obtenerPedidosAdmin() {
  const response = await fetch(`${API_URL}/api/pedidos`, {
    cache: "no-store",
  });

  
  return manejarRespuesta(response, "No se pudieron obtener los pedidos");
}

export async function marcarPedidoEntregado(id) {
  const response = await fetch(`${API_URL}/api/pedidos/${id}/entregar`, {
    method: "PATCH",
  });

  
  return manejarRespuesta(response, "No se pudo marcar como entregado");
}

export async function confirmarPagoPedido(id) {
  try{
  const response = await fetch(`${API_URL}/api/pedidos/${id}/pago`, {
    method: "PATCH",
    mode: "cors",
    headers: headersJson,
    });
 const data = await manejarRespuesta(response, "No se pudo confirmar el pago");

    return data;
  } catch (error) {
    console.error("Error al confirmar pago:", error);
    throw error;
  }
}
export async function asignarUbicacionPedido(id, ubicacion) {
  const response = await fetch(`${API_URL}/api/pedidos/${id}/ubicacion`, {
    method: "PATCH",
    mode: "cors",
    headers: headersJson,
    body: JSON.stringify({ ubicacion }),
  });

  return manejarRespuesta(response, "No se pudo asignar la ubicación");
}

