import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import {
  Card,
  CardBody,
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

const HomeSlider = () => {
  const [sliders, setSliders] = useState<any>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: false,
    image: null as File | null,
    isActive: true,
    product_id: "",
  });

  const toggle = () => setModal(!modal);

  // ================= FETCH BANNERS =================
  const fetchBanners = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/banner/admin/list");

      setSliders(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/products");

      setProducts(res?.data?.data?.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchProducts();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? value === "true"
          : value,
    }));
  };

  // ================= HANDLE IMAGE =================
  const handleImage = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      setPreview(URL.createObjectURL(file));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      if (formData.image) {
        data.append("image", formData.image);
      }

      data.append("title", String(formData.title));
      data.append("isActive", String(formData.isActive));
      data.append("product_id", formData.product_id);

      if (editId) {
        await axiosInstance.put(
          `/api/banner/update/${editId}`,
          data
        );
      } else {
        await axiosInstance.post(
          "/api/banner/add",
          data
        );
      }

      await fetchBanners();

      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setFormData({
      title: false,
      image: null,
      isActive: true,
      product_id: "",
    });

    setPreview(null);
    setEditId(null);

    toggle();
  };

  // ================= EDIT =================
  const handleEdit = (item: any) => {
    setEditId(item._id);

    setFormData({
      title: item.title,
      image: null,
      isActive: item.isActive,
      product_id: item.product_id || "",
    });

    setPreview(item.image);

    toggle();
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      setLoading(true);

      await axiosInstance.delete(
        `/api/banner/delete/${id}`
      );

      await fetchBanners();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <CardBody>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h5
            style={{
              margin: 0,
              fontWeight: 600,
            }}
          >
            Banners
          </h5>

          <Button
            size="sm"
            color="primary"
            onClick={() => {
              setEditId(null);

              setFormData({
                title: false,
                image: null,
                isActive: true,
                product_id: "",
              });

              setPreview(null);

              toggle();
            }}
          >
            + Add Banner
          </Button>
        </div>

        {/* LOADER */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "10px",
            }}
          >
            <div className="spinner-border text-primary" />
          </div>
        )}

        {/* TABLE */}
        <Table
          bordered
          hover
          responsive
          className="align-middle"
        >
          <thead>
            <tr>
              <th>Image</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              sliders?.data?.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    No banners found
                  </td>
                </tr>
              )}

            {sliders?.data?.map((item: any) => (
              <tr key={item._id}>
                {/* IMAGE */}
                <td>
                  <img
                    src={item.image}
                    alt=""
                    style={{
                      width: "80px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 500,
                      background: item.isActive
                        ? "#d1fae5"
                        : "#fee2e2",
                      color: item.isActive
                        ? "#065f46"
                        : "#991b1b",
                    }}
                  >
                    {item.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                {/* ACTION */}
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <FaEdit
                      color="#2563eb"
                      onClick={() =>
                        handleEdit(item)
                      }
                    />

                    <FaTrash
                      color="#dc2626"
                      onClick={() =>
                        handleDelete(item._id)
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* MODAL */}
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            {editId
              ? "Edit Banner"
              : "Add Banner"}
          </ModalHeader>

          <ModalBody>
            {/* IMAGE */}
            <FormGroup>
              <Label>Upload Image (Width: 1592px * Height: 923px)</Label>

              <Input
                type="file"
                onChange={handleImage}
              />
            </FormGroup>

            {/* PREVIEW */}
            {preview && (
              <img
                src={preview}
                alt=""
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            )}

            {/* PRODUCT */}
            <FormGroup className="mt-3">
              <Label>Select Product</Label>

              <Input
                type="select"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
              >
                <option value="">
                  Select Product
                </option>

                {products.map((product: any) => (
                  <option
                    key={product._id}
                    value={product._id}
                  >
                    {product.title}
                  </option>
                ))}
              </Input>
            </FormGroup>

            {/* STATUS */}
            <FormGroup>
              <Label>Status</Label>

              <Input
                type="select"
                name="isActive"
                value={String(formData.isActive)}
                onChange={handleChange}
              >
                <option value="true">
                  Active
                </option>

                <option value="false">
                  Inactive
                </option>
              </Input>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save"}
            </Button>

            <Button
              color="secondary"
              onClick={toggle}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default HomeSlider;