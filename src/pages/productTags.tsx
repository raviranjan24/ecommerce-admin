import React, { useState } from "react";
import {
  Card,
  CardBody,
  Table,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

import {
  FaTags,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

interface Tag {
  id: number;
  name: string;
  products: number;
  status: "active" | "inactive";
}

const ITEMS_PER_PAGE = 5;

const ProductTags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([
    { id: 1, name: "Electronics", products: 25, status: "active" },
    { id: 2, name: "Fashion", products: 40, status: "active" },
    { id: 3, name: "Home", products: 18, status: "inactive" },
    { id: 4, name: "Sports", products: 12, status: "active" },
    { id: 5, name: "Toys", products: 9, status: "inactive" },
    { id: 6, name: "Books", products: 30, status: "active" },
  ]);

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(tags.length / ITEMS_PER_PAGE);

  const currentData = tags.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalTags = tags.length;
  const activeTags = tags.filter(t => t.status === "active").length;
  const inactiveTags = tags.filter(t => t.status === "inactive").length;
  const totalProducts = tags.reduce((sum, t) => sum + t.products, 0);
  const toggleStatus = (id: number) => {
    setTags(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: t.status === "active" ? "inactive" : "active" }
          : t
      )
    );
  };

  // Delete Tag
  const deleteTag = (id: number) => {
    if (window.confirm("Delete this tag?")) {
      setTags(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <>
      {/* 🔥 DASHBOARD BOXES */}
      <Row className="mb-4">
        <Col md="3">
          <div className="dashboard-card bg-total">
            <div>
              <h6>Total Tags</h6>
              <h3>{totalTags}</h3>
            </div>
            <FaTags className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-delivered">
            <div>
              <h6>Active Tags</h6>
              <h3>{activeTags}</h3>
            </div>
            <FaCheckCircle className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-cancelled">
            <div>
              <h6>Inactive Tags</h6>
              <h3>{inactiveTags}</h3>
            </div>
            <FaTimesCircle className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-pending">
            <div>
              <h6>Total Products</h6>
              <h3>{totalProducts}</h3>
            </div>
            <FaTag className="icon" />
          </div>
        </Col>
      </Row>

      {/* 📋 TABLE */}
      <Card className="shadow-sm border-0">
        <CardBody>
          <h5 className="mb-3">Product Tags</h5>

          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tag Name</th>
                <th>Products</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((tag) => (
                <tr key={tag.id}>
                  <td>#{tag.id}</td>
                  <td>{tag.name}</td>
                  <td>{tag.products}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`badge ${tag.status === "active"
                        ? "bg-success"
                        : "bg-danger"
                        }`}
                    >
                      {tag.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="text-center">
                    <FaEdit
                      className="cursor me-3"
                      onClick={() => alert("Edit " + tag.name)}
                    />

                    <FaTrash
                      className="cursor text-danger me-3"
                      onClick={() => deleteTag(tag.id)}
                    />

                    <span
                      className="cursor"
                      onClick={() => toggleStatus(tag.id)}
                    >
                      {tag.status === "active" ? (
                        <FaCheckCircle className="text-success" />
                      ) : (
                        <FaTimesCircle className="text-secondary" />
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
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

export default ProductTags;