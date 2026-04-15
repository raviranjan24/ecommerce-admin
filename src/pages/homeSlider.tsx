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
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: false,
    image: null as File | null,
    isActive: true,
  });

  const toggle = () => setModal(!modal);

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

  useEffect(() => {
    fetchBanners();
  }, []);

  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "true",
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
    try {
      setLoading(true);
      const data = new FormData();
      if (formData.image) data.append("image", formData.image);
      data.append("title", String(formData.title));
      data.append("isActive", String(formData.isActive));
      if (editId) {
        await axiosInstance.put(`/api/banner/update/${editId}`, data);
      } else {
        await axiosInstance.post("/api/banner/add", data);
      }
      await fetchBanners();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: false, image: null, isActive: true });
    setPreview(null);
    setEditId(null);
    toggle();
  };

  const handleEdit = (item: any) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      image: null,
      isActive: item.isActive,
    });
    setPreview(item.image);
    toggle();
  };

  
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/banner/delete/${id}`);
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h5 style={{ margin: 0, fontWeight: 600 }}>Banners</h5>
          <Button
            size="sm"
            color="primary"
            onClick={() => {
              setEditId(null);
              setFormData({ title: false, image: null, isActive: true });
              setPreview(null);
              toggle();
            }}
          >
            + Add Banner
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
            {!loading && sliders.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>
                  No banners found
                </td>
              </tr>
            )}

            {sliders?.data?.map((item: any) => (
              <tr key={item._id}>
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
                      fontSize: "11px",
                      background: item.title ? "#e0f2fe" : "#f3f4f6",
                      padding: "3px 8px",
                      borderRadius: "12px",
                    }}
                  >
                    {item.title ? "Visible" : "Hidden"}
                  </span>
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
            {editId ? "Edit Banner" : "Add Banner"}
          </ModalHeader>

          <ModalBody>
            {/* <FormGroup>
              <Label>Show Title</Label>
              <Input
                type="select"
                name="title"
                value={String(formData.title)}
                onChange={handleChange}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </Input>
            </FormGroup> */}

            <FormGroup>
              <Label>Upload Image</Label>
              <Input type="file" onChange={handleImage} />
            </FormGroup>

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
            <Button color="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default HomeSlider;