import React, { useState } from "react";
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
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
} from "react-icons/fa";

interface Category {
  id: number;
  name: string;
  description: string;
  status: "active" | "disabled";
}

interface CategoryForm {
  name: string;
  description: string;
}

const ITEMS_PER_PAGE = 5;

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Dairy",
      description: "Milk products",
      status: "active",
    },
    {
      id: 2,
      name: "Bakery",
      description: "Bread & cakes",
      status: "disabled",
    },
    {
      id: 3,
      name: "Groceries",
      description: "Daily essentials",
      status: "active",
    },
    {
      id: 4,
      name: "Beverages",
      description: "Drinks & juices",
      status: "active",
    },
    {
      id: 5,
      name: "Snacks",
      description: "Chips & snacks",
      status: "disabled",
    },
    {
      id: 6,
      name: "Frozen",
      description: "Frozen foods",
      status: "active",
    },
  ]);

  const [page, setPage] = useState<number>(1);
  const [modal, setModal] = useState<boolean>(false);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<Category | null>(null);

  const [form, setForm] = useState<CategoryForm>({
    name: "",
    description: "",
  });

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  const currentData = categories.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const toggleModal = () => setModal(!modal);
  const toggleView = () => setViewModal(!viewModal);

  const handleSave = () => {
    if (!form.name || !form.description) {
      alert("Fill all fields");
      return;
    }

    if (editData) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editData.id ? { ...c, ...form } : c
        )
      );
    } else {
      const newCategory: Category = {
        id: Date.now(),
        ...form,
        status: "active",
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    setForm({ name: "", description: "" });
    setEditData(null);
    toggleModal();
  };

  const handleEdit = (item: Category) => {
    setEditData(item);
    setForm({
      name: item.name,
      description: item.description,
    });
    toggleModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
            ...c,
            status: c.status === "active" ? "disabled" : "active",
          }
          : c
      )
    );
  };

  return (
    <Card className="custom-card">
      <CardBody>
        <div className="table-header">
          <div className="table-title">Categories</div>
          <Button color="primary" size="sm" onClick={toggleModal}>
            <FaPlus /> Add Category
          </Button>
        </div>
        <Table className="custom-table" borderless responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
                  <span
                    className={`status-badge ${item.status === "active"
                      ? "status-delivered"
                      : "status-processing"
                      }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="action-icons">
                    <FaEye
                      onClick={() => {
                        setEditData(item);
                        toggleView();
                      }}
                    />
                    <FaEdit onClick={() => handleEdit(item)} />
                    <FaTrash onClick={() => handleDelete(item.id)} />
                    {item.status === "active" ? (
                      <FaToggleOn
                        style={{ color: "green" }}
                        onClick={() => toggleStatus(item.id)}
                      />
                    ) : (
                      <FaToggleOff
                        style={{ color: "gray" }}
                        onClick={() => toggleStatus(item.id)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="custom-pagination">
          <Pagination size="sm">
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem active={page === i + 1} key={i}>
                <PaginationLink onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </Pagination>
        </div>
      </CardBody>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {editData ? "Edit Category" : "Add Category"}
        </ModalHeader>
        <ModalBody>
          <Input
            placeholder="Category Name"
            className="mb-2"
            value={form.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={viewModal} toggle={toggleView}>
        <ModalHeader toggle={toggleView}>Category Details</ModalHeader>
        <ModalBody>
          <p><b>Name:</b> {editData?.name}</p>
          <p><b>Description:</b> {editData?.description}</p>
          <p><b>Status:</b> {editData?.status}</p>
        </ModalBody>
      </Modal>
    </Card>
  );
};

export default Categories;