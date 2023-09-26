import Logo from "../assets/deal.png";
const NavbarLogoff = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={Logo} alt="Market Logo" />
        <h2 className="heading-navbar">Vehicle Marketplace</h2>
      </div>
    </nav>
  );
};
export default NavbarLogoff;
