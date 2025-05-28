import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import loginImage from "../assets/login.png"
import "../Styles/login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        localStorage.setItem("email", decoded.sub);
        navigate("/home");
      } else {
        setError(data.message || "Error al iniciar sesión.");
      }
    } catch (err) {
      setError("Error de red o del servidor.");
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              value={credentials.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Entrar</button>
          </form>
          {error && <p className="error-msg">{error}</p>}
          <p>
            ¿No tienes cuenta? <Link to="/signup">Crea una</Link>
          </p>
        </div>
      </div>
  
      <div className="image-container">
        <img src={loginImage} alt="loginImage" />
      </div>
    </div>
  );
  
};

export default Login;
