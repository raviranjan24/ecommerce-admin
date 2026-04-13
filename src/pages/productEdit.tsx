import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { Card, CardBody, Row, Col, Input, Button } from "reactstrap";

const COLORS = ["bg-red", "bg-blue", "bg-green", "bg-black", "bg-yellow"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [preview, setPreview] = useState<any>({});

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

  // ===========================
  // 🔥 FETCH DATA
  // ===========================
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(`/api/v1/products/single/${id}`);
      const p = res?.data?.data?.product;

      setForm({
        title: p.title || "",
        description: p.description || "",
        regular_price: p.pricing?.regular_price || "",
        sell_price: p.pricing?.sell_price || "",
        category: p.category?._id || "",
        sku: p.inventory?.sku || "",
        stock_quantity: p.inventory?.stock_quantity || "",
        colors: p.variants?.colors?.map((c: any) => c.bg) || [],
        sizes: p.variants?.sizes || [],
        depth: p.variants?.depth || "",
        height: p.dimensions_and_weight?.height?.replace(" cm", "") || "",
        width: p.dimensions_and_weight?.width?.replace(" cm", "") || "",
        length: p.dimensions_and_weight?.length?.replace(" cm", "") || "",
        weight: p.dimensions_and_weight?.weight?.replace(" kg", "") || "",
      });

      // Existing image preview
      setPreview({
        image1: p.images?.main || "",
        image2: p.images?.hover || "",
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await axiosInstance.get("/api/category/admin/list");
    setCategories(res?.data?.data || []);
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  // ===========================
  // HANDLERS
  // ===========================
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

  // ===========================
  // UPDATE API
  // ===========================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      // BASIC
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

      // INVENTORY
      data.append(
        "inventory",
        JSON.stringify({
          sku: form.sku,
          availability: "In Stock",
          stock_quantity: Number(form.stock_quantity),
        })
      );

      // VARIANTS
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

      // DELIVERY
      data.append(
        "delivery",
        JSON.stringify({
          estimated_delivery: "3-5 business days",
        })
      );

      // DIMENSIONS
      data.append(
        "dimensions_and_weight",
        JSON.stringify({
          length: form.length + " cm",
          width: form.width + " cm",
          height: form.height + " cm",
          weight: form.weight + " kg",
        })
      );

      // IMAGES
      ["image1", "image2", "image3", "image4", "image5"].forEach((key) => {
        if (form[key]) data.append(key, form[key]);
      });

      await axiosInstance.put(`/api/v1/products/update/${id}`, data);

      alert("Product Updated ✅");
      navigate("/products");

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <CardBody>
        <h5>Edit Product</h5>

        <Row>
          <Col md={6}>
            <Input name="title" value={form.title} onChange={handleChange} />
          </Col>

          <Col md={6}>
            <Input type="select" name="category" value={form.category} onChange={handleChange}>
              <option>Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </Input>
          </Col>

          <Col md={12} className="mt-2">
            <Input type="textarea" name="description" value={form.description} onChange={handleChange} />
          </Col>

          <Col md={6} className="mt-2">
            <Input name="regular_price" value={form.regular_price} onChange={handleChange} />
          </Col>

          <Col md={6} className="mt-2">
            <Input name="sell_price" value={form.sell_price} onChange={handleChange} />
          </Col>

          <Col md={6} className="mt-2">
            <Input name="sku" value={form.sku} onChange={handleChange} />
          </Col>

          <Col md={6} className="mt-2">
            <Input name="stock_quantity" value={form.stock_quantity} onChange={handleChange} />
          </Col>

          {/* DIMENSIONS */}
          <Col md={4}><Input name="height" value={form.height} onChange={handleChange} placeholder="Height" /></Col>
          <Col md={4}><Input name="width" value={form.width} onChange={handleChange} placeholder="Width" /></Col>
          <Col md={4}><Input name="length" value={form.length} onChange={handleChange} placeholder="Length" /></Col>

          <Col md={6}><Input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight" /></Col>
          <Col md={6}><Input name="depth" value={form.depth} onChange={handleChange} placeholder="Depth" /></Col>

          {/* COLORS */}
          <Col md={6}>
            {COLORS.map((c) => (
              <span key={c} onClick={() => handleMultiSelect(c, "colors")}>
                {c}
              </span>
            ))}
          </Col>

          {/* SIZES */}
          <Col md={6}>
            {SIZES.map((s) => (
              <span key={s} onClick={() => handleMultiSelect(s, "sizes")}>
                {s}
              </span>
            ))}
          </Col>

          {/* IMAGES */}
          {["image1", "image2", "image3", "image4", "image5"].map((key) => (
            <Col md={4} key={key}>
              <Input type="file" onChange={(e) => handleImage(e, key)} />
              {preview[key] && <img src={preview[key]} style={{ width: 80 }} />}
            </Col>
          ))}
        </Row>

        <Button className="mt-3" onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </Button>
      </CardBody>
    </Card>
  );
};

export default EditProduct;