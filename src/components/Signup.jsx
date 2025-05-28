import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
//import signupImage from "../assets/signup.png"; // ajusta la ruta si es necesario
import "../Styles/signup.css";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/"); // Redirige al login
      } else {
        setError(data.message || "Error al registrar usuario.");
      }
    } catch (err) {
      setError("Error de red o servidor.");
    }
  };

  return (
    <div className="page-container">
      <div className="signup-container">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />
          <button type="submit">Registrarse</button>
        </form>
        {error && <p className="error-msg">{error}</p>}
        <p>
          ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
        </p>
      </div>
      <div
        className="image-container"
        style={{ backgroundImage: `url(${null})` }}
      ></div>
    </div>
  );
};

export default Signup;
