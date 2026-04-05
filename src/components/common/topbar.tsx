import { Navbar } from "reactstrap";
import { FaHome, FaUser, FaChevronDown } from "react-icons/fa";
import "./topBar.css";

const Topbar = () => {
  return (
    <Navbar className="topbar">
      <div className="topbar-left">
        <FaHome className="topbar-icon" />
        <span>Home</span>
      </div>
      <div className="topbar-right">
        <FaUser className="topbar-icon" />
        <FaChevronDown className="dropdown-icon" />
      </div>
    </Navbar>
  );
};

export default Topbar;