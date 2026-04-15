import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import {
  Card,
  CardBody,
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import "./order.css";

const ITEMS_PER_PAGE = 5;

const DashboardTable = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/order/list", {
        page: pageNumber,
        limit: ITEMS_PER_PAGE,
      });
      setOrders(res?.data?.orders || []);
      setTotal(res?.data?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <Card className="custom-card">
      <CardBody>
        <div className="table-header">
          <div className="table-title">Recent Orders</div>
          <Button className="btn btn-primary btn-sm" style={{ background: "#7e6bef" }}>
            View All
          </Button>
        </div>
        {loading && (
          <div style={{ textAlign: "center", padding: 10 }}>
            <div className="spinner-border text-primary" />
          </div>
        )}
        <Table className="custom-table" borderless responsive>
          <thead>
            <tr>
              <th style={{color:"#fff"}}>Order ID</th>
              <th style={{color:"#fff"}}>Payment Method</th>
              <th style={{color:"#fff"}}>Order Date</th>
              <th style={{color:"#fff"}}>Delivery Date</th>
              <th style={{color:"#fff"}}>Status</th>
              <th style={{color:"#fff"}}>Total</th>
              <th style={{ textAlign: "center",color:"#fff" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  No orders found 🚫
                </td>
              </tr>
            )}
            {orders?.map((item, i) => (
              <tr key={i}>
                <td>{item.orderNumber}</td>
                <td>{item.paymentMethod}</td>
                <td>
                  {new Date(item.createdAt).toLocaleString()}
                </td>
                <td>
                  {item.status === "Delivered"
                    ? new Date(item.updatedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <span
                    className={`status-badge status-${item.status?.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="amount">₹{item.total}</td>
                <td>
                  <div className="action-icons">
                    <FaEye />
                    <FaEdit />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="custom-pagination">
          <Pagination size="sm">
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem active={page === i + 1} key={i}>
                <PaginationLink onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </Pagination>
        </div>
      </CardBody>
    </Card>
  );
};

export default DashboardTable;