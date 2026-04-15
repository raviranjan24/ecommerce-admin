import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import {
  Card,
  CardBody,
  Table,
  Row,
  Col,
  Input,
} from "reactstrap";

import {
  FaTrash,
  FaShoppingCart,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Shipping",
  "Delivered",
  "Cancelled",
];

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/order/list");
      setOrders(res?.data?.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      setLoading(true);
      await axiosInstance.post("/api/order/status", {
        orderId,
        status,
      });
      const updated = orders.map((o) =>
        o._id === orderId ? { ...o, status } : o
      );
      setOrders(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/order/delete/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = orders.length;
  const pending = orders.filter(o => o.status === "Pending").length;
  const cancelled = orders.filter(o => o.status === "Cancelled").length;
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "#fef3c7";
      case "Processing":
        return "#e0f2fe";
      case "Shipping":
        return "#dbeafe";
      case "Delivered":
        return "#d1fae5";
      case "Cancelled":
        return "#fee2e2";
      default:
        return "#eee";
    }
  };

  return (
    <>
      <Row className="mb-4 g-3">
        <Col md="3">
          <div className="dashboard-card gradient-purple">
            <div className="card-content">
              <p>ORDER PENDING</p>
              <h2>{pending}</h2>
            </div>
            <div className="card-icon">
              <FaShoppingCart />
            </div>
          </div>
        </Col>
        <Col md="3">
          <div className="dashboard-card gradient-red">
            <div className="card-content">
              <p>ORDER CANCEL</p>
              <h2>{cancelled}</h2>
            </div>
            <div className="card-icon">
              <FaTimesCircle />
            </div>
          </div>
        </Col>
        <Col md="3">
          <div className="dashboard-card gradient-blue">
            <div className="card-content">
              <p>ORDER PROCESS</p>
              <h2>{totalOrders}</h2>
            </div>
            <div className="card-icon">
              <FaClock />
            </div>
          </div>
        </Col>
        <Col md="3">
          <div className="dashboard-card gradient-green">
            <div className="card-content">
              <p>TODAY INCOME</p>
              <h2>₹0</h2>
            </div>
            <div className="card-icon">
              ₹
            </div>
          </div>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <CardBody>
          <h5 className="mb-3">Order List</h5>
          {loading && (
            <div style={{ textAlign: "center", padding: 10 }}>
              <div className="spinner-border text-primary" />
            </div>
          )}
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Order No</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item) => (
                <tr key={item._id}>
                  <td>{item.orderNumber}</td>
                  <td>{item.items?.length}</td>
                  <td>₹{item.total}</td>
                  <td style={{ fontSize: 12 }}>
                    {item.paymentMethod} <br />
                    {item.paymentStatus}
                  </td>
                  <td>
                    <Input
                      type="select"
                      value={item.status}
                      style={{
                        background: getStatusStyle(item.status),
                        fontSize: 12,
                      }}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </Input>
                  </td>
                  <td>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <FaTrash
                      color="red"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(item._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
};

export default Orders;