import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../utils/AxiosInstance"; // Ensure this is correctly set up

const AddEmployeesPage = () => {

  const navigate = useNavigate();
  const userRole = localStorage.getItem("rol");

  const [formData, setFormData] = useState({
    ci: "",
    name: "",
    lastname: "",
    email: "",
    cel: "",
    bday: "",
    genre: "masculino",
    emergPerson: "",
    emerContact: "",
    hireDate: "",
    status: "activo",
    pwd: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage("")
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.ci.trim()) newErrors.ci = "El CI es requerido.";
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido.";
    if (!formData.lastname.trim()) newErrors.lastname = "El apellido es requerido.";
    if (!formData.cel.trim())  newErrors.cel = "Ingrese un número de celular.";   
    if (!formData.bday.trim()) newErrors.bday = "La fecha de nacimiento es requerida.";
    if (!formData.hireDate.trim()) newErrors.hireDate = "La fecha de contratación es requerida.";
    if (!formData.pwd.trim() || formData.pwd.length < 6)
      newErrors.pwd = "La contraseña debe tener al menos 8 caracteres.";
    if (!formData.role) {
      alert("Por favor, selecciona un rol.");
      return;
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (validateForm()) {



      const submissionData = {
        ...formData,
        email: formData.email === "" ? null : formData.email,
        role: formData.role === "" ? "user" : formData.role 


    };
      try {
        const response = await axiosInstance.post("/auth/registerUser", submissionData);
        console.log(response.data);
        
        setSuccessMessage("Empleado registrado exitosamente.");
        setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
        setFormData({
          ci: "",
          name: "",
          lastname: "",
          email: "",
          cel: "",
          bday: "",
          genre: "masculino",
          emergPerson: "",
          emerContact: "",
          hireDate: "",
          status: "activo",
          pwd: "",
          role: "user",
        });
       
      } catch (err) {
        console.log(err);
        if (err.response?.data?.error) {
          setErrorMessage(err.response.data.error);
      } else {
          setErrorMessage("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
      }
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
        <h2 className="text-2xl font-bold mb-6">Añadir Nuevo Empleado</h2>
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {(userRole === "admin" || userRole === "sistemas")&&(
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* CI */}
            <div>
              <label className="block mb-2 font-medium">CI</label>
              <input
                type="text"
                name="ci"
                value={formData.ci}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.ci ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.ci && <p className="text-red-500 text-sm">{errors.ci}</p>}
            </div>

            {/* Nombre */}
            <div>
              <label className="block mb-2 font-medium">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Apellido */}
            <div>
              <label className="block mb-2 font-medium">Apellido</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.lastname ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Número de Celular */}
            <div>
              <label className="block mb-2 font-medium">Número de Celular</label>
              <input
                type="text"
                name="cel"
                value={formData.cel}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.cel ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.cel && <p className="text-red-500 text-sm">{errors.cel}</p>}
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block mb-2 font-medium">Fecha de Nacimiento</label>
              <input
                type="date"
                name="bday"
                value={formData.bday}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.bday ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.bday && <p className="text-red-500 text-sm">{errors.bday}</p>}
            </div>

            {/* Género */}
            <div>
              <label className="block mb-2 font-medium">Género</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md border-gray-300"
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Persona de Contacto de Emergencia */}
            <div>
              <label className="block mb-2 font-medium">Persona de Contacto de Emergencia</label>
              <input
                type="text"
                name="emergPerson"
                value={formData.emergPerson}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.emergPerson ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.emergPerson && <p className="text-red-500 text-sm">{errors.emergPerson}</p>}
            </div>

            {/* Teléfono de Contacto de Emergencia */}
            <div>
              <label className="block mb-2 font-medium">Teléfono de Contacto de Emergencia</label>
              <input
                type="text"
                name="emerContact"
                value={formData.emerContact}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.emerContact ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.emerContact && <p className="text-red-500 text-sm">{errors.emerContact}</p>}
            </div>

            {/* Fecha de Contratación */}
            <div>
              <label className="block mb-2 font-medium">Fecha de Contratación</label>
              <input
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.hireDate ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.hireDate && <p className="text-red-500 text-sm">{errors.hireDate}</p>}
            </div>

            {/* Rol */}
              <div>
                <label className="block mb-2 font-medium">Rol</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md border-gray-300"
                >
                  <option value="" disabled>
                    Selecciona un rol
                  </option>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                </select>
              </div>

            {/* Contraseña */}
            <div>
              <label className="block mb-2 font-medium">Contraseña</label>
              <input
                type="text"
                name="pwd"
                value={formData.pwd}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.pwd ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.pwd && <p className="text-red-500 text-sm">{errors.pwd}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Registrar Empleado
            </button>
          </div>
        </form>)}
      </div>
    </div>

  );
};

export default AddEmployeesPage;
