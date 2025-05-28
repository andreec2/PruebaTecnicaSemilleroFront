import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

      // Inicializar cantidades en 1 para todos los productos
      const cantidadesIniciales = {};
      data.forEach((p) => {
        cantidadesIniciales[p.id] = 1;
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

  const cambiarCantidad = (id, operacion) => {
    setCantidades((prev) => {
      const actual = prev[id] || 1;
      const nuevaCantidad = operacion === "incrementar" ? actual + 1 : Math.max(1, actual - 1);
      return {
        ...prev,
        [id]: nuevaCantidad,
      };
    });
  };

  const agregarAlCarrito = async (producto) => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (!token || !email) throw new Error("Usuario no autenticado");

      const cantidad = cantidades[producto.id] || 1;

      const response = await fetch(`http://localhost:8080/api/cart/${email}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: producto.id,
          cantidad,
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
      <h2>Tienda</h2>

      {loading && <p>Cargando productos...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && productos.length === 0 && <p>No hay productos.</p>}

      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio}
            <div style={{ display: "inline-flex", alignItems: "center", marginLeft: 10 }}>
              <button onClick={() => cambiarCantidad(producto.id, "disminuir")}>−</button>
              <span style={{ margin: "0 10px" }}>{cantidades[producto.id] || 1}</span>
              <button onClick={() => cambiarCantidad(producto.id, "incrementar")}>+</button>
            </div>
            <button onClick={() => agregarAlCarrito(producto)} style={{ marginLeft: 10 }}>
              Agregar
            </button>
          </li>
        ))}
      </ul>

      <button onClick={() => navigate("/cart")}>Ver carrito</button>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          window.location.reload();
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Home;
