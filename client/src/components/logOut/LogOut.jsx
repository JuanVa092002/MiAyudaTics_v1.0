import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../../services/auth.services";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth.context";

export default function LogOut() {

    const { setUser, setIsAuthenticated } = useContext(AuthContext)


  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const logOutResponse = await logout();
      console.log(logOutResponse)
      setUser(null);
      setIsAuthenticated(false);
      navigate("/loginMain");
    } catch (error) {
      console.log("Error al cerrar sesion.");
    }
  };
  return (
    <FontAwesomeIcon
      icon={faArrowRightFromBracket}
      className="cursor-pointer text-white  text-3xl"
      onClick={handleLogout}
    />
  );
}
