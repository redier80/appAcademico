import { Nav } from "rsuite";
import { useNavigate } from "react-router-dom";
import useAuth from "../../services/useAuth";
import { toast } from "react-toastify";

const Navegacion = ({ active, onSelect, ...props }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleSelect = (eventKey) => {
    onSelect(eventKey);

    if (eventKey === "Salir") {
      logout(); // limpia el estado y el token
      navigate("/login"); // redirige al login
      toast.info("Sesion cerrada");
      return;
    }

    // Mapea las pestañas a rutas
    const rutas = {
      Inicio: "/login",
      Nuevo: "/nuevoEstudiante",
      Lista: "/estudiantes",
      Horarios: "/horarios",
      Salir: "/salir",
    };

    navigate(rutas[eventKey]);
  };
  return (
    <div className="bg-black text-white px-4 py-2 shadow">
      <Nav
        appearance="tabs"
        justified
        activeKey={active}
        onSelect={handleSelect}
      >
        <Nav.Item eventKey="Inicio">Inicio</Nav.Item>
        <Nav.Item eventKey="Nuevo">Nuevo Estudiante</Nav.Item>
        <Nav.Item eventKey="Lista">Lista Estudiantes</Nav.Item>
        <Nav.Item eventKey="Horarios">Horarios</Nav.Item>
        <Nav.Item eventKey="Salir">Salir</Nav.Item>
      </Nav>
    </div>
  );
};

export default Navegacion;
