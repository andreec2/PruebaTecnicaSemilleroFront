import { useEffect, useState } from "react";

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
    <div>
      <h2>🛒 Carrito de compras</h2>
      <ul>
        {carrito.items.map((item, idx) => (
          <li key={idx}>
            {item.nombre} - {item.cantidad} unidad(es) - ${item.precioUnitario.toFixed(2)} c/u
            <button
              onClick={() => eliminarProducto(item.productId)}
              style={{
                marginLeft: "10px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              🗑 Eliminar
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={vaciarCarrito}
        style={{
          marginTop: "20px",
          backgroundColor: "#dc3545",
          color: "#fff",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        🧹 Vaciar carrito
      </button>

      <button
            onClick={pagar}
            style={{
              marginTop: "10px",
              backgroundColor: "#28a745",
              color: "#fff",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "10px"
            }}
          >
            💳 Pagar ahora
    </button>

    </div>
  );
};

export default CartPage;
