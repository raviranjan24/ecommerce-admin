import { useState } from "react";
import {
  Card,
  CardBody,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
} from "reactstrap";

import {
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaUserPlus,
} from "react-icons/fa";

const initialCustomers = [
  { id: 1, name: "Ravi Kumar", email: "ravi@gmail.com", phone: "9876543210", status: "active" },
  { id: 2, name: "Amit Singh", email: "amit@gmail.com", phone: "9123456780", status: "disabled" },
  { id: 3, name: "Priya Sharma", email: "priya@gmail.com", phone: "9988776655", status: "active" },
  { id: 4, name: "Rahul Verma", email: "rahul@gmail.com", phone: "9012345678", status: "active" },
  { id: 5, name: "Neha Gupta", email: "neha@gmail.com", phone: "9090909090", status: "disabled" },
  { id: 6, name: "Sanjay Kumar", email: "sanjay@gmail.com", phone: "8888888888", status: "active" },
];

const ITEMS_PER_PAGE = 5;

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const currentData = customers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const disabledCustomers = customers.filter(c => c.status === "disabled").length;
  const newCustomers = 2;

  const toggleStatus = (id: number) => {
    const updated = customers.map((c) =>
      c.id === id
        ? { ...c, status: c.status === "active" ? "disabled" : "active" }
        : c
    );
    setCustomers(updated);
  };

  return (
    <>
      <Row className="mb-4">
        <Col md="3">
          <div className="dashboard-card bg-total">
            <div>
              <h6>Total Customers</h6>
              <h3>{totalCustomers}</h3>
            </div>
            <FaUsers className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-delivered">
            <div>
              <h6>Active</h6>
              <h3>{activeCustomers}</h3>
            </div>
            <FaUserCheck className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-cancelled">
            <div>
              <h6>Disabled</h6>
              <h3>{disabledCustomers}</h3>
            </div>
            <FaUserTimes className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-pending">
            <div>
              <h6>New Users</h6>
              <h3>{newCustomers}</h3>
            </div>
            <FaUserPlus className="icon" />
          </div>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <CardBody>
          <h5 className="mb-3">Customers List</h5>

          <Table className="custom-table" borderless responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`badge ${c.status === "active"
                          ? "bg-success"
                          : "bg-danger"
                        }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="text-center">
                    {c.status === "active" ? (
                      <FaToggleOn
                        className="cursor text-success"
                        onClick={() => toggleStatus(c.id)}
                      />
                    ) : (
                      <FaToggleOff
                        className="cursor text-secondary"
                        onClick={() => toggleStatus(c.id)}
                      />
                    )}

                    <FaEdit
                      className="cursor ms-3"
                      onClick={() => alert("Edit " + c.name)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem active={page === i + 1} key={i}>
                <PaginationLink onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </Pagination>
        </CardBody>
      </Card>
    </>
  );
};

export default Customers;