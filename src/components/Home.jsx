import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cantidades, setCantidades] = useState({});
  const navigate = useNavigate();

  const cargarProductos = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch("http://localhost:8080/api/products", {
        method: "GET",
        headers,
        mode: "cors",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text || response.statusText}`);
      }

      const data = await response.json();
      setProductos(data);

      // Inicializar cantidades en 1 para cada producto
      const cantidadesIniciales = {};
      data.forEach((prod) => {
        cantidadesIniciales[prod.id] = 1;
      });
      setCantidades(cantidadesIniciales);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const cambiarCantidad = (id, delta) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const agregarAlCarrito = async (producto) => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (!token || !email) throw new Error("Usuario no autenticado");

      const response = await fetch(`http://localhost:8080/api/cart/${email}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: producto.id,
          cantidad: cantidades[producto.id] || 1,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error al agregar al carrito: ${text}`);
      }

      alert("Producto agregado al carrito");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Bienvenido a la tienda</h2>

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && productos.length === 0 && <p>No hay productos.</p>}

      <ul>
        {productos.map((producto) => (
          <li key={producto.id} style={{ marginBottom: "15px" }}>
            <strong>{producto.nombre}</strong> - ${producto.precio.toFixed(2)}
            <div>
              <button onClick={() => cambiarCantidad(producto.id, -1)}>-</button>
              <span style={{ margin: "0 10px" }}>{cantidades[producto.id] || 1}</span>
              <button onClick={() => cambiarCantidad(producto.id, 1)}>+</button>
            </div>
            <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
          </li>
        ))}
      </ul>

      <hr />
      <button onClick={() => navigate("/cart")}>🛒 Ver carrito</button>
      <button onClick={() => navigate("/orders")}>📜 Ver mis pedidos</button>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          window.location.reload();
        }}
      >
        🔐 Cerrar sesión
      </button>
    </div>
  );
};

export default Home;
