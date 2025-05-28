import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

// Imágenes
import blusa from "../assets/blusa-removebg-preview.png";
import bufanda from "../assets/bufanda-removebg-preview.png";
import camiseta from "../assets/camisa-removebg-preview.png";
import chaqueta from "../assets/chaqueta-removebg-preview.png";
import falda from "../assets/falda-removebg-preview.png";
import gorra from "../assets/gorra-removebg-preview.png";
import login from "../assets/login.png";
import medias from "../assets/medias-removebg-preview.png";
import pantalon from "../assets/pantalon-removebg-preview.png";
import short from "../assets/short-removebg-preview.png";
import singup from "../assets/singup.jpeg";
import sudadera from "../assets/sudadera.png";
import vestido from "../assets/vestido-removebg-preview.png";
import zapatos from "../assets/zapatos-removebg-preview.png";
import aaaa from "../assets/aaaa.png";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cantidades, setCantidades] = useState({});
  const navigate = useNavigate();

  // Todas las claves en minúsculas para consistencia
  const imagenes = {
    blusa,
    bufanda,
    camiseta,
    chaqueta,
    falda,
    gorra,
    login,
    medias,
    pantalon,
    short,
    singup,
    sudadera,
    vestido,
    zapatos,
    aaaa,
  };

  useEffect(() => {
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

        // Inicializa cantidades
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

  const obtenerImagen = (nombreProducto) => {
    const nombre = nombreProducto.toLowerCase();
    const clave = Object.keys(imagenes).find((palabra) => nombre.includes(palabra));
    return clave ? imagenes[clave] : imagenes.aaaa;
  };

  return (
    <div className="home-container">
      <h2>Bienvenido a la tienda</h2>

      {loading && <p>Cargando productos...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && productos.length === 0 && <p>No hay productos.</p>}

      <div className="product-list">
        {productos.map((producto) => (
          <div className="product-card" key={producto.id}>
              <div className="product-image-container">
                <img
                  src={obtenerImagen(producto.nombre)}
                  alt={producto.nombre}
                  className="product-image"
                />
              </div>
            <h3>{producto.nombre}</h3>
            <p>${producto.precio.toFixed(2)}</p>
            <div className="quantity-controls">
              <button onClick={() => cambiarCantidad(producto.id, -1)}>-</button>
              <span>{cantidades[producto.id] || 1}</span>
              <button onClick={() => cambiarCantidad(producto.id, 1)}>+</button>
            </div>
            <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
          </div>
        ))}
      </div>

      <div className="home-actions">
        <button onClick={() => navigate("/cart")}>Ver carrito</button>
        <button onClick={() => navigate("/orders")}>Ver mis pedidos</button>
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
    </div>
  );
};

export default Home;
