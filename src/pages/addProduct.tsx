import { useState } from "react";
import { Card, CardBody, Row, Col, Input, Button } from "reactstrap";

const AddProduct = () => {
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    regular_price: "",
    sell_price: "",
    sku: "",
    stock: "",
    colors: "",
    sizes: "",
    image: null,
    video: null,
  });

  const [preview, setPreview] = useState<any>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleVideo = (e: any) => {
    const file = e.target.files[0];
    setForm({ ...form, video: file });
  };

  const handleSubmit = () => {
    console.log(form);
    alert("Product Added");
  };

  return (
    <Card className="custom-card">
      <CardBody>
        <h5>Add Product</h5>

        <Row>
          <Col md={6}>
            <Input
              placeholder="Product Title"
              name="title"
              onChange={handleChange}
            />
          </Col>

          <Col md={6}>
            <Input
              placeholder="SKU"
              name="sku"
              onChange={handleChange}
            />
          </Col>

          <Col md={12} className="mt-2">
            <Input
              type="textarea"
              placeholder="Description"
              name="description"
              onChange={handleChange}
            />
          </Col>

          <Col md={6} className="mt-2">
            <Input
              placeholder="Regular Price"
              name="regular_price"
              onChange={handleChange}
            />
          </Col>

          <Col md={6} className="mt-2">
            <Input
              placeholder="Sell Price"
              name="sell_price"
              onChange={handleChange}
            />
          </Col>

          <Col md={6} className="mt-2">
            <Input
              placeholder="Stock Quantity"
              name="stock"
              onChange={handleChange}
            />
          </Col>

          <Col md={6} className="mt-2">
            <Input
              placeholder="Colors (comma separated)"
              name="colors"
              onChange={handleChange}
            />
          </Col>

          <Col md={6} className="mt-2">
            <Input
              placeholder="Sizes (S,M,L)"
              name="sizes"
              onChange={handleChange}
            />
          </Col>

          <Col md={6} className="mt-2">
            <Input type="file" onChange={handleImage} />
            {preview && (
              <img src={preview} style={{ width: "100px" }} />
            )}
          </Col>

          <Col md={6} className="mt-2">
            <Input type="file" onChange={handleVideo} />
          </Col>
        </Row>

        <Button
          className="mt-3"
          style={{ background: "#7e6bef" }}
          onClick={handleSubmit}
        >
          Save Product
        </Button>
      </CardBody>
    </Card>
  );
};

export default AddProduct;