import { createContext, useEffect, useState } from "react";
import { fetchAuth } from "../apis/studiesApi";
import { Navigate, useNavigate } from "react-router-dom";
import NotificationMessage from "../components/NotificationMessage";

export const AuthorizationContext = createContext();

const AuthorizationProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    handleAuth();
  }, [token]);

  const handleAuth = () => {
    if (token) {
      fetchAuth()
        .then((res) => {
          if (!res.data.status) {
            NotificationMessage("warning", "Authorization Error");
            <Navigate to={"/login"} />;
          }
        })
        .catch((err) => console.log(err));
    } else if (!token) {
      navigate("/login");
    }
  };

  return (
    <AuthorizationContext.Provider value={{ token }}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export default AuthorizationProvider;
