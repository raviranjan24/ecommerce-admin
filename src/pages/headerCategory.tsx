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
  Row,
  Col,
} from "reactstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

interface LinkItem {
  name: string;
  url: string;
}

interface ColumnItem {
  heading: string;
  links: LinkItem[];
}

const HeaderCategory = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    columns: [
      {
        heading: "",
        links: [{ name: "", url: "" }],
      },
    ] as ColumnItem[],
  });

  const toggle = () => setModal(!modal);

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        "/api/v1/header-categories/admin"
      );

      setCategories(res?.data?.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= HANDLE TITLE =================
  const handleTitleChange = (e: any) => {
    setFormData({
      ...formData,
      title: e.target.value,
    });
  };

  // ================= HANDLE COLUMN =================
  const handleColumnChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedColumns = [...formData.columns];

    updatedColumns[index] = {
      ...updatedColumns[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      columns: updatedColumns,
    });
  };

  // ================= HANDLE LINK =================
  const handleLinkChange = (
    columnIndex: number,
    linkIndex: number,
    field: string,
    value: string
  ) => {
    const updatedColumns = [...formData.columns];

    updatedColumns[columnIndex].links[linkIndex] = {
      ...updatedColumns[columnIndex].links[linkIndex],
      [field]: value,
    };

    setFormData({
      ...formData,
      columns: updatedColumns,
    });
  };

  // ================= ADD COLUMN =================
  const addColumn = () => {
    setFormData({
      ...formData,
      columns: [
        ...formData.columns,
        {
          heading: "",
          links: [{ name: "", url: "" }],
        },
      ],
    });
  };

  // ================= REMOVE COLUMN =================
  const removeColumn = (index: number) => {
    const updatedColumns = formData.columns.filter(
      (_, i) => i !== index
    );

    setFormData({
      ...formData,
      columns: updatedColumns,
    });
  };

  // ================= ADD LINK =================
  const addLink = (columnIndex: number) => {
    const updatedColumns = [...formData.columns];

    updatedColumns[columnIndex].links.push({
      name: "",
      url: "",
    });

    setFormData({
      ...formData,
      columns: updatedColumns,
    });
  };

  // ================= REMOVE LINK =================
  const removeLink = (
    columnIndex: number,
    linkIndex: number
  ) => {
    const updatedColumns = [...formData.columns];

    updatedColumns[columnIndex].links = updatedColumns[
      columnIndex
    ].links.filter((_, i) => i !== linkIndex);

    setFormData({
      ...formData,
      columns: updatedColumns,
    });
  };

  // ================= RESET =================
  const resetForm = () => {
    setFormData({
      title: "",
      columns: [
        {
          heading: "",
          links: [{ name: "", url: "" }],
        },
      ],
    });

    setEditId(null);
    toggle();
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!formData.title) {
      alert("Title required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await axiosInstance.put(
          `/api/v1/header-categories/${editId}`,
          formData
        );
      } else {
        await axiosInstance.post(
          "/api/v1/header-categories",
          formData
        );
      }

      await fetchCategories();
      resetForm();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (item: any) => {
    setEditId(item._id);

    setFormData({
      title: item.title,
      columns:
        item.columns?.length > 0
          ? item.columns
          : [
              {
                heading: "",
                links: [{ name: "", url: "" }],
              },
            ],
    });

    toggle();
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      setLoading(true);

      await axiosInstance.delete(
        `/api/v1/header-categories/${id}`
      );

      fetchCategories();
    } catch (err) {
      console.log(err);
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
            Header Categories
          </h5>

          <Button
            color="primary"
            size="sm"
            onClick={() => {
              setEditId(null);

              setFormData({
                title: "",
                columns: [
                  {
                    heading: "",
                    links: [{ name: "", url: "" }],
                  },
                ],
              });

              toggle();
            }}
          >
            + Add Header Category
          </Button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: 20 }}>
            <div className="spinner-border text-primary" />
          </div>
        )}

        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Total Columns</th>
              <th>Created</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {!loading && categories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "center", padding: 20 }}
                >
                  No Categories Found
                </td>
              </tr>
            )}

            {categories.map((item: any) => (
              <tr key={item._id}>
                <td>{item.title}</td>

                <td>{item.columns?.length || 0}</td>

                <td>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>

                <td style={{ textAlign: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "15px",
                    }}
                  >
                    <FaEdit
                      color="#2563eb"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEdit(item)}
                    />

                    <FaTrash
                      color="#dc2626"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(item._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* ================= MODAL ================= */}

        <Modal
          isOpen={modal}
          toggle={toggle}
          size="xl"
          scrollable
        >
          <ModalHeader toggle={toggle}>
            {editId
              ? "Edit Header Category"
              : "Add Header Category"}
          </ModalHeader>

          <ModalBody>
            {/* TITLE */}
            <FormGroup>
              <Label>Category Title</Label>

              <Input
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter category title"
              />
            </FormGroup>

            <hr />

            {/* COLUMNS */}
            {formData.columns.map(
              (column, columnIndex) => (
                <div
                  key={columnIndex}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "15px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <h6>
                      Column {columnIndex + 1}
                    </h6>

                    {formData.columns.length > 1 && (
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() =>
                          removeColumn(columnIndex)
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* HEADING */}
                  <FormGroup>
                    <Label>Heading</Label>

                    <Input
                      value={column.heading}
                      onChange={(e) =>
                        handleColumnChange(
                          columnIndex,
                          "heading",
                          e.target.value
                        )
                      }
                      placeholder="Enter heading"
                    />
                  </FormGroup>

                  {/* LINKS */}
                  {column.links.map(
                    (link, linkIndex) => (
                      <Row
                        key={linkIndex}
                        className="mb-2"
                      >
                        <Col md={5}>
                          <Input
                            placeholder="Link Name"
                            value={link.name}
                            onChange={(e) =>
                              handleLinkChange(
                                columnIndex,
                                linkIndex,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </Col>

                        <Col md={5}>
                          <Input
                            placeholder="URL"
                            value={link.url}
                            onChange={(e) =>
                              handleLinkChange(
                                columnIndex,
                                linkIndex,
                                "url",
                                e.target.value
                              )
                            }
                          />
                        </Col>

                        <Col md={2}>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() =>
                              removeLink(
                                columnIndex,
                                linkIndex
                              )
                            }
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    )
                  )}

                  <Button
                    size="sm"
                    color="success"
                    onClick={() =>
                      addLink(columnIndex)
                    }
                  >
                    <FaPlus size={12} /> Add Link
                  </Button>
                </div>
              )
            )}

            <Button
              color="primary"
              onClick={addColumn}
            >
              <FaPlus size={12} /> Add Column
            </Button>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>

            <Button onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default HeaderCategory;