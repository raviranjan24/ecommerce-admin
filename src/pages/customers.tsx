import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import {
  Card,
  CardBody,
  Table,
  Row,
  Col,
} from "reactstrap";

import {
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaUserPlus,
} from "react-icons/fa";

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/user/all");
      const users = res?.data?.data?.users || [];
      const mapped = users.map((u: any) => ({
        ...u,
        status: "active", // default
      }));
      setCustomers(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = (id: string) => {
    const updated = customers.map((c) =>
      c._id === id
        ? {
          ...c,
          status: c.status === "active" ? "disabled" : "active",
        }
        : c
    );
    setCustomers(updated);
  };


  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    const updated = customers.filter((c) => c._id !== id);
    setCustomers(updated);
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const disabledCustomers = customers.filter(c => c.status === "disabled").length;
  const newCustomers = 2; // static for now

  return (
    <>
      <Row className="mb-4 g-3">
        <Col md="3">
          <div className="dashboard-card gradient-blue">
            <div className="card-content">
              <p>TOTAL CUSTOMERS</p>
              <h2>{totalCustomers}</h2>
            </div>
            <div className="card-icon">
              <FaUsers />
            </div>
          </div>
        </Col>

        <Col md="3">
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

        <Col md="3">
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

        <Col md="3">
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
      </Row>

      <Card className="shadow-sm border-0">
        <CardBody>
          <h5 className="mb-3">Customers List</h5>
          {loading && (
            <div style={{ textAlign: "center", padding: 10 }}>
              <div className="spinner-border text-primary" />
            </div>
          )}
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No users found 🚫
                  </td>
                </tr>
              )}
              {customers.map((c) => (
                <tr key={c._id}>
                  {/* PROFILE */}
                  <td>
                    <img
                      src={c.profilePicture}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td>{c.name}</td>
                  <td style={{ fontSize: "12px" }}>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        background:
                          c.status === "active"
                            ? "#d1fae5"
                            : "#fee2e2",
                        color:
                          c.status === "active"
                            ? "#065f46"
                            : "#991b1b",
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {c.status === "active" ? (
                      <FaToggleOn
                        color="green"
                        style={{ cursor: "pointer", marginRight: 10 }}
                        onClick={() => toggleStatus(c._id)}
                      />
                    ) : (
                      <FaToggleOff
                        style={{ cursor: "pointer", marginRight: 10 }}
                        onClick={() => toggleStatus(c._id)}
                      />
                    )}

                    <FaTrash
                      color="red"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(c._id)}
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

export default Customers;