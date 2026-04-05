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

const HomeSlider = () => {
  const [sliders, setSliders] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    image: null as File | null,
    status: "active",
  });

  const [preview, setPreview] = useState<string | null>(null);

  const toggle = () => setModal(!modal);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!formData.title) {
      alert("Title required");
      return;
    }

    if (editId !== null) {
      const updated = sliders.map((item) =>
        item.id === editId
          ? { ...item, ...formData, preview }
          : item
      );
      setSliders(updated);
    } else {
      const newSlider = {
        id: Date.now(),
        ...formData,
        preview,
      };
      setSliders([...sliders, newSlider]);
    }

    // Reset
    setFormData({ title: "", image: null, status: "active" });
    setPreview(null);
    setEditId(null);
    toggle();
  };

  // Edit
  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      image: null,
      status: item.status,
    });
    setPreview(item.preview);
    setEditId(item.id);
    toggle();
  };

  // Delete
  const handleDelete = (id: number) => {
    const confirm = window.confirm("Delete this slider?");
    if (confirm) {
      setSliders(sliders.filter((item) => item.id !== id));
    }
  };

  return (
    <Card className="custom-card">
      <CardBody>
        {/* Header */}
        <div className="table-header">
          <div className="table-title">Home Sliders</div>
          <Button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setEditId(null);
              setFormData({ title: "", image: null, status: "active" });
              setPreview(null);
              toggle();
            }}
            style={{ background: "#7e6bef" }}
          >
            + Add Slider
          </Button>
        </div>

        {/* Table */}
        <Table borderless responsive className="custom-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {sliders.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  No sliders added
                </td>
              </tr>
            )}

            {sliders.map((item) => (
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
            {editId ? "Edit Slider" : "Add Slider"}
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <Label>Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter slider title"
              />
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

export default HomeSlider;