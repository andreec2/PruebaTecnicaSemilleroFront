import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/cart.css";

const CartPage = () => {
  const [carrito, setCarrito] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [mostrarFormularioPago, setMostrarFormularioPago] = useState(false);
  const [formularioPago, setFormularioPago] = useState({
  direccion: "",
  ciudad: "",
  telefono: "",
  tarjeta: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormularioPago({ ...formularioPago, [name]: value });
  };

  const handleSubmitPago = async () => {
    const { direccion, ciudad, telefono, tarjeta } = formularioPago;

  if (!direccion || !ciudad || !telefono || !tarjeta) {
    alert("Por favor completa todos los campos.");
    return;
  }

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
    navigate("/home");
  } catch (err) {
    alert("❌ " + err.message);
  }
  };

  useEffect(() => {
    fetchCarrito();
  }, []);

  useEffect(() => {
    if (carrito && Array.isArray(carrito.items) && carrito.items.length === 0) {
      alert("🛒 Tu carrito está vacío. Serás redirigido al inicio.");
      navigate("/home");
    }
  }, [carrito, navigate]);

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!carrito || !Array.isArray(carrito.items)) return null;

  return (
    <div className="cart-container">
      <button className="home-btn" onClick={() => navigate("/home")}> Volver al inicio</button>
      <h2>🛒 Carrito de compras</h2>

      <div className="cart-content">
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
      </div>

      <div className="cart-actions">
        <button className="clear-btn" onClick={vaciarCarrito}>🧹 Vaciar carrito</button>
        <button className="pay-btn" onClick={() => setMostrarFormularioPago(true)}>💳 Pagar ahora</button>
      </div>

      {mostrarFormularioPago && (
      <div className="payment-overlay">
        <div className="payment-form">
          <h3>Pasarela de Pago</h3>
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formularioPago.direccion}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={formularioPago.ciudad}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formularioPago.telefono}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="tarjeta"
            placeholder="Número de Tarjeta"
            value={formularioPago.tarjeta}
            onChange={handleInputChange}
          />
          <div className="payment-buttons">
            <button onClick={handleSubmitPago}>💳 Confirmar Pago</button>
            <button onClick={() => setMostrarFormularioPago(false)}>❌ Cancelar</button>
          </div>
        </div>
      </div>
    )}
    </div>

    
  );
};

export default CartPage;
