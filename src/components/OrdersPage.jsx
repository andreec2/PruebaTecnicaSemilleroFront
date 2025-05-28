import { useEffect, useState } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (!token || !email) throw new Error("No autenticado");

      const res = await fetch(`http://localhost:8080/api/orders/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error al cargar pedidos: ${text}`);
      }

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (orders.length === 0) return <p>No tienes pedidos realizados aún.</p>;

  return (
    <div>
      <h2>📦 Historial de pedidos</h2>
      <ul>
        {orders.map((order, idx) => (
          <li key={idx}>
            <strong>Pedido #{order.id}</strong> - {order.items.length} producto(s) - Total: $
            {order.total?.toFixed(2) ?? "?"}
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.nombre} x {item.cantidad} = ${item.precioUnitario.toFixed(2)} c/u
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;
