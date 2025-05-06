import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const {user, isAuthenticated} = useSelector((state) => state.user);   

  if (!(user.isAdmin && isAuthenticated)) {
    return <Navigate to="/" />; // Redirect authenticated users to the homepage or dashboard
  }

  return children; // Render the component if the user is not authenticated
};

export default AdminRoute;