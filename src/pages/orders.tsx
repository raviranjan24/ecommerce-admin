import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import {
  Card,
  CardBody,
  Table,
  Row,
  Col,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import {
  FaTrash,
  FaShoppingCart,
  FaClock,
  FaTimesCircle,
  FaEye,
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
  const [updatingId, setUpdatingId] = useState("");

  // VIEW ORDER
  const [viewModal, setViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // =========================
  // FETCH ALL ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.post("/api/order/list");

      setOrders(res?.data?.orders || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // VIEW SINGLE ORDER
  // =========================
  const handleViewOrder = async (orderId: string) => {
    try {
      setViewLoading(true);
      setViewModal(true);

      const res = await axiosInstance.get(
        `/api/order/${orderId}`
      );

      setSelectedOrder(res?.data?.order);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch order details");
    } finally {
      setViewLoading(false);
    }
  };

  // =========================
  // STATUS UPDATE
  // =========================
  const handleStatusChange = async (
    orderId: string,
    status: string
  ) => {
    try {
      setUpdatingId(orderId);

      await axiosInstance.post("/api/order/status", {
        orderId,
        status,
      });

      setOrders((prev) =>
        prev.map((item) =>
          item._id === orderId
            ? { ...item, status }
            : item
        )
      );

      // UPDATE MODAL DATA ALSO
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status,
        });
      }

    } catch (err) {
      console.log(err);
      alert("Status update failed");
    } finally {
      setUpdatingId("");
    }
  };

  // =========================
  // DELETE ORDER
  // =========================
  const handleDelete = async (orderId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      setUpdatingId(orderId);

      await axiosInstance.delete(
        `/api/order/delete/${orderId}`
      );

      setOrders((prev) =>
        prev.filter((item) => item._id !== orderId)
      );

      setViewModal(false);

      alert("Order deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    } finally {
      setUpdatingId("");
    }
  };

  // =========================
  // STATUS BADGE COLOR
  // =========================
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "warning";

      case "Processing":
        return "info";

      case "Shipping":
        return "primary";

      case "Delivered":
        return "success";

      case "Cancelled":
        return "danger";

      default:
        return "secondary";
    }
  };

  // =========================
  // COUNTS
  // =========================
  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const cancelledOrders = orders.filter(
    (o) => o.status === "Cancelled"
  ).length;

  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  return (
    <>
      {/* DASHBOARD */}

      <Row className="mb-4 g-3">

        <Col md="4">
          <div className="dashboard-card gradient-yellow" style={{background:"linear-gradient(135deg, #911, #ef3838)"}}>
            <div className="card-content">
              <p>PENDING</p>
              <h2>{pendingOrders}</h2>
            </div>

            <div className="card-icon">
              <FaClock />
            </div>
          </div>
        </Col>

        <Col md="4">
          <div className="dashboard-card gradient-green">
            <div className="card-content">
              <p>DELIVERED</p>
              <h2>{deliveredOrders}</h2>
            </div>

            <div className="card-icon">
              <FaShoppingCart />
            </div>
          </div>
        </Col>

        <Col md="4">
          <div className="dashboard-card gradient-red">
            <div className="card-content">
              <p>CANCELLED</p>
              <h2>{cancelledOrders}</h2>
            </div>

            <div className="card-icon">
              <FaTimesCircle />
            </div>
          </div>
        </Col>

      </Row>

      {/* ORDER TABLE */}

      <Card className="shadow border-0">
        <CardBody>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">
              Order Management
            </h4>

            <Badge color="dark" pill>
              Total Orders : {orders.length}
            </Badge>
          </div>

          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <Table
              responsive
              hover
              bordered
              className="align-middle"
            >
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Order No</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {orders?.length > 0 ? (
                  orders.map((item, index) => (
                    <tr key={item._id}>

                      <td>{index + 1}</td>

                      <td>
                        <strong>
                          {item.orderNumber}
                        </strong>
                      </td>

                      <td>
                        {item?.shippingAddress?.fullName ||
                          "N/A"}
                        <br />

                        <small>
                          {item?.shippingAddress?.phone}
                        </small>
                      </td>

                      <td>
                        {item.items?.length} Items
                      </td>

                      <td>
                        <strong>
                          ₹{item.total}
                        </strong>
                      </td>

                      <td>
                        <div>
                          <strong>
                            {item.paymentMethod}
                          </strong>
                        </div>

                        <small
                          className={
                            item.paymentStatus === "Paid"
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {item.paymentStatus}
                        </small>
                      </td>

                      {/* STATUS */}
                      <td>
                        <div className="d-flex flex-column gap-2">

                          <Badge
                            color={getBadgeColor(item.status)}
                            pill
                            style={{
                              width: "fit-content",
                              fontSize: 12,
                            }}
                          >
                            {item.status}
                          </Badge>

                          <select
                            className="form-select form-select-sm"
                            value={item.status}
                            disabled={
                              updatingId === item._id
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                item._id,
                                e.target.value
                              )
                            }
                          >
                            {STATUS_OPTIONS.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </td>

                      <td>
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}
                      </td>

                      {/* ACTION */}
                      <td>

                        <div className="d-flex gap-2">

                          {/* VIEW */}
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() =>
                              handleViewOrder(item.orderNumber)
                            }
                          >
                            <FaEye />
                          </Button>

                          {/* DELETE */}
                          <Button
                            color="danger"
                            size="sm"
                            disabled={
                              updatingId === item._id
                            }
                            onClick={() =>
                              handleDelete(item._id)
                            }
                          >
                            <FaTrash />
                          </Button>

                        </div>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-5"
                    >
                      No Orders Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* ========================================= */}
      {/* VIEW ORDER MODAL */}
      {/* ========================================= */}

      <Modal
        isOpen={viewModal}
        toggle={() => setViewModal(false)}
        size="lg"
      >
        <ModalHeader toggle={() => setViewModal(false)}>
          Order Details
        </ModalHeader>

        <ModalBody>

          {viewLoading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : selectedOrder ? (
            <>

              {/* ORDER INFO */}

              <Row className="mb-4">

                <Col md="6">
                  <h6>Order Information</h6>

                  <p className="mb-1">
                    <strong>Order No:</strong>{" "}
                    {selectedOrder.orderNumber}
                  </p>

                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <Badge
                      color={getBadgeColor(
                        selectedOrder.status
                      )}
                    >
                      {selectedOrder.status}
                    </Badge>
                  </p>

                  <p className="mb-1">
                    <strong>Payment:</strong>{" "}
                    {selectedOrder.paymentMethod}
                  </p>

                  <p className="mb-1">
                    <strong>Payment Status:</strong>{" "}
                    {selectedOrder.paymentStatus}
                  </p>

                  <p className="mb-1">
                    <strong>Date:</strong>{" "}
                    {new Date(
                      selectedOrder.createdAt
                    ).toLocaleString()}
                  </p>
                </Col>

                <Col md="6">
                  <h6>Shipping Address</h6>

                  <p className="mb-1">
                    <strong>Name:</strong>{" "}
                    {
                      selectedOrder?.shippingAddress
                        ?.fullName
                    }
                  </p>

                  <p className="mb-1">
                    <strong>Phone:</strong>{" "}
                    {
                      selectedOrder?.shippingAddress
                        ?.phone
                    }
                  </p>

                  <p className="mb-1">
                    <strong>Address:</strong>{" "}
                    {
                      selectedOrder?.shippingAddress
                        ?.address
                    }
                  </p>

                  <p className="mb-1">
                    <strong>City:</strong>{" "}
                    {
                      selectedOrder?.shippingAddress
                        ?.city
                    }
                  </p>

                  <p className="mb-1">
                    <strong>Pincode:</strong>{" "}
                    {
                      selectedOrder?.shippingAddress
                        ?.pincode
                    }
                  </p>
                </Col>

              </Row>

              {/* PRODUCTS */}

              <h5 className="mb-3">
                Ordered Products
              </h5>

              <Table bordered responsive>

                <thead className="table-light">
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>

                  {selectedOrder.items?.map(
                    (product: any, index: number) => (
                      <tr key={index}>

                        <td width="90">
                          <img
                            src={product.image}
                            alt=""
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        </td>

                        <td>
                          {product.name}
                        </td>

                        <td>
                          ₹{product.price}
                        </td>

                        <td>
                          {product.quantity}
                        </td>

                        <td>
                          ₹
                          {product.price *
                            product.quantity}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </Table>

              {/* FINAL TOTAL */}

              <div className="text-end mt-4">

                <h4>
                  Grand Total : ₹
                  {selectedOrder.total}
                </h4>

              </div>

            </>
          ) : (
            <div className="text-center">
              No Order Data Found
            </div>
          )}

        </ModalBody>
      </Modal>
    </>
  );
};

export default Orders;