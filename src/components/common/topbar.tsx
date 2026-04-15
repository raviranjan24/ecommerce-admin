import { Navbar } from "reactstrap";
import { FaHome, FaUser, FaChevronDown } from "react-icons/fa";
import "./topBar.css";
import { useLocation } from "react-router-dom";

const Topbar = () => {
  const location = useLocation();
  return (
    <Navbar className="topbar">
      <div className="topbar-left">
        <FaHome className="topbar-icon" />
        <span>{location?.pathname}</span>
      </div>
      <div className="topbar-right">
        <FaUser className="topbar-icon" />
        <FaChevronDown className="dropdown-icon" />
      </div>
    </Navbar>
  );
};

export default Topbar;