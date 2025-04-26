import { Navigate } from "react-router-dom";
import useAuth from "../../services/useAuth";
const ProtectedRoute = ({ children }) => {
  const { isLogged } = useAuth();
  return <> {isLogged ? children : <Navigate to="/login" />} </>;
};

export default ProtectedRoute;
