import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [preview, setPreview] = useState<any>({});
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
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

  // const fetchCategories = async () => {
  //   try {
  //     const res = await axiosInstance.get(
  //       "/api/category/admin/list"
  //     );

  //     setCategories(res?.data?.data || []);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/v1/header-categories"
      );
      setCategories(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/api/v1/products/single/${id}`
      );

      const p = res?.data?.data?.product;

      setForm({
        title: p?.title || "",

        slug: p?.slug || "",

        description: p?.description || "",

        category: p?.category?._id || "",

        regular_price:
          p?.pricing?.regular_price || "",

        sell_price: p?.pricing?.sell_price || "",

        currency: p?.pricing?.currency || "INR",

        sku: p?.inventory?.sku || "",

        stock_quantity:
          p?.inventory?.stock_quantity || "",

        availability:
          p?.inventory?.availability ||
          "In Stock",

        colors:
          p?.variants?.colors?.map(
            (c: any) => c?.bg || c?.name
          ) || [],

        sizes: p?.variants?.sizes || [],

        depth:
          p?.variants?.depth?.replace(" cm", "") ||
          "",

        estimated_delivery:
          p?.delivery?.estimated_delivery ||
          "3-5 business days",

        length:
          p?.dimensions_and_weight?.length?.replace(
            " cm",
            ""
          ) || "",

        width:
          p?.dimensions_and_weight?.width?.replace(
            " cm",
            ""
          ) || "",

        height:
          p?.dimensions_and_weight?.height?.replace(
            " cm",
            ""
          ) || "",

        weight:
          p?.dimensions_and_weight?.weight?.replace(
            " kg",
            ""
          ) || "",
      });

      setPreview({
        image1: p?.images?.main || "",
        image2: p?.images?.hover || "",
        image3: p?.images?.gallery1 || "",
        image4: p?.images?.gallery2 || "",
        image5: p?.images?.gallery3 || "",
      });
    } catch (err) {
      console.error(err);

      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
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
      toast.warning("Color already exists");
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
      colors: prev.colors.filter(
        (c: string) => c !== color
      ),
    }));
  };

  const addSize = () => {
    if (!sizeInput.trim()) return;

    if (form.sizes.includes(sizeInput.trim())) {
      toast.warning("Size already exists");
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
      sizes: prev.sizes.filter(
        (s: string) => s !== size
      ),
    }));
  };

  const discountPercentage = useMemo(() => {
    if (!form.regular_price || !form.sell_price)
      return 0;

    const regular = Number(form.regular_price);

    const sell = Number(form.sell_price);

    if (regular <= 0) return 0;

    return Math.round(
      ((regular - sell) / regular) * 100
    );
  }, [form.regular_price, form.sell_price]);

  const handleUpdate = async () => {
    try {
      if (!form.title) {
        toast.error("Title is required");
        return;
      }

      if (!form.description) {
        toast.error("Description is required");
        return;
      }

      setLoading(true);

      const data = new FormData();

      data.append("title", form.title);

      data.append("slug", form.slug);

      data.append(
        "description",
        form.description
      );

      data.append("category", form.category);

      data.append(
        "regular_price",
        form.regular_price
      );

      data.append(
        "discount_percentage",
        discountPercentage.toString()
      );

      data.append("currency", form.currency);

      data.append(
        "inventory",
        JSON.stringify({
          sku: form.sku,

          availability: form.availability,

          stock_quantity: Number(
            form.stock_quantity || 0
          ),
        })
      );

      data.append(
        "variants",
        JSON.stringify({
          colors: form.colors.map(
            (color: string, index: number) => ({
              name: color,
              bg: color,
              active: index === 0,
            })
          ),

          sizes: form.sizes,

          depth: form.depth
            ? `${form.depth} cm`
            : "",
        })
      );

      data.append(
        "delivery",
        JSON.stringify({
          estimated_delivery:
            form.estimated_delivery,
        })
      );

      data.append(
        "dimensions_and_weight",
        JSON.stringify({
          length: form.length
            ? `${form.length} cm`
            : "",

          width: form.width
            ? `${form.width} cm`
            : "",

          height: form.height
            ? `${form.height} cm`
            : "",

          weight: form.weight
            ? `${form.weight} kg`
            : "",
        })
      );

      [
        "image1",
        "image2",
        "image3",
        "image4",
        "image5",
      ].forEach((key) => {
        if (form[key]) {
          data.append(key, form[key]);
        }
      });

      await axiosInstance.put(
        `/api/v1/products/update/${id}`,
        data
      );

      toast.success(
        "Product Updated Successfully"
      );

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
          <div className="mb-4">
            <h3 className="mb-1">
              Edit Product
            </h3>

            <p className="text-muted mb-0">
              Update your product details
            </p>
          </div>

          <Row>
            <Col md={8} className="mb-3">
              <FormGroup>
                <Label>Product Title</Label>

                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter product title"
                />
              </FormGroup>
            </Col>

            <Col md={4} className="mb-3">
              <FormGroup>
                <Label>Slug</Label>

                <Input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label>Category</Label>

                <Input
                  type="select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((cat: any) => (
                    <React.Fragment key={cat._id}>

                      {/* PARENT */}
                      <option
                        disabled
                        style={{
                          fontWeight: 700,
                          background: "#f8fafc",
                          color: "#111827",
                        }}
                      >
                        📁 {cat.title}
                      </option>

                      {/* CHILD */}
                      {cat.columns?.map((column: any) => (
                        <React.Fragment key={column._id}>

                          <option
                            disabled
                            style={{
                              fontWeight: 600,
                              color: "#2563eb",
                              background: "#eff6ff",
                            }}
                          >
                            ├── {column.heading}
                          </option>

                          {/* SUB CHILD */}
                          {column.links?.map((link: any) => (
                            <option
                              key={link._id}
                              value={`${cat.title} > ${column.heading} > ${link.name}`}
                            >
                              │      └── {link.name}
                            </option>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </Input>

                {form.category && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "10px",
                      borderRadius: "8px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                      }}
                    >
                      Selected Category
                    </div>

                    <div
                      style={{
                        fontWeight: 600,
                        color: "#2563eb",
                      }}
                    >
                      {form.category}
                    </div>
                  </div>
                )}
              </FormGroup>
            </Col>

            <Col md={3} className="mb-3">
              <FormGroup>
                <Label>Currency</Label>

                <Input
                  type="select"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                >
                  <option value="INR">
                    INR
                  </option>

                  <option value="USD">
                    USD
                  </option>
                </Input>
              </FormGroup>
            </Col>

            <Col md={3} className="mb-3">
              <FormGroup>
                <Label>
                  Delivery Time
                </Label>

                <Input
                  name="estimated_delivery"
                  value={
                    form.estimated_delivery
                  }
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            {/* DESCRIPTION */}
            {/* DESCRIPTION */}
            <Col md={12} className="mb-4">
              <Label>Description</Label>

              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  overflow: "hidden",
                  minHeight: "300px",
                }}
              >
                {typeof window !== "undefined" && (
                  <CKEditor
                    editor={ClassicEditor as any}
                    data={form.description || ""}
                    onReady={(editor: any) => {
                      try {
                        editor.editing.view.change(
                          (writer: any) => {
                            writer.setStyle(
                              "height",
                              "450px",
                              editor.editing.view.document.getRoot()
                            );
                          }
                        );
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    onChange={(
                      event: any,
                      editor: any
                    ) => {
                      try {
                        const data =
                          editor.getData();

                        setForm((prev: any) => ({
                          ...prev,
                          description: data,
                        }));
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  />
                )}
              </div>
            </Col>

            {/* PRICING */}
            <Col md={4} className="mb-3">
              <FormGroup>
                <Label>
                  Regular Price
                </Label>

                <Input
                  type="number"
                  name="regular_price"
                  value={
                    form.regular_price
                  }
                  onChange={handleChange}
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
                />
              </FormGroup>
            </Col>

            <Col md={4} className="mb-3">
              <FormGroup>
                <Label>
                  Stock Quantity
                </Label>

                <Input
                  type="number"
                  name="stock_quantity"
                  value={
                    form.stock_quantity
                  }
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md={4} className="mb-3">
              <FormGroup>
                <Label>
                  Availability
                </Label>

                <Input
                  type="select"
                  name="availability"
                  value={
                    form.availability
                  }
                  onChange={handleChange}
                >
                  <option value="In Stock">
                    In Stock
                  </option>

                  <option value="Out Of Stock">
                    Out Of Stock
                  </option>

                  <option value="Pre Order">
                    Pre Order
                  </option>
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
                    setColorInput(
                      e.target.value
                    )
                  }
                  placeholder="Add Color"
                />

                <Button
                  type="button"
                  color="dark"
                  onClick={addColor}
                >
                  Add
                </Button>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-3">
                {form.colors.map(
                  (color: string) => (
                    <div
                      key={color}
                      style={{
                        background:
                          "#f1f1f1",
                        padding:
                          "6px 12px",
                        borderRadius: 30,
                      }}
                    >
                      {color}

                      <span
                        onClick={() =>
                          removeColor(
                            color
                          )
                        }
                        style={{
                          marginLeft: 10,
                          cursor:
                            "pointer",
                          color: "red",
                        }}
                      >
                        ×
                      </span>
                    </div>
                  )
                )}
              </div>
            </Col>

            {/* SIZES */}
            <Col md={6} className="mb-4">
              <Label>Sizes</Label>

              <div className="d-flex gap-2">
                <Input
                  value={sizeInput}
                  onChange={(e) =>
                    setSizeInput(
                      e.target.value
                    )
                  }
                  placeholder="Add Size"
                />

                <Button
                  type="button"
                  color="dark"
                  onClick={addSize}
                >
                  Add
                </Button>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-3">
                {form.sizes.map(
                  (size: string) => (
                    <div
                      key={size}
                      style={{
                        background:
                          "#f1f1f1",
                        padding:
                          "6px 12px",
                        borderRadius: 30,
                      }}
                    >
                      {size}

                      <span
                        onClick={() =>
                          removeSize(
                            size
                          )
                        }
                        style={{
                          marginLeft: 10,
                          cursor:
                            "pointer",
                          color: "red",
                        }}
                      >
                        ×
                      </span>
                    </div>
                  )
                )}
              </div>
            </Col>

            {/* DIMENSIONS */}
            <Col md={3} className="mb-3">
              <FormGroup>
                <Label>
                  Length (cm)
                </Label>

                <Input
                  name="length"
                  value={form.length}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md={3} className="mb-3">
              <FormGroup>
                <Label>
                  Width (cm)
                </Label>

                <Input
                  name="width"
                  value={form.width}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md={3} className="mb-3">
              <FormGroup>
                <Label>
                  Height (cm)
                </Label>

                <Input
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md={3} className="mb-3">
              <FormGroup>
                <Label>
                  Weight (kg)
                </Label>

                <Input
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            {/* IMAGES */}
            <Col md={12} className="mt-3">
              <h5>Product Images</h5>
            </Col>

            {[
              "image1",
              "image2",
              "image3",
              "image4",
              "image5",
            ].map((key, index) => (
              <Col
                md={4}
                lg={3}
                className="mb-4"
                key={key}
              >
                <Card className="shadow-sm border-0 h-100">
                  <CardBody>
                    <Label>
                      {index === 0
                        ? "Main Image"
                        : `Image ${index + 1
                        }`}
                    </Label>

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImage(
                          e,
                          key
                        )
                      }
                    />

                    <div
                      className="mt-3"
                      style={{
                        height: 180,
                        border:
                          "1px dashed #ddd",
                        borderRadius: 10,
                        overflow:
                          "hidden",
                        background:
                          "#fafafa",
                      }}
                    >
                      {preview[key] ? (
                        <img
                          src={
                            preview[
                            key
                            ]
                          }
                          alt=""
                          style={{
                            width:
                              "100%",
                            height:
                              "100%",
                            objectFit:
                              "cover",
                          }}
                        />
                      ) : (
                        <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                          No Image
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}

            {/* BUTTON */}
            <Col md={12}>
              <Button
                color="primary"
                size="lg"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading
                  ? "Updating..."
                  : "Update Product"}
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditProduct;

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axiosInstance from "../utils/axios";
// import { Card, CardBody, Row, Col, Input, Button } from "reactstrap";

// const COLORS = ["bg-red", "bg-blue", "bg-green", "bg-black", "bg-yellow"];
// const SIZES = ["S", "M", "L", "XL", "XXL"];

// const EditProduct = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [preview, setPreview] = useState<any>({});
//   const [form, setForm] = useState<any>({
//     title: "",
//     description: "",
//     regular_price: "",
//     sell_price: "",
//     category: "",
//     sku: "",
//     stock_quantity: "",
//     colors: [],
//     sizes: [],
//     depth: "",
//     height: "",
//     width: "",
//     length: "",
//     weight: "",
//     image1: null,
//     image2: null,
//     image3: null,
//     image4: null,
//     image5: null,
//   });

//   const fetchProduct = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get(`/api/v1/products/single/${id}`);
//       const p = res?.data?.data?.product;
//       setForm({
//         title: p.title || "",
//         description: p.description || "",
//         regular_price: p.pricing?.regular_price || "",
//         sell_price: p.pricing?.sell_price || "",
//         category: p.category?._id || "",
//         sku: p.inventory?.sku || "",
//         stock_quantity: p.inventory?.stock_quantity || "",
//         colors: p.variants?.colors?.map((c: any) => c.bg) || [],
//         sizes: p.variants?.sizes || [],
//         depth: p.variants?.depth || "",
//         height: p.dimensions_and_weight?.height?.replace(" cm", "") || "",
//         width: p.dimensions_and_weight?.width?.replace(" cm", "") || "",
//         length: p.dimensions_and_weight?.length?.replace(" cm", "") || "",
//         weight: p.dimensions_and_weight?.weight?.replace(" kg", "") || "",
//       });
//       setPreview({
//         image1: p.images?.main || "",
//         image2: p.images?.hover || "",
//       });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     const res = await axiosInstance.get("/api/category/admin/list");
//     setCategories(res?.data?.data || []);
//   };

//   useEffect(() => {
//     fetchProduct();
//     fetchCategories();
//   }, []);

//   const handleChange = (e: any) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleMultiSelect = (value: string, key: string) => {
//     let arr = form[key];
//     if (arr.includes(value)) {
//       arr = arr.filter((v: string) => v !== value);
//     } else {
//       arr.push(value);
//     }
//     setForm({ ...form, [key]: [...arr] });
//   };

//   const handleImage = (e: any, key: string) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setForm({ ...form, [key]: file });
//     setPreview({
//       ...preview,
//       [key]: URL.createObjectURL(file),
//     });
//   };

//   const handleUpdate = async () => {
//     try {
//       setLoading(true);
//       const data = new FormData();
//       data.append("title", form.title);
//       data.append("description", form.description);
//       data.append("category", form.category);
//       data.append("regular_price", form.regular_price);
//       data.append("currency", "INR");
//       const discount =
//         ((form.regular_price - form.sell_price) /
//           form.regular_price) *
//         100;
//       data.append("discount_percentage", discount.toFixed(0));
//       data.append(
//         "inventory",
//         JSON.stringify({
//           sku: form.sku,
//           availability: "In Stock",
//           stock_quantity: Number(form.stock_quantity),
//         })
//       );
//       data.append(
//         "variants",
//         JSON.stringify({
//           colors: form.colors.map((c: string) => ({
//             bg: c,
//             active: true,
//           })),
//           sizes: form.sizes,
//           depth: form.depth,
//         })
//       );
//       data.append(
//         "delivery",
//         JSON.stringify({
//           estimated_delivery: "3-5 business days",
//         })
//       );
//       data.append(
//         "dimensions_and_weight",
//         JSON.stringify({
//           length: form.length + " cm",
//           width: form.width + " cm",
//           height: form.height + " cm",
//           weight: form.weight + " kg",
//         })
//       );
//       ["image1", "image2", "image3", "image4", "image5"].forEach((key) => {
//         if (form[key]) data.append(key, form[key]);
//       });
//       await axiosInstance.put(`/api/v1/products/update/${id}`, data);
//       alert("Product Updated");
//       navigate("/products");
//     } catch (err) {
//       console.error(err);
//       alert("Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="shadow-sm border-0">
//       <CardBody>
//         <h5>Edit Product</h5>
//         <Row>
//           <Col md={6}>
//             <Input name="title" value={form.title} onChange={handleChange} />
//           </Col>
//           <Col md={6}>
//             <Input type="select" name="category" value={form.category} onChange={handleChange}>
//               <option>Select Category</option>
//               {categories.map((c) => (
//                 <option key={c._id} value={c._id}>{c.title}</option>
//               ))}
//             </Input>
//           </Col>

//           <Col md={12} className="mt-2">
//             <Input type="textarea" name="description" value={form.description} onChange={handleChange} />
//           </Col>

//           <Col md={6} className="mt-2">
//             <Input name="regular_price" value={form.regular_price} onChange={handleChange} />
//           </Col>

//           <Col md={6} className="mt-2">
//             <Input name="sell_price" value={form.sell_price} onChange={handleChange} />
//           </Col>

//           <Col md={6} className="mt-2">
//             <Input name="sku" value={form.sku} onChange={handleChange} />
//           </Col>

//           <Col md={6} className="mt-2">
//             <Input name="stock_quantity" value={form.stock_quantity} onChange={handleChange} />
//           </Col>

//           {/* DIMENSIONS */}
//           <Col md={4}><Input name="height" value={form.height} onChange={handleChange} placeholder="Height" /></Col>
//           <Col md={4}><Input name="width" value={form.width} onChange={handleChange} placeholder="Width" /></Col>
//           <Col md={4}><Input name="length" value={form.length} onChange={handleChange} placeholder="Length" /></Col>

//           <Col md={6}><Input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight" /></Col>
//           <Col md={6}><Input name="depth" value={form.depth} onChange={handleChange} placeholder="Depth" /></Col>

//           <Col md={6}>
//             {COLORS.map((c) => (
//               <span key={c} onClick={() => handleMultiSelect(c, "colors")}>
//                 {c}
//               </span>
//             ))}
//           </Col>

//           <Col md={6}>
//             {SIZES.map((s) => (
//               <span key={s} onClick={() => handleMultiSelect(s, "sizes")}>
//                 {s}
//               </span>
//             ))}
//           </Col>

//           {["image1", "image2", "image3", "image4", "image5"].map((key) => (
//             <Col md={4} key={key}>
//               <Input type="file" onChange={(e) => handleImage(e, key)} />
//               {preview[key] && <img src={preview[key]} style={{ width: 80 }} />}
//             </Col>
//           ))}
//         </Row>

//         <Button className="mt-3" onClick={handleUpdate} disabled={loading}>
//           {loading ? "Updating..." : "Update Product"}
//         </Button>
//       </CardBody>
//     </Card>
//   );
// };

// export default EditProduct;