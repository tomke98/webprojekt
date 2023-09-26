import Logo from "../assets/deal.png";
import NavigationItem from "./NavigationItem";
import { auth } from "./FirebaseConfig";
import { AuthContext } from "./AuthProvider";
import { useContext } from "react";
const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const logoff = () => {
    auth
      .signOut()
      .then(() => {
        logout();
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={Logo} alt="Market Logo" />
        <h2 className="heading-navbar">Vehicle Marketplace</h2>
      </div>
      <div className="items-container">
        <NavigationItem
          icon="user"
          text="Profile"
          color="#c4c5d7"
          hasBorder={true}
        />
        <NavigationItem
          icon="search"
          text="Marketplace"
          color="#C4C5D7"
          hasBorder={true}
        />
        <NavigationItem
          icon="power-off"
          text="Logoff"
          color="#181846"
          hasBorder={false}
          onClick={logoff}
        />
      </div>
    </nav>
  );
};
export default Navbar;
