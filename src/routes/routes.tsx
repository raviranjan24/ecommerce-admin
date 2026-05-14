import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import Products from "../pages/products";
import Customers from "../pages/customers";
import Categories from "../pages/categories";
import Orders from "../pages/orders";
import StaticPage from "../pages/staticPage";
import MasterData from "../pages/masterData";
import ContactList from "../pages/contactus";
import HomeSlider from "../pages/homeSlider";
import HomeAdd from "../pages/homeAdd";
import CouponManagement from "../pages/couponManagement";
import Invoices from "../pages/invoices";
import ProductAttributes from "../pages/productAttributes";
import ProductTags from "../pages/productTags";
import AddProduct from "../pages/addProduct";
import DashboardLayout from "../components/layout/layout";
import ProtectedRoute from "../utils/ProtectedRoute";
import ProductEdit from "../pages/productEdit"; 
import HeaderCategory from "../pages/headerCategory";

const AppRoutes = () => {
  const isLogin = localStorage.getItem("isLogin");
  return (
    <Routes>
      <Route
        path="/"
        element={
          isLogin === "true" ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<ProductEdit/>} />
          <Route path="products/attributes" element={<ProductAttributes />} />
          <Route path="products/tag" element={<ProductTags />} />
          <Route path="customers" element={<Customers />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="static-page" element={<StaticPage />} />
          <Route path="master-data" element={<MasterData />} />
          <Route path="contacts" element={<ContactList />} />
          <Route path="home-slider" element={<HomeSlider />} />
          <Route path="home-add" element={<HomeAdd />} />
          <Route path="coupon" element={<CouponManagement />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="HeaderCategory" element={<HeaderCategory/>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;