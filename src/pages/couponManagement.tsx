import { useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "percent",
    expiry: "",
    status: "active",
  });

  const toggle = () => setModal(!modal);

  // Handle Input
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit
  const handleSubmit = () => {
    if (!formData.code || !formData.discount) {
      alert("Code & Discount required");
      return;
    }

    if (editId !== null) {
      const updated = coupons.map((item) =>
        item.id === editId ? { ...item, ...formData } : item
      );
      setCoupons(updated);
    } else {
      const newCoupon = {
        id: Date.now(),
        ...formData,
      };
      setCoupons([...coupons, newCoupon]);
    }

    setFormData({
      code: "",
      discount: "",
      type: "percent",
      expiry: "",
      status: "active",
    });
    setEditId(null);
    toggle();
  };

  // Edit
  const handleEdit = (item: any) => {
    setFormData(item);
    setEditId(item.id);
    toggle();
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Delete this coupon?")) {
      setCoupons(coupons.filter((item) => item.id !== id));
    }
  };

  // Stats
  const total = coupons.length;
  const active = coupons.filter((c) => c.status === "active").length;
  const expired = coupons.filter((c) => c.status === "expired").length;

  return (
    <div>
      {/* 🔲 Top Boxes */}
      <Row className="mb-3">
        <Col md={3}>
          <Card className="stat-card">
            <CardBody>
              <h6>Total Coupons</h6>
              <h4>{total}</h4>
            </CardBody>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="stat-card">
            <CardBody>
              <h6>Active</h6>
              <h4>{active}</h4>
            </CardBody>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="stat-card">
            <CardBody>
              <h6>Expired</h6>
              <h4>{expired}</h4>
            </CardBody>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="stat-card">
            <CardBody>
              <h6>Total Discount</h6>
              <h4>₹0</h4>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* 📋 Table */}
      <Card className="custom-card">
        <CardBody>
          <div className="table-header">
            <div className="table-title">Coupons</div>
            <Button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditId(null);
                toggle();
              }}
              style={{ background: "#7e6bef" }}
            >
              + Add Coupon
            </Button>
          </div>

          <Table borderless responsive className="custom-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Expiry</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No coupons available
                  </td>
                </tr>
              )}

              {coupons.map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>
                    {item.type === "percent"
                      ? `${item.discount}%`
                      : `₹${item.discount}`}
                  </td>
                  <td>{item.type}</td>
                  <td>{item.expiry || "-"}</td>

                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        background:
                          item.status === "active"
                            ? "#d4edda"
                            : "#f8d7da",
                        color:
                          item.status === "active"
                            ? "#155724"
                            : "#721c24",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="action-icons">
                      <FaEdit onClick={() => handleEdit(item)} />
                      <FaTrash
                        onClick={() => handleDelete(item.id)}
                        style={{ color: "red" }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      {/* ➕ Modal */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {editId ? "Edit Coupon" : "Add Coupon"}
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>Coupon Code</Label>
            <Input
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. SAVE50"
            />
          </FormGroup>

          <FormGroup>
            <Label>Discount</Label>
            <Input
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Enter discount"
            />
          </FormGroup>

          <FormGroup>
            <Label>Type</Label>
            <Input
              type="select"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed (₹)</option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Expiry Date</Label>
            <Input
              type="date"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Status</Label>
            <Input
              type="select"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </Input>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CouponManagement;