import { useEffect, useState } from "react";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState(null);

  const cargarProductos = async (usarToken = true) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(usarToken && token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch("http://localhost:8080/api/products", {
        method: "GET",
        headers,
        mode: "cors",
      });

      const status = response.status;
      const responseOk = response.ok;

      if (!responseOk) {
        const text = await response.text();
        throw new Error(`Error ${status}: ${text || response.statusText}`);
      }

      const data = await response.json();
      setProductos(data);

      // Info de debug opcional
      setDebug({
        tokenExists: Boolean(token),
        tokenPreview: token ? token.slice(0, 20) + "..." : "No hay token",
        headers,
        status,
        responseOk,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos(true); // true = usar token
  }, []);

  return (
    <div>
      <h2>Bienvenido a la tienda</h2>

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && productos.length === 0 && <p>No hay productos.</p>}

      <ul>
        {productos.map((producto) => (
            <li key={producto.id}>
            {producto.nombre} - ${producto.precio}
            </li>
        ))}
      </ul>

      {/* Opcional: Debug Panel */}
      {debug && (
        <div style={{ background: "#f8f9fa", padding: "10px", margin: "15px 0", border: "1px solid #ccc" }}>
          <strong>🔧 Debug:</strong>
          <p>Token presente: {debug.tokenExists ? "✅" : "❌"}</p>
          <p>Token preview: {debug.tokenPreview}</p>
          <p>Status HTTP: {debug.status} ({debug.responseOk ? "OK" : "ERROR"})</p>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => cargarProductos(false)}
          style={{ backgroundColor: "#ffc107", color: "#000", padding: "8px 12px", borderRadius: "5px" }}
        >
          🧪 Probar sin token
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
          style={{ marginLeft: "10px", backgroundColor: "#dc3545", color: "#fff", padding: "8px 12px", borderRadius: "5px" }}
        >
          🗑️ Borrar token
        </button>
      </div>
    </div>
  );
};

export default Home;
