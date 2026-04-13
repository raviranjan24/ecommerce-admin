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

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h5>Products</h5>
          <Button onClick={() => navigate("/add-product")}>
            + Add Product
          </Button>
        </div>

        {/* Loader */}
        {loading && (
          <div style={{ textAlign: "center", padding: 10 }}>
            <div className="spinner-border text-primary" />
          </div>
        )}

        {/* Table */}
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

                {/* STATUS */}
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

                {/* ACTION */}
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

        {/* Pagination */}
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

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Card,
//   CardBody,
//   Table,
//   Button,
//   Pagination,
//   PaginationItem,
//   PaginationLink,
//   Row,
//   Col,
// } from "reactstrap";
// import {
//   FaEdit,
//   FaTrash,
//   FaEye,
//   FaToggleOn,
//   FaToggleOff,
//   FaShoppingCart,
//   FaTimesCircle,
//   FaSyncAlt,
// } from "react-icons/fa";
// import { FaIndianRupeeSign } from "react-icons/fa6";

// const ITEMS_PER_PAGE = 5;

// const ProductList = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState<any[]>([
//     {
//       id: 1,
//       title: "Men's Premium Cotton T-Shirt",
//       image: "https://via.placeholder.com/80",
//       price: 699,
//       status: "active",
//     },
//     {
//       id: 2,
//       title: "Casual Shirt",
//       image: "https://via.placeholder.com/80",
//       price: 999,
//       status: "inactive",
//     },
//     {
//       id: 3,
//       title: "Jeans Pant",
//       image: "https://via.placeholder.com/80",
//       price: 1499,
//       status: "active",
//     },
//     {
//       id: 4,
//       title: "Hoodie",
//       image: "https://via.placeholder.com/80",
//       price: 1299,
//       status: "active",
//     },
//     {
//       id: 5,
//       title: "Jacket",
//       image: "https://via.placeholder.com/80",
//       price: 1999,
//       status: "inactive",
//     },
//     {
//       id: 6,
//       title: "Sneakers",
//       image: "https://via.placeholder.com/80",
//       price: 2499,
//       status: "active",
//     },
//   ]);

//   const [page, setPage] = useState(1);

//   // 📊 Stats Calculation
//   const total = products.length;
//   const active = products.filter((p) => p.status === "active").length;
//   const inactive = products.filter((p) => p.status !== "active").length;
//   const totalValue = products.reduce((sum, p) => sum + p.price, 0);

//   // 📄 Pagination
//   const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

//   const data = products.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE
//   );

//   // 🔁 Status Toggle
//   const toggleStatus = (id: number) => {
//     setProducts((prev) =>
//       prev.map((p) =>
//         p.id === id
//           ? {
//             ...p,
//             status: p.status === "active" ? "inactive" : "active",
//           }
//           : p
//       )
//     );
//   };

//   // ❌ Delete
//   const handleDelete = (id: number) => {
//     if (window.confirm("Delete this product?")) {
//       setProducts((prev) => prev.filter((p) => p.id !== id));
//     }
//   };

//   return (
//     <Card className="custom-card">
//       <CardBody>
//         {/* 🔥 TOP INFO BOXES */}
//         <Row className="mb-3">
//           {/* Total */}
//           <Col md="3">
//             <Card className="stat-card" style={{ background: "#7e6bef" }}>
//               <CardBody className="d-flex justify-content-between align-items-center text-white">
//                 <div>
//                   <div style={{ fontSize: "13px" }}>TOTAL PRODUCTS</div>
//                   <div style={{ fontSize: "24px", fontWeight: "bold" }}>
//                     {total}
//                   </div>
//                 </div>
//                 <FaShoppingCart size={24} />
//               </CardBody>
//             </Card>
//           </Col>

//           {/* Active */}
//           <Col md="3">
//             <Card className="stat-card" style={{ background: "#3ac569" }}>
//               <CardBody className="d-flex justify-content-between align-items-center text-white">
//                 <div>
//                   <div style={{ fontSize: "13px" }}>ACTIVE PRODUCTS</div>
//                   <div style={{ fontSize: "24px", fontWeight: "bold" }}>
//                     {active}
//                   </div>
//                 </div>
//                 <FaSyncAlt size={24} />
//               </CardBody>
//             </Card>
//           </Col>

//           {/* Inactive */}
//           <Col md="3">
//             <Card className="stat-card" style={{ background: "#ff3b3b" }}>
//               <CardBody className="d-flex justify-content-between align-items-center text-white">
//                 <div>
//                   <div style={{ fontSize: "13px" }}>INACTIVE PRODUCTS</div>
//                   <div style={{ fontSize: "24px", fontWeight: "bold" }}>
//                     {inactive}
//                   </div>
//                 </div>
//                 <FaTimesCircle size={24} />
//               </CardBody>
//             </Card>
//           </Col>

//           {/* Total Value */}
//           <Col md="3">
//             <Card className="stat-card" style={{ background: "#2fa4c6" }}>
//               <CardBody className="d-flex justify-content-between align-items-center text-white">
//                 <div>
//                   <div style={{ fontSize: "13px" }}>TOTAL VALUE</div>
//                   <div style={{ fontSize: "24px", fontWeight: "bold" }}>
//                     ₹{totalValue}
//                   </div>
//                 </div>
//                 <FaIndianRupeeSign size={24} />
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>

//         {/* Header */}
//         <div className="table-header">
//           <div className="table-title">Products</div>
//           <Button
//             style={{ background: "#7e6bef" }}
//             onClick={() => navigate("/add-product")}
//           >
//             + Add Product
//           </Button>
//         </div>

//         {/* Table */}
//         <Table borderless responsive className="custom-table">
//           <thead>
//             <tr>
//               <th>Image</th>
//               <th>Title</th>
//               <th>Price</th>
//               <th>Status</th>
//               <th style={{ textAlign: "center" }}>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.map((item) => (
//               <tr key={item.id}>
//                 <td>
//                   <img
//                     src={item.image}
//                     alt=""
//                     style={{
//                       width: "60px",
//                       height: "50px",
//                       objectFit: "cover",
//                       borderRadius: "6px",
//                     }}
//                   />
//                 </td>

//                 <td>{item.title}</td>
//                 <td>₹{item.price}</td>

//                 <td>
//                   <span
//                     className={`status-badge ${item.status === "active"
//                       ? "status-delivered"
//                       : "status-processing"
//                       }`}
//                   >
//                     {item.status}
//                   </span>
//                 </td>

//                 <td>
//                   <div className="action-icons">
//                     <FaEye title="View" />
//                     <FaEdit
//                       title="Edit"
//                       onClick={() => navigate(`/edit-product/${item.id}`)}
//                     />
//                     <FaTrash
//                       title="Delete"
//                       style={{ color: "red" }}
//                       onClick={() => handleDelete(item.id)}
//                     />

//                     {item.status === "active" ? (
//                       <FaToggleOn
//                         style={{ color: "green" }}
//                         onClick={() => toggleStatus(item.id)}
//                       />
//                     ) : (
//                       <FaToggleOff
//                         onClick={() => toggleStatus(item.id)}
//                       />
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>

//         {/* Pagination */}
//         <div className="custom-pagination">
//           <Pagination size="sm">
//             {[...Array(totalPages)].map((_, i) => (
//               <PaginationItem active={page === i + 1} key={i}>
//                 <PaginationLink onClick={() => setPage(i + 1)}>
//                   {i + 1}
//                 </PaginationLink>
//               </PaginationItem>
//             ))}
//           </Pagination>
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

// export default ProductList;