import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { UserNameContext } from "../context/ContextConfig";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const [userName, setUserName] = useContext(UserNameContext);
  let location = useLocation();

  if (!userName) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
