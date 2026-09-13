import { Navigate } from "react-router-dom";

const getSession = () => {
  try {
    return {
      token: localStorage.getItem("eventxToken"),
      user: JSON.parse(localStorage.getItem("eventxUser") || "null"),
    };
  } catch {
    return { token: null, user: null };
  }
};

const RouteGuard = ({ children, roles }) => {
  const { token, user } = getSession();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role || "user")) {
    return <Navigate to={user.role === "admin" ? "/admin" : user.role === "creator" ? "/creator" : "/profile/dashboard"} replace />;
  }
  return children;
};

export default RouteGuard;
