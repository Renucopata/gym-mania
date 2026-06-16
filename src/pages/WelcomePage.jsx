import { useState, useContext } from 'react';
import { Navigate } from "react-router-dom";
import Login from '../components/Login';
import logo from '../assets/logo2.jpg'
import { AuthContext } from '../utils/AuthContext';

const WelcomePage = () => {

  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const [showLogin, setShowLogin] = useState(false);

  const handleShowLogin = () => {
    setShowLogin(!showLogin);
  };


  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-gymmania-black">
      {showLogin ? (
        <Login setShowLogin={setShowLogin}></Login>
      ) : (
     
<div className="bg-gray-100 p-8 rounded-xl shadow-lg">
 <div className="flex justify-center items-center">
   <div className="flex flex-col items-center">
     <div className="flex items-center mb-4">
       <img
         className="bg-gray-200 border-2 border-dashed rounded-xl w-45 h-40 mr-4"
         src={logo}
       />
       <h1 className="text-6xl font-jaro text-[#3b3b41]">¡Bienvenido!</h1>
     </div>
     <p className="text-3xl font-jaro text-gymmania-orange text-center">Click en el botón de mostrar</p>
   </div>
 </div>
</div>

      )}
      <button
        className="fixed bottom-4 right-4 bg-gymmania-orange text-white font-jaro py-2 px-4 rounded-full shadow-lg hover:bg-gymmania-orange-dark"
        onClick={handleShowLogin}
      >
        {showLogin ? "Esconder" : "Mostrar"}
      </button>
    </div>
  );
};

export default WelcomePage;