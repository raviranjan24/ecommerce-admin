import { useState } from "react";
import {
  Card,
  CardBody,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { FaEye, FaTrash } from "react-icons/fa";

const contacts = [
  {
    id: 1,
    name: "Ravi Kumar",
    email: "ravi@gmail.com",
    mobile: "9876543210",
    subject: "Website Issue",
    message: "Facing issue while login",
    date: "04 Apr 2026, 10:30 AM",
  },
  {
    id: 2,
    name: "Amit Singh",
    email: "amit@gmail.com",
    mobile: "9123456780",
    subject: "Payment Failed",
    message: "Payment deducted but order not placed",
    date: "03 Apr 2026, 08:15 PM",
  },
  {
    id: 3,
    name: "Neha Sharma",
    email: "neha@gmail.com",
    mobile: "9988776655",
    subject: "Support Needed",
    message: "Need help with dashboard",
    date: "02 Apr 2026, 05:45 PM",
  },
  {
    id: 4,
    name: "John Doe",
    email: "john@gmail.com",
    mobile: "9871234560",
    subject: "Bug Report",
    message: "Page crashing on submit",
    date: "01 Apr 2026, 01:20 PM",
  },
  {
    id: 5,
    name: "Priya Verma",
    email: "priya@gmail.com",
    mobile: "9012345678",
    subject: "General Query",
    message: "How to register?",
    date: "31 Mar 2026, 11:10 AM",
  },
  {
    id: 6,
    name: "Rahul Mehta",
    email: "rahul@gmail.com",
    mobile: "9090909090",
    subject: "Complaint",
    message: "Service not good",
    date: "30 Mar 2026, 09:00 AM",
  },
];

const ITEMS_PER_PAGE = 5;

const ContactList = () => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(contacts.length / ITEMS_PER_PAGE);

  const data = contacts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Card className="custom-card">
      <CardBody>
        {/* Header */}
        <div className="table-header">
          <div className="table-title">Contact Submissions</div>
        </div>

        {/* Table */}
        <Table className="custom-table" borderless responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Date</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.subject}</td>
                <td style={{ maxWidth: "200px" }}>
                  {item.message.length > 30
                    ? item.message.substring(0, 30) + "..."
                    : item.message}
                </td>

                <td>{item.date}</td>

                <td>
                  <div className="action-icons">
                    <FaEye title="View" />
                    <FaTrash title="Delete" style={{ color: "red" }} />
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
    </Card>
  );
};

export default ContactList;