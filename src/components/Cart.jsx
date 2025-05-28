import { useEffect, useState } from "react";
import "../Styles/cart.css";


const CartPage = () => {
  const [carrito, setCarrito] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCarrito = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (!token || !email) throw new Error("No autenticado");

      const res = await fetch(`http://localhost:8080/api/cart/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error al cargar el carrito: ${text}`);
      }

      const data = await res.json();
      setCarrito(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const vaciarCarrito = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (!token || !email) throw new Error("No autenticado");

      const res = await fetch(`http://localhost:8080/api/cart/${email}/clear`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al vaciar el carrito");

      await fetchCarrito();
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarProducto = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (!token || !email) throw new Error("No autenticado");

      const res = await fetch(`http://localhost:8080/api/cart/${email}/remove/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error al eliminar producto: ${text}`);
      }

      await fetchCarrito();
    } catch (err) {
      setError(err.message);
    }
  };

  const pagar = async () => {
  try {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) throw new Error("No autenticado");

    const res = await fetch(`http://localhost:8080/api/cart/${email}/checkout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();

    if (!res.ok) throw new Error(text);

    alert("✅ " + text);
    await fetchCarrito();
  } catch (err) {
    alert("❌ " + err.message);
  }
};


  useEffect(() => {
    fetchCarrito();
  }, []);

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!carrito || !carrito.items || carrito.items.length === 0)
    return <p>El carrito está vacío.</p>;

  return (
    <div className="cart-container">
  <h2>🛒 Carrito de compras</h2>

  <ul className="cart-list">
    {carrito.items.map((item, idx) => (
      <li className="cart-item" key={idx}>
        <span>
          {item.nombre} - {item.cantidad} unidad(es) - ${item.precioUnitario.toFixed(2)} c/u
        </span>
        <button onClick={() => eliminarProducto(item.productId)}>🗑 Eliminar</button>
      </li>
    ))}
  </ul>

  <div className="cart-actions">
    <button className="clear-btn" onClick={vaciarCarrito}>🧹 Vaciar carrito</button>
    <button className="pay-btn" onClick={pagar}>💳 Pagar ahora</button>
  </div>
</div>
  );
};

export default CartPage;
