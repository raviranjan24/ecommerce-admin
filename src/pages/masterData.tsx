import { useState } from "react";
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
} from "reactstrap";

const MasterData = () => {
  const [formData, setFormData] = useState({
    logo: null as File | null,
    email1: "",
    email2: "",
    contact1: "",
    contact2: "",
    address: "",
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = new FormData();
    data.append("logo", formData.logo as Blob);
    data.append("email1", formData.email1);
    data.append("email2", formData.email2);
    data.append("contact1", formData.contact1);
    data.append("contact2", formData.contact2);
    data.append("address", formData.address);
    console.log("Submitted Data:", formData);
    // 👉 API Call Here
    // fetch("/api/master-data", {
    //   method: "POST",
    //   body: data,
    // });
  };

  return (
    <Card className="custom-card">
      <CardBody>
        <div className="table-header">
          <div className="table-title">Master Settings</div>
        </div>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label>Upload Logo</Label>
                <Input type="file" onChange={handleFileChange} />
                {preview && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={preview}
                      alt="preview"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "contain",
                        border: "1px solid #ddd",
                        padding: "5px",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Email 1</Label>
                <Input
                  type="email"
                  name="email1"
                  value={formData.email1}
                  onChange={handleChange}
                  placeholder="Enter primary email"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Email 2</Label>
                <Input
                  type="email"
                  name="email2"
                  value={formData.email2}
                  onChange={handleChange}
                  placeholder="Enter secondary email"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Contact 1</Label>
                <Input
                  type="text"
                  name="contact1"
                  value={formData.contact1}
                  onChange={handleChange}
                  placeholder="Enter primary contact"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Contact 2</Label>
                <Input
                  type="text"
                  name="contact2"
                  value={formData.contact2}
                  onChange={handleChange}
                  placeholder="Enter secondary contact"
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>Address</Label>
                <Input
                  type="textarea"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter full address"
                />
              </FormGroup>
            </Col>
          </Row>
          <div style={{ textAlign: "right" }}>
            <Button
              type="submit"
              className="btn btn-primary"
              style={{ background: "#7e6bef" }}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default MasterData;