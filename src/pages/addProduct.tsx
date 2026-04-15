import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { Card, CardBody, Row, Col, Input, Button } from "reactstrap";

const COLORS = [
  "bg-red",
  "bg-blue",
  "bg-green",
  "bg-black",
  "bg-yellow",
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    regular_price: "",
    sell_price: "",
    category: "",
    sku: "",
    stock_quantity: "",
    colors: [],
    sizes: [],
    depth: "",
    height: "",
    width: "",
    length: "",
    weight: "",
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  });

  const [preview, setPreview] = useState<any>({});

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/category/admin/list");
      setCategories(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultiSelect = (value: string, key: string) => {
    let arr = form[key];
    if (arr.includes(value)) {
      arr = arr.filter((v: string) => v !== value);
    } else {
      arr.push(value);
    }
    setForm({ ...form, [key]: [...arr] });
  };

  const handleImage = (e: any, key: string) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, [key]: file });
    setPreview({
      ...preview,
      [key]: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("category", form.category);
      data.append("regular_price", form.regular_price);
      data.append("currency", "INR");
      const discount =
        ((form.regular_price - form.sell_price) /
          form.regular_price) *
        100;
      data.append("discount_percentage", discount.toFixed(0));
      data.append(
        "inventory",
        JSON.stringify({
          sku: form.sku,
          availability: "In Stock",
          stock_quantity: Number(form.stock_quantity),
        })
      );
      data.append(
        "variants",
        JSON.stringify({
          colors: form.colors.map((c: string) => ({
            bg: c,
            active: true,
          })),
          sizes: form.sizes,
          depth: form.depth,
        })
      );
      data.append(
        "delivery",
        JSON.stringify({
          estimated_delivery: "3-5 business days",
        })
      );
      data.append(
        "dimensions_and_weight",
        JSON.stringify({
          length: form.length + " cm",
          width: form.width + " cm",
          height: form.height + " cm",
          weight: form.weight + " kg",
        })
      );
      ["image1", "image2", "image3", "image4", "image5"].forEach((key) => {
        if (form[key]) data.append(key, form[key]);
      });
      await axiosInstance.post("/api/v1/products/add", data);
      alert("Product Added");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <CardBody>
        <h5>Add Product</h5>
        <Row>
          <Col md={6}>
            <Input placeholder="Title" name="title" onChange={handleChange} />
          </Col>
          <Col md={6}>
            <Input
              type="select"
              name="category"
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
            </Input>
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
            <Input placeholder="Regular Price" name="regular_price" onChange={handleChange} />
          </Col>

          <Col md={6} className="mt-2">
            <Input placeholder="Sell Price" name="sell_price" onChange={handleChange} />
          </Col>

          
          <Col md={6} className="mt-2">
            <Input placeholder="SKU" name="sku" onChange={handleChange} />
          </Col>

          <Col md={6} className="mt-2">
            <Input placeholder="Stock Quantity" name="stock_quantity" onChange={handleChange} />
          </Col>

          
          <Col md={6} className="mt-3">
            <label>Colors</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {COLORS.map((color) => (
                <span
                  key={color}
                  onClick={() => handleMultiSelect(color, "colors")}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 20,
                    cursor: "pointer",
                    fontSize: 12,
                    background: form.colors.includes(color)
                      ? "#7e6bef"
                      : "#eee",
                    color: form.colors.includes(color)
                      ? "#fff"
                      : "#000",
                  }}
                >
                  {color}
                </span>
              ))}
            </div>
          </Col>

          
          <Col md={6} className="mt-3">
            <label>Sizes</label>
            <div style={{ display: "flex", gap: 8 }}>
              {SIZES.map((size) => (
                <span
                  key={size}
                  onClick={() => handleMultiSelect(size, "sizes")}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 20,
                    cursor: "pointer",
                    background: form.sizes.includes(size)
                      ? "#28a745"
                      : "#eee",
                    color: form.sizes.includes(size)
                      ? "#fff"
                      : "#000",
                  }}
                >
                  {size}
                </span>
              ))}
            </div>
          </Col>

          
          {["image1", "image2", "image3", "image4", "image5"].map((key) => (
            <Col md={4} className="mt-3" key={key}>
              <Input type="file" onChange={(e) => handleImage(e, key)} />
              {preview[key] && (
                <img src={preview[key]} style={{ width: 80, marginTop: 5 }} />
              )}
            </Col>
          ))}
        </Row>

        <Button className="mt-3" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Product"}
        </Button>
      </CardBody>
    </Card>
  );
};

export default AddProduct;