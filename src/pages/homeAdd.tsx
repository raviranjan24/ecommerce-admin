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

const OfferBanner = () => {
  const [offers, setOffers] = useState<any>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    link: "",
    position: "top",
    product_id: "",
    isActive: true,
    image: null as File | null,
  });

  const toggle = () => setModal(!modal);

  // ================= FETCH OFFERS =================
  const fetchOffers = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        "/api/v1/offer/admin/all"
      );

      setOffers(res?.data || []);

      console.log("offer", res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(
        "/api/v1/products"
      );

      setProducts(
        res?.data?.data?.products || []
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffers();
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

      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!formData.title) {
      alert("Title required");
      return;
    }

    if (!formData.product_id) {
      alert("Please select product");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      if (formData.image) {
        data.append(
          "image",
          formData.image
        );
      }

      data.append("title", formData.title);
      data.append("link", formData.link);
      data.append(
        "position",
        formData.position
      );
      data.append(
        "product_id",
        formData.product_id
      );
      data.append(
        "isActive",
        String(formData.isActive)
      );

      if (editId) {
        await axiosInstance.put(
          `/api/v1/offer/update/${editId}`,
          data
        );
      } else {
        await axiosInstance.post(
          "/api/v1/offer/add",
          data
        );
      }

      await fetchOffers();

      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setFormData({
      title: "",
      link: "",
      position: "top",
      product_id: "",
      isActive: true,
      image: null,
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
      link: item.link,
      position: item.position,
      product_id:
        item.product_id?._id ||
        item.product_id ||
        "",
      isActive: item.isActive,
      image: null,
    });

    setPreview(item.image);

    toggle();
  };

  // ================= DELETE =================
  const handleDelete = async (
    id: string
  ) => {
    if (
      !window.confirm(
        "Delete this offer banner?"
      )
    )
      return;

    try {
      setLoading(true);

      await axiosInstance.delete(
        `/api/v1/offer/delete/${id}`
      );

      await fetchOffers();
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
            justifyContent:
              "space-between",
            marginBottom: "15px",
          }}
        >
          <h5
            style={{
              margin: 0,
              fontWeight: 600,
            }}
          >
            Offers Banners
          </h5>

          <Button
            size="sm"
            color="primary"
            onClick={() => {
              setEditId(null);

              setFormData({
                title: "",
                link: "",
                position: "top",
                product_id: "",
                isActive: true,
                image: null,
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
              <th>Title</th>
              <th>Status</th>
              <th
                style={{
                  textAlign: "center",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              offers?.data?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    No offers found
                  </td>
                </tr>
              )}

            {offers?.data?.map(
              (item: any) => (
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

                  {/* TITLE */}
                  <td
                    style={{
                      fontSize: "13px",
                    }}
                  >
                    {item.title}
                  </td>
                  <td>
                    <span
                      style={{
                        padding:
                          "4px 10px",
                        borderRadius:
                          "20px",
                        fontSize: "11px",
                        fontWeight: 500,
                        background:
                          item.isActive
                            ? "#d1fae5"
                            : "#fee2e2",
                        color:
                          item.isActive
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
                      textAlign:
                        "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "center",
                        gap: "12px",
                        cursor:
                          "pointer",
                      }}
                    >
                      <FaEdit
                        color="#2563eb"
                        onClick={() =>
                          handleEdit(
                            item
                          )
                        }
                      />

                      <FaTrash
                        color="#dc2626"
                        onClick={() =>
                          handleDelete(
                            item._id
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>

        {/* MODAL */}
        <Modal
          isOpen={modal}
          toggle={toggle}
        >
          <ModalHeader toggle={toggle}>
            {editId
              ? "Edit Offer Banner"
              : "Add Offer Banner"}
          </ModalHeader>

          <ModalBody>
            {/* TITLE */}
            <FormGroup>
              <Label>Title</Label>

              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </FormGroup>

            {/* IMAGE */}
            <FormGroup>
              <Label>
                Upload Image (Width: 991px * Height: 832px)
              </Label>

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
                  borderRadius:
                    "8px",
                  marginTop: "10px",
                }}
              />
            )}

            {/* PRODUCT */}
            <FormGroup className="mt-3">
              <Label>
                Select Product
              </Label>

              <Input
                type="select"
                name="product_id"
                value={
                  formData.product_id
                }
                onChange={handleChange}
              >
                <option value="">
                  Select Product
                </option>

                {products.map(
                  (product: any) => (
                    <option
                      key={
                        product._id
                      }
                      value={
                        product._id
                      }
                    >
                      {product.title}
                    </option>
                  )
                )}
              </Input>
            </FormGroup>

            {/* STATUS */}
            <FormGroup>
              <Label>Status</Label>

              <Input
                type="select"
                name="isActive"
                value={String(
                  formData.isActive
                )}
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

export default OfferBanner;