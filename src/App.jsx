import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import AuthGuard from "./components/AuthGuard";
import WelcomePage from "./pages/WelcomePage";
import DashboardPage from "./pages/DashboardPage";
import AddEmployeesPage from "./pages/AddEmployeesPage";
import ClientsListPage from "./pages/ClientsPage";
import EmployeesPage from "./pages/EmployeesPage";
import MachinesPage from "./pages/MachinesPage";
import MembershipsPages from "./pages/MembershipsPage";
import ChartsPage from "./pages/ChartsPage";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<WelcomePage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            }
          />
          <Route
            path="/addEmployees"
            element={
              <AuthGuard>
                <AddEmployeesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/clients"
            element={
              <AuthGuard>
                <ClientsListPage />
              </AuthGuard>
            }
          />
          <Route
            path="/employees"
            element={
              <AuthGuard>
                <EmployeesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/memberships"
            element={
              <AuthGuard>
                <MembershipsPages />
              </AuthGuard>
            }
          />
          <Route
            path="/machines"
            element={
              <AuthGuard>
                <MachinesPage />
              </AuthGuard>
            }
          />
          <Route
            path="/charts"
            element={
              <AuthGuard>
                <ChartsPage />
              </AuthGuard>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;




