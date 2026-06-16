import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const navigate = useNavigate();

  // Login function
  const login = (newToken, newRol) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("rol", newRol)
    setToken(newToken);
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    setToken(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  // Verify token on app load
  useEffect(() => {
    if (token) {
      try {
        // Directly set authenticated if token exists
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error verifying token:", error);
        logout(); // Logout in case of unexpected error
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
