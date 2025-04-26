import { BrowserRouter, Routes, Route } from "react-router-dom";
import EstudianteForm2 from "./components/EstudianteForm2";
import EstudianteTable from "./components/EstudianteTable";
import MatriculaTable from "./components/MatriculaTable";
import { VStack } from "rsuite";
import Navegacion from "./components/ui/Navegacion";
import { useState, useEffect, use } from "react";
import LoginForm from "./components/LoginForm";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import useAuth from "./services/useAuth";
const App = () => {
  const [active, setActive] = useState("Inicio");
  const { isLogged, verifyAuth } = useAuth();
  useEffect(() => {
    verifyAuth();
  }, []);
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full flex flex-col bg-gray-900 text-white">
        {isLogged && (
          <header className="w-full shadow bg-white">
            <Navegacion active={active} onSelect={setActive} />
          </header>
        )}
        <main className="flex-grow px-4 py-6 md:px-10 lg:px-20">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/nuevoEstudiante"
              element={
                <ProtectedRoute>
                  <EstudianteForm2 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/estudiantes"
              element={
                <ProtectedRoute>
                  <EstudianteTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matriculas"
              element={
                <ProtectedRoute>
                  <MatriculaTable />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
