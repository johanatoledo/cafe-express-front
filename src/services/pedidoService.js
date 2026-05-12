const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";   

export async function crearPedido(data) {
  const response = await fetch(`${API_URL}/api/pedidos`, {
    method: "POST",
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      'Bypass-Tunnel-Reminder': 'true'
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear el pedido");
  }

  return response.json();
}

export async function obtenerPedido(id) {
  const url = `${API_URL}/api/pedidos/${id}`;
  console.log("Intentando fetch a:", url); // Verifica si la URL es correcta

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error del servidor detallado:", {
        status: response.status,
        statusText: response.statusText,
        mensajeServidor: errorData.message,
         data: response,
      url: `${API_URL}/api/pedidos`,
      });
      throw new Error(errorData.message || "No se pudo obtener el pedido");
    }

    return response.json();
  } catch (err) {
    console.error("Error de red o de código:", err);
    throw err;
  }
}

export async function obtenerPedidosAdmin() {
  const response = await fetch(`${API_URL}/api/pedidos`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudieron obtener los pedidos");
  }

  return response.json();
}

export async function marcarPedidoEntregado(id) {
  const response = await fetch(`${API_URL}/api/pedidos/${id}/entregar`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("No se pudo marcar como entregado");
  }

  return response.json();
}