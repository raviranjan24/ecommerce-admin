import { useEffect, useState } from "react";
import { Col } from "reactstrap";

import axiosInstance from "../../utils/axios";

import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaUserPlus,
  FaShoppingBag,
  FaMoneyBillWave,
} from "react-icons/fa";

const InfoBox = () => {

  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {

      const res = await axiosInstance.get("/api/user/all");

      const users = res?.data?.data?.users || [];

      const mapped = users.map((u: any) => ({
        ...u,
        status: "active",
      }));

      setCustomers(mapped);

    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {
    try {

      const res = await axiosInstance.post("/api/order/list");

      setOrders(res?.data?.orders || []);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  // =========================
  // CALCULATIONS
  // =========================

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (c) => c.status === "active"
  ).length;

  const disabledCustomers = customers.filter(
    (c) => c.status === "disabled"
  ).length;

  const newCustomers = customers.slice(0, 5).length;

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (acc, item) => acc + Number(item.total || 0),
    0
  );

  return (
    <>
      {/* ================= TOTAL USERS ================= */}

      <Col lg="4" md="6" sm="12" className="mb-4">
        <div className="dashboard-card gradient-blue">

          <div className="card-content">
            <p>TOTAL USERS</p>
            <h2>{totalCustomers}</h2>
          </div>

          <div className="card-icon">
            <FaUsers />
          </div>

        </div>
      </Col>

      {/* ================= ACTIVE USERS ================= */}

      <Col lg="4" md="6" sm="12" className="mb-4">
        <div className="dashboard-card gradient-green">

          <div className="card-content">
            <p>ACTIVE USERS</p>
            <h2>{activeCustomers}</h2>
          </div>

          <div className="card-icon">
            <FaUserCheck />
          </div>

        </div>
      </Col>

      {/* ================= DISABLED USERS ================= */}

      <Col lg="4" md="6" sm="12" className="mb-4">
        <div className="dashboard-card gradient-red">

          <div className="card-content">
            <p>DISABLED USERS</p>
            <h2>{disabledCustomers}</h2>
          </div>

          <div className="card-icon">
            <FaUserTimes />
          </div>

        </div>
      </Col>

      {/* ================= NEW USERS ================= */}

      <Col lg="4" md="6" sm="12" className="mb-4">
        <div className="dashboard-card gradient-purple">

          <div className="card-content">
            <p>NEW USERS</p>
            <h2>{newCustomers}</h2>
          </div>

          <div className="card-icon">
            <FaUserPlus />
          </div>

        </div>
      </Col>

      {/* ================= TOTAL ORDERS ================= */}

      <Col lg="4" md="6" sm="12" className="mb-4">
        <div className="dashboard-card gradient-orange">

          <div className="card-content">
            <p>TOTAL ORDERS</p>
            <h2>{totalOrders}</h2>
          </div>

          <div className="card-icon">
            <FaShoppingBag />
          </div>

        </div>
      </Col>

      {/* ================= TOTAL REVENUE ================= */}

      <Col lg="4" md="6" sm="12" className="mb-4">
        <div className="dashboard-card gradient-dark">

          <div className="card-content">
            <p>TOTAL REVENUE</p>
            <h2>₹{totalRevenue}</h2>
          </div>

          <div className="card-icon">
            <FaMoneyBillWave />
          </div>

        </div>
      </Col>

    </>
  );
};

export default InfoBox;