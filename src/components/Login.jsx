import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext); // Use AuthContext for managing authentication
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ user: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      // Send login request to backend
      const response = await axios.post("https://smash-gym-server-rrsoft.vercel.app/api/auth/login", {
        user: credentials.user,
        password: credentials.password,
      });

      // Save token using AuthContext
      login(response.data.token, response.data.rol);

      // Navigate to the dashboard or other authenticated route
      navigate("/dashboard");
    } catch (error) {
      // Handle error response from the backend
      console.error("Login error:", error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Error al iniciar sesión. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[40vw] bg-gymmania-panel p-12 rounded-lg shadow-xl">
        <h2 className="text-3xl font-jaro text-gray-700 mb-6 text-center">¡Ingresa tus credenciales!</h2>
        <form onSubmit={handleLogin}>
          {/* Username Field */}
          <div className="mb-6">
            <label className="font-jaro block text-gray-600 mb-2 text-lg" htmlFor="user">
              Usuario
            </label>
            <input
              className="block w-full p-3 border border-gray-300 rounded-lg text-lg"
              type="text"
              id="user"
              placeholder="Ingresa tu usuario"
              value={credentials.user}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label className="font-jaro block text-gray-600 mb-2 text-lg" htmlFor="password">
              Contraseña
            </label>
            <div className="flex items-center">
              <input
                className="block w-full p-3 border border-gray-300 rounded-lg text-lg"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Ingresa tu contraseña"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="ml-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-600 font-jaro mb-4 text-center">{errorMessage}</p>
          )}

          {/* Login Button */}
          <button
            className="w-full bg-gymmania-orange hover:bg-gymmania-orange-dark text-white font-jaro py-3 px-6 rounded-lg text-lg"
            type="submit"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}




