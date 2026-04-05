import React, { useState } from "react";
import {
  Card,
  CardBody,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
} from "reactstrap";
import { FaEye, FaTrash, FaSyncAlt } from "react-icons/fa";
import { FaShoppingCart, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../styles/order.css";

type OrderStatus = "processing" | "shipping" | "delivered" | "cancelled";

interface Order {
  id: number;
  customer: string;
  amount: number;
  date: string;
  status: OrderStatus;
}

const ITEMS_PER_PAGE = 5;

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, customer: "Ravi", amount: 2000, date: "2024-01-01", status: "processing" },
    { id: 2, customer: "Amit", amount: 1500, date: "2024-01-02", status: "shipping" },
    { id: 3, customer: "Priya", amount: 3000, date: "2024-01-03", status: "delivered" },
    { id: 4, customer: "Neha", amount: 800, date: "2024-01-04", status: "cancelled" },
    { id: 5, customer: "Rahul", amount: 1200, date: "2024-01-05", status: "processing" },
    { id: 6, customer: "Sanjay", amount: 5000, date: "2024-01-06", status: "shipping" },
  ]);

  const [page, setPage] = useState<number>(1);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  const currentData = orders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const toggleView = () => setViewModal(!viewModal);
  const totalOrders = orders.length;
  const pending = orders.filter(o => o.status === "processing").length;
  const delivered = orders.filter(o => o.status === "delivered").length;
  const cancelled = orders.filter(o => o.status === "cancelled").length;

  const changeStatus = (id: number) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id !== id) return o;
        let next: OrderStatus = "processing";
        if (o.status === "processing") next = "shipping";
        else if (o.status === "shipping") next = "delivered";
        else if (o.status === "delivered") next = "cancelled";
        else next = "processing";

        return { ...o, status: next };
      })
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this order?")) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return "badge bg-warning";
      case "shipping":
        return "badge bg-info";
      case "delivered":
        return "badge bg-success";
      case "cancelled":
        return "badge bg-danger";
      default:
        return "";
    }
  };

  return (
    <>
      <Row className="mb-4">
        <Col md="3">
          <div className="dashboard-card bg-total">
            <div>
              <h6>Total Orders</h6>
              <h3>{totalOrders}</h3>
            </div>
            <FaShoppingCart className="icon" />
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
          <div className="dashboard-card bg-delivered">
            <div>
              <h6>Delivered</h6>
              <h3>{delivered}</h3>
            </div>
            <FaCheckCircle className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-cancelled">
            <div>
              <h6>Cancelled</h6>
              <h3>{cancelled}</h3>
            </div>
            <FaTimesCircle className="icon" />
          </div>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <CardBody>
          <h5 className="mb-3">Order List</h5>
          <Table className="custom-table" borderless responsive>
            <thead className="table-light">
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
              {currentData.map(item => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>{item.customer}</td>
                  <td>₹{item.amount}</td>
                  <td>{item.date}</td>

                  <td>
                    <span className={getStatusClass(item.status)}>
                      {item.status}
                    </span>
                  </td>

                  <td className="text-center">
                    <FaEye
                      className="me-3 cursor"
                      onClick={() => {
                        setSelectedOrder(item);
                        toggleView();
                      }}
                    />

                    <FaSyncAlt
                      className="me-3 cursor"
                      onClick={() => changeStatus(item.id)}
                    />

                    <FaTrash
                      className="text-danger cursor"
                      onClick={() => handleDelete(item.id)}
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
      <Modal isOpen={viewModal} toggle={toggleView}>
        <ModalHeader toggle={toggleView}>Order Details</ModalHeader>
        <ModalBody>
          <p><b>Customer:</b> {selectedOrder?.customer}</p>
          <p><b>Amount:</b> ₹{selectedOrder?.amount}</p>
          <p><b>Date:</b> {selectedOrder?.date}</p>
          <p><b>Status:</b> {selectedOrder?.status}</p>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Orders;