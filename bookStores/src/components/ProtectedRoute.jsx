import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const {isAuthenticated} = useSelector((state) => state.user); 
  console.log(isAuthenticated);
  

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect authenticated users to the homepage or dashboard
  }

  return children; // Render the component if the user is not authenticated
};

export default ProtectedRoute;  