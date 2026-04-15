import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import {
  Card,
  CardBody,
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
} from "reactstrap";
import {
  FaEdit,
  FaTrash,
  FaShoppingCart,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

const LIMIT = 10;

const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // ===========================
  // 🔥 FETCH PRODUCTS
  // ===========================
  const fetchProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/v1/products", {
        params: {
          page: pageNumber,
          limit: LIMIT,
        },
      });

      setProducts(res?.data?.data?.products || []);
      setPagination(res?.data?.data?.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // ===========================
  // ❌ DELETE PRODUCT
  // ===========================
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      setLoading(true);

      await axiosInstance.post("/api/v1/products/remove", {
        id,
      });

      fetchProducts(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // 🔁 TOGGLE STATUS
  // ===========================
  const handleToggle = async (id: string) => {
    try {
      setLoading(true);

      await axiosInstance.patch(
        `/api/v1/products/toggle-status/${id}`
      );

      fetchProducts(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // 📊 STATS
  // ===========================
  const totalProducts = pagination?.totalProducts || 0;

  const active = products.filter((p) => p.isActive).length;
  const inactive = products.filter((p) => !p.isActive).length;

  const totalValue = products.reduce(
    (sum, p) => sum + (p?.pricing?.sell_price || 0),
    0
  );

  const totalPages = pagination?.totalPages || 1;

  return (
    <Card className="shadow-sm border-0">
      <CardBody>

        {/* 🔥 STATS */}
        <Row className="mb-3">
          <Col md="3">
            <Card style={{ background: "#7e6bef" }}>
              <CardBody className="text-white d-flex justify-content-between">
                <div>
                  <div style={{ fontSize: 13 }}>TOTAL PRODUCTS</div>
                  <div style={{ fontSize: 24, fontWeight: "bold" }}>
                    {totalProducts}
                  </div>
                </div>
                <FaShoppingCart />
              </CardBody>
            </Card>
          </Col>

          <Col md="3">
            <Card style={{ background: "#3ac569" }}>
              <CardBody className="text-white">
                <div>ACTIVE</div>
                <div style={{ fontSize: 24 }}>{active}</div>
              </CardBody>
            </Card>
          </Col>

          <Col md="3">
            <Card style={{ background: "#ff3b3b" }}>
              <CardBody className="text-white">
                <div>INACTIVE</div>
                <div style={{ fontSize: 24 }}>{inactive}</div>
              </CardBody>
            </Card>
          </Col>

          <Col md="3">
            <Card style={{ background: "#2fa4c6" }}>
              <CardBody className="text-white d-flex justify-content-between">
                <div>
                  <div>PAGE VALUE</div>
                  <div style={{ fontSize: 24 }}>₹{totalValue}</div>
                </div>
                <FaIndianRupeeSign />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h5>Products</h5>
          <Button onClick={() => navigate("/add-product")}  style={{ background: "#7e6bef" }}>
            + Add Product
          </Button>
        </div>
        {loading && (
          <div style={{ textAlign: "center", padding: 10 }}>
            <div className="spinner-border text-primary" />
          </div>
        )}
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={item?.images?.main}
                    style={{ width: 60, height: 50 }}
                  />
                </td>
                <td>{item.title}</td>
                <td>{item?.category?.title}</td>
                <td>
                  ₹{item?.pricing?.sell_price}
                  <br />
                  <small style={{ textDecoration: "line-through" }}>
                    ₹{item?.pricing?.regular_price}
                  </small>
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      background: item.isActive
                        ? "#d1fae5"
                        : "#fee2e2",
                    }}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <FaEdit
                    onClick={() =>
                      navigate(`/edit-product/${item._id}`)
                    }
                    style={{ marginRight: 10, cursor: "pointer" }}
                  />
                  <FaTrash
                    onClick={() => handleDelete(item._id)}
                    style={{
                      color: "red",
                      marginRight: 10,
                      cursor: "pointer",
                    }}
                  />
                  {item.isActive ? (
                    <FaToggleOn
                      color="green"
                      onClick={() => handleToggle(item._id)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <FaToggleOff
                      onClick={() => handleToggle(item._id)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div style={{ textAlign: "center" }}>
          <Pagination size="sm">
            <PaginationItem disabled={!pagination?.hasPrev}>
              <PaginationLink
                previous
                onClick={() => setPage(page - 1)}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem active={page === i + 1} key={i}>
                <PaginationLink onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem disabled={!pagination?.hasNext}>
              <PaginationLink
                next
                onClick={() => setPage(page + 1)}
              />
            </PaginationItem>
          </Pagination>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductList;