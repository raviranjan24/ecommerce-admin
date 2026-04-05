import { useState } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaStore,
  FaBox,
  FaList,
  FaUsers,
  FaChevronRight,
  FaSignOutAlt,
} from "react-icons/fa";
import "./sidebar.css";
import { toast } from "react-toastify";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  const handleLogout = () => {
    toast.success("Logout successful..");
    localStorage.removeItem("token");
    localStorage.removeItem("isLogin");
    sessionStorage.clear();
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Orders", path: "/orders", icon: <FaStore /> },
    {
      name: "Products",
      icon: <FaBox />,
      children: [
        { name: "All Products", path: "/products" },
        { name: "Add Product", path: "/add-product" },
        { name: "Category", path: "/categories" },
        // { name: "Attributes", path: "/products/attributes" },
      ],
    },
    { name: "Customers", path: "/customers", icon: <FaUsers /> },
    { name: "Coupon", path: "/coupon", icon: <FaStore /> },
    { name: "Invoices", path: "/invoices", icon: <FaStore /> },
    {
      name: "Home",
      icon: <FaTachometerAlt />,
      children: [
        { name: "Home Slider", path: "/home-slider" },
        { name: "Home Add", path: "/home-add" },
      ],
    },
    {
      name: "Pages",
      icon: <FaList />,
      children: [
        { name: "About Us", path: "/static-page" },
        { name: "Privacy Policy", path: "/static-page" },
        { name: "Terms & Conditions", path: "/static-page" },
        { name: "Refund Policy", path: "/static-page" },
      ],
    },
    {
      name: "Master Data",
      icon: <FaList />,
      children: [
        { name: "Change Logo", path: "/master-data" },
        { name: "Contact Info", path: "/master-data" },
      ],
    },
    { name: "Contact List", path: "/contacts", icon: <FaStore /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">Admin</div>
      <Nav vertical>
        {menu.map((item, i) => (
          <div key={i}>
            <NavItem>
              <NavLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  item.children
                    ? toggleMenu(item.name)
                    : navigate(item.path!);
                }}
                className={`sidebar-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <div className="menu-left">
                  <span className="menu-icon">{item.icon}</span>
                  <span>{item.name}</span>
                </div>

                {item.children && (
                  <FaChevronRight
                    className={`menu-arrow ${
                      openMenu === item.name ? "rotate" : ""
                    }`}
                  />
                )}
              </NavLink>
            </NavItem>
            {item.children && openMenu === item.name && (
              <div className="submenu">
                {item.children.map((child, j) => (
                  <NavItem key={j}>
                    <NavLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(child.path);
                      }}
                      className={`submenu-link ${
                        location.pathname === child.path ? "active" : ""
                      }`}
                    >
                      {child.name}
                    </NavLink>
                  </NavItem>
                ))}
              </div>
            )}
          </div>
        ))}
      </Nav>
      <div className="sidebar-footer">
        <NavItem>
          <NavLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            className="sidebar-link logout"
          >
            <div className="menu-left">
              <span className="menu-icon">
                <FaSignOutAlt />
              </span>
              <span>Logout</span>
            </div>
          </NavLink>
        </NavItem>
      </div>
    </div>
  );
};

export default Sidebar;