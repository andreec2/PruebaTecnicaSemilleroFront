import { useEffect, useState } from "react";
import "../Styles/orders.css";


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
  <div className="orders-container">
    <h2>📦 Historial de pedidos</h2>
    <ul className="orders-list">
      {orders.map((order, idx) => (
        <li className="order-item" key={idx}>
          <div className="order-header">
            Pedido #{order.id} - {order.items.length} producto(s)
          </div>
          <ul className="order-sublist">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.nombre} x {item.cantidad} = ${item.precioUnitario.toFixed(2)} c/u
              </li>
            ))}
          </ul>
          <div className="order-total">Total: ${order.total?.toFixed(2) ?? "?"}</div>
        </li>
      ))}
    </ul>
  </div>
);
};

export default OrdersPage;
