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

const Categories = () => {
  const [categories, setCategories] = useState<any>([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    isActive: true,
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  const toggle = () => setModal(!modal);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/category/admin/list");
      setCategories(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "isActive" ? value === "true" : value,
    });
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  
  const handleSubmit = async () => {
    if (!formData.title) {
      alert("Title required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      if (formData.image) data.append("image", formData.image);
      data.append("title", formData.title);
      data.append("isActive", String(formData.isActive));

      if (editId) {
        await axiosInstance.put(`/api/category/update/${editId}`, data);
      } else {
        await axiosInstance.post("/api/category/add", data);
      }

      await fetchCategories();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", isActive: true, image: null });
    setPreview(null);
    setEditId(null);
    toggle();
  };

  const handleEdit = (item: any) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      isActive: item.isActive,
      image: null,
    });
    setPreview(item.image);
    toggle();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/category/delete/${id}`);
      await fetchCategories();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <CardBody>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <h5 style={{ margin: 0, fontWeight: 600 }}>
            Home Categories Grid
          </h5>

          <Button
            size="sm"
            color="primary"
            onClick={() => {
              setEditId(null);
              setFormData({
                title: "",
                isActive: true,
                image: null,
              });
              setPreview(null);
              toggle();
            }}
          >
            + Add Category
          </Button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "10px" }}>
            <div className="spinner-border text-primary" />
          </div>
        )}

        <Table bordered hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>
                  No categories found
                </td>
              </tr>
            )}
            {categories?.data?.map((item:any) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={item.image}
                    style={{
                      width: "60px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </td>
                <td style={{ fontSize: "13px" }}>{item.title}</td>
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
                      color: item.isActive ? "#065f46" : "#991b1b",
                    }}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
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
                      onClick={() => handleEdit(item)}
                    />
                    <FaTrash
                      color="#dc2626"
                      onClick={() => handleDelete(item._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            {editId ? "Edit Category" : "Add Category"}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Upload Image</Label>
              <Input type="file" onChange={handleImage} />
            </FormGroup>
            {preview && (
              <img
                src={preview}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            )}
            <FormGroup>
              <Label>Status</Label>
              <Input
                type="select"
                name="isActive"
                value={String(formData.isActive)}
                onChange={handleChange}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default Categories;