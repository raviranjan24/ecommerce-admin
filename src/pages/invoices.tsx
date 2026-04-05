import React, { useState } from "react";
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
  FaFileInvoice,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaDownload,
} from "react-icons/fa";
type InvoiceStatus = "paid" | "pending" | "overdue";

interface Invoice {
  id: number;
  customer: string;
  amount: number;
  date: string;
  status: InvoiceStatus;
}

const ITEMS_PER_PAGE = 5;

const Invoices: React.FC = () => {
  const [invoices] = useState<Invoice[]>([
    { id: 1, customer: "Ravi Kumar", amount: 2500, date: "2024-01-01", status: "paid" },
    { id: 2, customer: "Amit Singh", amount: 1800, date: "2024-01-02", status: "pending" },
    { id: 3, customer: "Priya Sharma", amount: 3200, date: "2024-01-03", status: "paid" },
    { id: 4, customer: "Rahul Verma", amount: 900, date: "2024-01-04", status: "overdue" },
    { id: 5, customer: "Neha Gupta", amount: 1200, date: "2024-01-05", status: "pending" },
    { id: 6, customer: "Sanjay Kumar", amount: 4500, date: "2024-01-06", status: "paid" },
  ]);

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);

  const currentData = invoices.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalInvoices = invoices.length;
  const paid = invoices.filter(i => i.status === "paid").length;
  const pending = invoices.filter(i => i.status === "pending").length;
  const overdue = invoices.filter(i => i.status === "overdue").length;

  return (
    <>
      <Row className="mb-4">
        <Col md="3">
          <div className="dashboard-card bg-total">
            <div>
              <h6>Total Invoices</h6>
              <h3>{totalInvoices}</h3>
            </div>
            <FaFileInvoice className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-delivered">
            <div>
              <h6>Paid</h6>
              <h3>{paid}</h3>
            </div>
            <FaCheckCircle className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-pending">
            <div>
              <h6>Pending</h6>
              <h3>{pending}</h3>
            </div>
            <FaClock className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-cancelled">
            <div>
              <h6>Overdue</h6>
              <h3>{overdue}</h3>
            </div>
            <FaTimesCircle className="icon" />
          </div>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <CardBody>
          <h5 className="mb-3">Invoices List</h5>
          <Table className="custom-table" borderless responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((inv) => (
                <tr key={inv.id}>
                  <td>#{inv.id}</td>
                  <td>{inv.customer}</td>
                  <td>₹{inv.amount}</td>
                  <td>{inv.date}</td>
                  <td>
                    <span
                      className={`badge ${
                        inv.status === "paid"
                          ? "bg-success"
                          : inv.status === "pending"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="text-center">
                    <FaEye
                      className="cursor me-3"
                      onClick={() => alert("View Invoice " + inv.id)}
                    />

                    <FaDownload
                      className="cursor text-primary"
                      onClick={() => alert("Download Invoice " + inv.id)}
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

export default Invoices;