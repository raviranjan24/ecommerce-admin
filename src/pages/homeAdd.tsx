import { useState } from "react";
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

const HomeAdd = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    link: "",
    position: "top",
    status: "active",
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  const toggle = () => setModal(!modal);

  // Handle Input
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image Upload
  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit (Add / Update)
  const handleSubmit = () => {
    if (!formData.title || !formData.link) {
      alert("Title & Link required");
      return;
    }

    if (editId !== null) {
      const updated = banners.map((item) =>
        item.id === editId
          ? { ...item, ...formData, preview }
          : item
      );
      setBanners(updated);
    } else {
      const newBanner = {
        id: Date.now(),
        ...formData,
        preview,
      };
      setBanners([...banners, newBanner]);
    }

    // Reset
    setFormData({
      title: "",
      link: "",
      position: "top",
      status: "active",
      image: null,
    });
    setPreview(null);
    setEditId(null);
    toggle();
  };

  // Edit
  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      link: item.link,
      position: item.position,
      status: item.status,
      image: null,
    });
    setPreview(item.preview);
    setEditId(item.id);
    toggle();
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Delete this banner?")) {
      setBanners(banners.filter((item) => item.id !== id));
    }
  };

  return (
    <Card className="custom-card">
      <CardBody>
        {/* Header */}
        <div className="table-header">
          <div className="table-title">Home Banners</div>
          <Button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setEditId(null);
              setFormData({
                title: "",
                link: "",
                position: "top",
                status: "active",
                image: null,
              });
              setPreview(null);
              toggle();
            }}
            style={{ background: "#7e6bef" }}
          >
            + Add Banner
          </Button>
        </div>

        {/* Table */}
        <Table borderless responsive className="custom-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Link</th>
              <th>Position</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {banners.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No banners added
                </td>
              </tr>
            )}

            {banners.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.preview && (
                    <img
                      src={item.preview}
                      alt=""
                      style={{
                        width: "80px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  )}
                </td>

                <td>{item.title}</td>
                <td>
                  <a href={item.link} target="_blank" rel="noreferrer">
                    {item.link}
                  </a>
                </td>

                <td>{item.position}</td>

                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      background:
                        item.status === "active"
                          ? "#d4edda"
                          : "#f8d7da",
                      color:
                        item.status === "active"
                          ? "#155724"
                          : "#721c24",
                    }}
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <div className="action-icons">
                    <FaEdit onClick={() => handleEdit(item)} />
                    <FaTrash
                      onClick={() => handleDelete(item.id)}
                      style={{ color: "red" }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal */}
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            {editId ? "Edit Banner" : "Add Banner"}
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <Label>Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter banner title"
              />
            </FormGroup>

            <FormGroup>
              <Label>Link</Label>
              <Input
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </FormGroup>

            <FormGroup>
              <Label>Position</Label>
              <Input
                type="select"
                name="position"
                value={formData.position}
                onChange={handleChange}
              >
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </Input>
            </FormGroup>

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
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Input>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={handleSubmit}>
              Save
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

export default HomeAdd;