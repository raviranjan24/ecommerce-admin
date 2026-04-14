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

  // ===========================
  // 🔥 FETCH ORDERS
  // ===========================
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

  // ===========================
  // 🔁 UPDATE STATUS
  // ===========================
  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      setLoading(true);

      await axiosInstance.post("/api/order/status", {
        orderId,
        status,
      });

      // update UI instantly
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

  // ===========================
  // ❌ DELETE
  // ===========================
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

  // ===========================
  // 📊 STATS
  // ===========================
  const totalOrders = orders.length;
  const pending = orders.filter(o => o.status === "Pending").length;
  const cancelled = orders.filter(o => o.status === "Cancelled").length;

  // ===========================
  // STATUS STYLE
  // ===========================
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
      {/* 🔥 STATS */}
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

      {/* TABLE */}
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

                  {/* 🔥 STATUS DROPDOWN */}
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

                  {/* DELETE */}
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

// import React, { useState } from "react";
// import {
//   Card,
//   CardBody,
//   Table,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Pagination,
//   PaginationItem,
//   PaginationLink,
//   Row,
//   Col,
// } from "reactstrap";
// import { FaEye, FaTrash, FaSyncAlt } from "react-icons/fa";
// import { FaShoppingCart, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import "../styles/order.css";

// type OrderStatus = "processing" | "shipping" | "delivered" | "cancelled";

// interface Order {
//   id: number;
//   customer: string;
//   amount: number;
//   date: string;
//   status: OrderStatus;
// }

// const ITEMS_PER_PAGE = 5;

// const Orders: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([
//     { id: 1, customer: "Ravi", amount: 2000, date: "2024-01-01", status: "processing" },
//     { id: 2, customer: "Amit", amount: 1500, date: "2024-01-02", status: "shipping" },
//     { id: 3, customer: "Priya", amount: 3000, date: "2024-01-03", status: "delivered" },
//     { id: 4, customer: "Neha", amount: 800, date: "2024-01-04", status: "cancelled" },
//     { id: 5, customer: "Rahul", amount: 1200, date: "2024-01-05", status: "processing" },
//     { id: 6, customer: "Sanjay", amount: 5000, date: "2024-01-06", status: "shipping" },
//   ]);

//   const [page, setPage] = useState<number>(1);
//   const [viewModal, setViewModal] = useState<boolean>(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

//   const currentData = orders.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE
//   );

//   const toggleView = () => setViewModal(!viewModal);
//   const totalOrders = orders.length;
//   const pending = orders.filter(o => o.status === "processing").length;
//   const delivered = orders.filter(o => o.status === "delivered").length;
//   const cancelled = orders.filter(o => o.status === "cancelled").length;

//   const changeStatus = (id: number) => {
//     setOrders(prev =>
//       prev.map(o => {
//         if (o.id !== id) return o;
//         let next: OrderStatus = "processing";
//         if (o.status === "processing") next = "shipping";
//         else if (o.status === "shipping") next = "delivered";
//         else if (o.status === "delivered") next = "cancelled";
//         else next = "processing";

//         return { ...o, status: next };
//       })
//     );
//   };

//   const handleDelete = (id: number) => {
//     if (window.confirm("Delete this order?")) {
//       setOrders(prev => prev.filter(o => o.id !== id));
//     }
//   };

//   const getStatusClass = (status: OrderStatus) => {
//     switch (status) {
//       case "processing":
//         return "badge bg-warning";
//       case "shipping":
//         return "badge bg-info";
//       case "delivered":
//         return "badge bg-success";
//       case "cancelled":
//         return "badge bg-danger";
//       default:
//         return "";
//     }
//   };

//   return (
//     <>
//       <Row className="mb-4">
//         <Col md="3">
//           <div className="dashboard-card bg-total">
//             <div>
//               <h6>Total Orders</h6>
//               <h3>{totalOrders}</h3>
//             </div>
//             <FaShoppingCart className="icon" />
//           </div>
//         </Col>

//         <Col md="3">
//           <div className="dashboard-card bg-pending">
//             <div>
//               <h6>Pending</h6>
//               <h3>{pending}</h3>
//             </div>
//             <FaClock className="icon" />
//           </div>
//         </Col>

//         <Col md="3">
//           <div className="dashboard-card bg-delivered">
//             <div>
//               <h6>Delivered</h6>
//               <h3>{delivered}</h3>
//             </div>
//             <FaCheckCircle className="icon" />
//           </div>
//         </Col>

//         <Col md="3">
//           <div className="dashboard-card bg-cancelled">
//             <div>
//               <h6>Cancelled</h6>
//               <h3>{cancelled}</h3>
//             </div>
//             <FaTimesCircle className="icon" />
//           </div>
//         </Col>
//       </Row>

//       <Card className="shadow-sm border-0">
//         <CardBody>
//           <h5 className="mb-3">Order List</h5>
//           <Table className="custom-table" borderless responsive>
//             <thead className="table-light">
//               <tr>
//                 <th>ID</th>
//                 <th>Customer</th>
//                 <th>Amount</th>
//                 <th>Date</th>
//                 <th>Status</th>
//                 <th style={{ textAlign: "center" }}>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {currentData.map(item => (
//                 <tr key={item.id}>
//                   <td>#{item.id}</td>
//                   <td>{item.customer}</td>
//                   <td>₹{item.amount}</td>
//                   <td>{item.date}</td>

//                   <td>
//                     <span className={getStatusClass(item.status)}>
//                       {item.status}
//                     </span>
//                   </td>

//                   <td className="text-center">
//                     <FaEye
//                       className="me-3 cursor"
//                       onClick={() => {
//                         setSelectedOrder(item);
//                         toggleView();
//                       }}
//                     />

//                     <FaSyncAlt
//                       className="me-3 cursor"
//                       onClick={() => changeStatus(item.id)}
//                     />

//                     <FaTrash
//                       className="text-danger cursor"
//                       onClick={() => handleDelete(item.id)}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           <Pagination>
//             {[...Array(totalPages)].map((_, i) => (
//               <PaginationItem active={page === i + 1} key={i}>
//                 <PaginationLink onClick={() => setPage(i + 1)}>
//                   {i + 1}
//                 </PaginationLink>
//               </PaginationItem>
//             ))}
//           </Pagination>
//         </CardBody>
//       </Card>
//       <Modal isOpen={viewModal} toggle={toggleView}>
//         <ModalHeader toggle={toggleView}>Order Details</ModalHeader>
//         <ModalBody>
//           <p><b>Customer:</b> {selectedOrder?.customer}</p>
//           <p><b>Amount:</b> ₹{selectedOrder?.amount}</p>
//           <p><b>Date:</b> {selectedOrder?.date}</p>
//           <p><b>Status:</b> {selectedOrder?.status}</p>
//         </ModalBody>
//       </Modal>
//     </>
//   );
// };

// export default Orders;