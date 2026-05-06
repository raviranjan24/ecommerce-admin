import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";

import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";

const MasterData = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    primaryEmail: "",
    secondaryEmail: "",
    primaryPhone: "",
    secondaryPhone: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchMasterData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/v1/master");
      if (res?.data?.success) {
        const data = res?.data?.data;
        setFormData({
          primaryEmail: data?.primaryEmail || "",
          secondaryEmail: data?.secondaryEmail || "",
          primaryPhone: data?.primaryPhone || "",
          secondaryPhone: data?.secondaryPhone || "",
          address: data?.address || "",
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        primaryEmail: formData.primaryEmail,
        secondaryEmail: formData.secondaryEmail,
        primaryPhone: formData.primaryPhone,
        secondaryPhone: formData.secondaryPhone,
        address: formData.address,
      };
      await axiosInstance.put("/api/v1/master", payload);
      toast.success("Master Data Saved Successfully");
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="custom-card border-0 shadow-sm">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 fw-bold">Master Settings</h4>
        </div>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-semibold">Primary Email</Label>
                <Input
                  type="email"
                  name="primaryEmail"
                  value={formData.primaryEmail}
                  onChange={handleChange}
                  placeholder="Enter primary email"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-semibold">Secondary Email</Label>
                <Input
                  type="email"
                  name="secondaryEmail"
                  value={formData.secondaryEmail}
                  onChange={handleChange}
                  placeholder="Enter secondary email"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-semibold">Primary Phone</Label>
                <Input
                  type="text"
                  name="primaryPhone"
                  value={formData.primaryPhone}
                  onChange={handleChange}
                  placeholder="Enter primary phone"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-semibold">Secondary Phone</Label>
                <Input
                  type="text"
                  name="secondaryPhone"
                  value={formData.secondaryPhone}
                  onChange={handleChange}
                  placeholder="Enter secondary phone"
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label className="fw-semibold">Address</Label>

                <Input
                  type="textarea"
                  rows={4}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                />
              </FormGroup>
            </Col>
          </Row>

          <div className="text-end">
            <Button
              type="submit"
              color="primary"
              disabled={loading}
              style={{
                background: "#7e6bef",
                border: "none",
                padding: "10px 24px",
                borderRadius: "8px",
              }}
            >
              {loading ? (
                <>
                  <Spinner size="sm" /> Saving...
                </>
              ) : (
                "Update Changes"
              )}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default MasterData;