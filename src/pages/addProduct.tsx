import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import {
  Card,
  CardBody,
  Row,
  Col,
  Input,
  Button,
  Label,
  FormGroup,
} from "reactstrap";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [preview, setPreview] = useState<any>({});
  const [form, setForm] = useState<any>({
    title: "",
    slug: "",
    description: "",
    category: "",
    regular_price: "",
    sell_price: "",
    currency: "INR",
    sku: "",
    stock_quantity: "",
    availability: "In Stock",
    colors: [],
    sizes: [],
    estimated_delivery: "3-5 business days",
    depth: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/category/admin/list");
      setCategories(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: value,
      ...(name === "title"
        ? {
          slug: generateSlug(value),
        }
        : {}),
    }));
  };

  const handleImage = (e: any, key: string) => {
    const file = e.target.files[0];

    if (!file) return;

    setForm((prev: any) => ({
      ...prev,
      [key]: file,
    }));

    setPreview((prev: any) => ({
      ...prev,
      [key]: URL.createObjectURL(file),
    }));
  };

  const addColor = () => {
    if (!colorInput.trim()) return;

    if (form.colors.includes(colorInput.trim())) {
      toast.warning("Color already added");
      return;
    }

    setForm((prev: any) => ({
      ...prev,
      colors: [...prev.colors, colorInput.trim()],
    }));

    setColorInput("");
  };

  const removeColor = (color: string) => {
    setForm((prev: any) => ({
      ...prev,
      colors: prev.colors.filter((c: string) => c !== color),
    }));
  };

  const addSize = () => {
    if (!sizeInput.trim()) return;

    if (form.sizes.includes(sizeInput.trim())) {
      toast.warning("Size already added");
      return;
    }

    setForm((prev: any) => ({
      ...prev,
      sizes: [...prev.sizes, sizeInput.trim()],
    }));

    setSizeInput("");
  };

  const removeSize = (size: string) => {
    setForm((prev: any) => ({
      ...prev,
      sizes: prev.sizes.filter((s: string) => s !== size),
    }));
  };

  const discountPercentage = useMemo(() => {
    if (!form.regular_price || !form.sell_price) return 0;

    const regular = Number(form.regular_price);
    const sell = Number(form.sell_price);

    if (regular <= 0) return 0;

    return Math.round(((regular - sell) / regular) * 100);
  }, [form.regular_price, form.sell_price]);

  const handleSubmit = async () => {
    try {
      if (!form.title) {
        toast.error("Title is required");
        return;
      }

      if (!form.description) {
        toast.error("Description is required");
        return;
      }

      if (!form.category) {
        toast.error("Category is required");
        return;
      }

      if (!form.regular_price) {
        toast.error("Regular price is required");
        return;
      }

      if (!form.image1) {
        toast.error("Main image is required");
        return;
      }

      setLoading(true);

      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);

      data.append("category", form.category);

      data.append("regular_price", form.regular_price);

      data.append(
        "discount_percentage",
        discountPercentage.toString()
      );

      data.append("currency", form.currency);

      data.append("slug", form.slug);

      data.append(
        "variants",
        JSON.stringify({
          colors: form.colors.map((color: string, index: number) => ({
            name: color,
            bg: color,
            active: index === 0,
          })),

          sizes: form.sizes,

          depth: form.depth ? `${form.depth} cm` : "",
        })
      );

      data.append(
        "delivery",
        JSON.stringify({
          estimated_delivery: form.estimated_delivery,
        })
      );

      data.append(
        "inventory",
        JSON.stringify({
          sku: form.sku,
          availability: form.availability,
          stock_quantity: Number(form.stock_quantity || 0),
        })
      );

      data.append(
        "dimensions_and_weight",
        JSON.stringify({
          length: form.length ? `${form.length} cm` : "",
          width: form.width ? `${form.width} cm` : "",
          height: form.height ? `${form.height} cm` : "",
          weight: form.weight ? `${form.weight} kg` : "",
        })
      );

      ["image1", "image2", "image3", "image4", "image5"].forEach(
        (key) => {
          if (form[key]) {
            data.append(key, form[key]);
          }
        }
      );

      await axiosInstance.post("/api/v1/products/add", data);

      toast.success("Product Added Successfully");

      navigate("/products");
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <Card className="border-0 shadow-sm">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="mb-1">Add Product</h3>
              <p className="text-muted mb-0">
                Create and publish a new product
              </p>
            </div>
          </div>

          <Row>
            {/* TITLE */}
            <Col md={8} className="mb-3">
              <FormGroup>
                <Label>
                  Product Title <span className="text-danger">*</span>
                </Label>

                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter product title"
                />
              </FormGroup>
            </Col>

            {/* SLUG */}
            <Col md={4} className="mb-3">
              <FormGroup>
                <Label>Slug</Label>

                <Input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="product-slug"
                />
              </FormGroup>
            </Col>

            {/* CATEGORY */}
            <Col md={6} className="mb-3">
              <FormGroup>
                <Label>
                  Category <span className="text-danger">*</span>
                </Label>

                <Input
                  type="select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>

                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>

            {/* CURRENCY */}
            <Col md={3} className="mb-3">
              <FormGroup>
                <Label>Currency</Label>

                <Input
                  type="select"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </Input>
              </FormGroup>
            </Col>

            {/* DELIVERY */}
            <Col md={3} className="mb-3">
              <FormGroup>
                <Label>Delivery Time</Label>

                <Input
                  name="estimated_delivery"
                  value={form.estimated_delivery}
                  onChange={handleChange}
                  placeholder="3-5 business days"
                />
              </FormGroup>
            </Col>

            {/* DESCRIPTION */}
            <Col md={12} className="mb-4">
              <Label>
                Description <span className="text-danger">*</span>
              </Label>

              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <CKEditor
                  editor={ClassicEditor as any}
                  data={form.description}
                  onReady={(editor: any) => {
                    editor.editing.view.change((writer: any) => {
                      writer.setStyle(
                        "height",
                        "400px",
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
                  onChange={(editor: any) => {
                    const data = editor.getData();

                    setForm((prev: any) => ({
                      ...prev,
                      description: data,
                    }));
                  }}
                />
              </div>
            </Col>

            {/* PRICES */}
            <Col md={4} className="mb-3">
              <FormGroup>
                <Label>
                  Regular Price <span className="text-danger">*</span>
                </Label>

                <Input
                  type="number"
                  name="regular_price"
                  value={form.regular_price}
                  onChange={handleChange}
                  placeholder="0"
                />
              </FormGroup>
            </Col>

            <Col md={4} className="mb-3">
              <FormGroup>
                <Label>Sell Price</Label>

                <Input
                  type="number"
                  name="sell_price"
                  value={form.sell_price}
                  onChange={handleChange}
                  placeholder="0"
                />
              </FormGroup>
            </Col>

            <Col md={4} className="mb-3">
              <FormGroup>
                <Label>Discount</Label>

                <Input
                  value={`${discountPercentage}% OFF`}
                  disabled
                />
              </FormGroup>
            </Col>

            {/* INVENTORY */}
            <Col md={4} className="mb-3">
              <FormGroup>
                <Label>SKU</Label>

                <Input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="SKU-001"
                />
              </FormGroup>
            </Col>

            <Col md={4} className="mb-3">
              <FormGroup>
                <Label>Stock Quantity</Label>

                <Input
                  type="number"
                  name="stock_quantity"
                  value={form.stock_quantity}
                  onChange={handleChange}
                  placeholder="100"
                />
              </FormGroup>
            </Col>

            <Col md={4} className="mb-3">
              <FormGroup>
                <Label>Availability</Label>

                <Input
                  type="select"
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out Of Stock">
                    Out Of Stock
                  </option>
                  <option value="Pre Order">Pre Order</option>
                </Input>
              </FormGroup>
            </Col>

            {/* COLORS */}
            <Col md={6} className="mb-4">
              <Label>Colors</Label>

              <div className="d-flex gap-2">
                <Input
                  value={colorInput}
                  onChange={(e) =>
                    setColorInput(e.target.value)
                  }
                  placeholder="Add color e.g. Red"
                />

                <Button
                  color="dark"
                  type="button"
                  onClick={addColor}
                >
                  Add
                </Button>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-3">
                {form.colors.map((color: string) => (
                  <div
                    key={color}
                    className="d-flex align-items-center gap-2"
                    style={{
                      background: "#f1f1f1",
                      padding: "6px 12px",
                      borderRadius: 30,
                    }}
                  >
                    <span>{color}</span>

                    <span
                      style={{
                        cursor: "pointer",
                        color: "red",
                        fontWeight: 700,
                      }}
                      onClick={() => removeColor(color)}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </Col>

            {/* SIZES */}
            <Col md={6} className="mb-4">
              <Label>Sizes</Label>

              <div className="d-flex gap-2">
                <Input
                  value={sizeInput}
                  onChange={(e) =>
                    setSizeInput(e.target.value)
                  }
                  placeholder="Add size e.g. XL"
                />

                <Button
                  color="dark"
                  type="button"
                  onClick={addSize}
                >
                  Add
                </Button>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-3">
                {form.sizes.map((size: string) => (
                  <div
                    key={size}
                    className="d-flex align-items-center gap-2"
                    style={{
                      background: "#f1f1f1",
                      padding: "6px 12px",
                      borderRadius: 30,
                    }}
                  >
                    <span>{size}</span>

                    <span
                      style={{
                        cursor: "pointer",
                        color: "red",
                        fontWeight: 700,
                      }}
                      onClick={() => removeSize(size)}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </Col>

            {/* DIMENSIONS */}
            <Col md={3} className="mb-3">
              <FormGroup>
                <Label>Length (cm)</Label>

                <Input
                  name="length"
                  value={form.length}
                  onChange={handleChange}
                  placeholder="10"
                />
              </FormGroup>
            </Col>

            <Col md={3} className="mb-3">
              <FormGroup>
                <Label>Width (cm)</Label>

                <Input
                  name="width"
                  value={form.width}
                  onChange={handleChange}
                  placeholder="10"
                />
              </FormGroup>
            </Col>

            <Col md={3} className="mb-3">
              <FormGroup>
                <Label>Height (cm)</Label>

                <Input
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  placeholder="10"
                />
              </FormGroup>
            </Col>

            <Col md={3} className="mb-3">
              <FormGroup>
                <Label>Weight (kg)</Label>

                <Input
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="1"
                />
              </FormGroup>
            </Col>

            {/* PRODUCT IMAGES */}
            <Col md={12} className="mt-3 mb-2">
              <h5>Product Images</h5>
            </Col>

            {[
              "image1",
              "image2",
              "image3",
              "image4",
              "image5",
            ].map((key, index) => (
              <Col md={4} lg={3} className="mb-4" key={key}>
                <Card className="border shadow-sm h-100">
                  <CardBody>
                    <Label className="fw-bold">
                      {index === 0
                        ? "Main Image *"
                        : `Image ${index + 1}`}
                    </Label>

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImage(e, key)
                      }
                    />

                    <div
                      className="mt-3 d-flex align-items-center justify-content-center"
                      style={{
                        height: 180,
                        border: "1px dashed #ddd",
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "#fafafa",
                      }}
                    >
                      {preview[key] ? (
                        <img
                          src={preview[key]}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span className="text-muted">
                          No Image
                        </span>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}

            {/* BUTTON */}
            <Col md={12} className="mt-2">
              <Button
                color="primary"
                size="sm"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? "Saving Product..."
                  : "Save Product"}
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddProduct;