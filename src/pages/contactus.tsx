import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import {
  Card,
  CardBody,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { FaTrash } from "react-icons/fa";

const ITEMS_PER_PAGE = 5;

const ContactList = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/contact/all");
      setContacts(res?.data?.contacts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);


  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this contact?")) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/api/contact/delete/${id}`);
      await fetchContacts();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const totalPages = Math.ceil(contacts.length / ITEMS_PER_PAGE);

  const data = contacts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );


  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN");
  };

  return (
    <Card className="shadow-sm border-0">
      <CardBody>
        {/* Header */}
        <div style={{ marginBottom: "15px" }}>
          <h5 style={{ margin: 0, fontWeight: 600 }}>
            Contact Submissions
          </h5>
        </div>

        {/* Loader */}
        {loading && (
          <div style={{ textAlign: "center", padding: "10px" }}>
            <div className="spinner-border text-primary" />
          </div>
        )}

        {/* Table */}
        <Table bordered hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Order No.</th>
              <th>Message</th>
              <th>Date</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                  No contacts found 🚫
                </td>
              </tr>
            )}

            {data.map((item) => (
              <tr key={item._id}>
                <td style={{ fontSize: "13px" }}>{item.name}</td>
                <td style={{ fontSize: "12px" }}>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.orderNumber || "-"}</td>

                <td style={{ maxWidth: "200px", fontSize: "12px" }}>
                  {item.msg?.length > 30
                    ? item.msg.substring(0, 30) + "..."
                    : item.msg}
                </td>

                <td style={{ fontSize: "12px" }}>
                  {formatDate(item.createdAt)}
                </td>

                {/* DELETE ONLY */}
                <td style={{ textAlign: "center" }}>
                  <FaTrash
                    title="Delete"
                    color="#dc2626"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(item._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center" }}>
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
    </Card>
  );
};

export default ContactList;