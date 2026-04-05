import { useState } from "react";
import {
    Card,
    CardBody,
    Table,
    Button,
    Pagination,
    PaginationItem,
    PaginationLink,
} from "reactstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import "./order.css";

const orders = [
    {
        id: "53867628027",
        payment: "cash",
        orderDate: "September 9th 2020 1:24:41 am",
        deliveryDate: "September 12th 2020",
        status: "shipping",
        total: "₹2000",
    },
    {
        id: "705498527969",
        payment: "cash",
        orderDate: "September 9th 2020 1:24:40 am",
        deliveryDate: "-",
        status: "processing",
        total: "₹2000",
    },
    {
        id: "157789829989",
        payment: "cash",
        orderDate: "September 9th 2020 1:15:18 am",
        deliveryDate: "September 12th 2020",
        status: "shipping",
        total: "₹4132",
    },
    {
        id: "543645314843",
        payment: "cash",
        orderDate: "September 8th 2020",
        deliveryDate: "September 12th 2020",
        status: "processing",
        total: "₹3400",
    },
    {
        id: "18038645978",
        payment: "cash",
        orderDate: "September 8th 2020",
        deliveryDate: "-",
        status: "processing",
        total: "₹3400",
    },
    {
        id: "414488607397",
        payment: "cash",
        orderDate: "September 7th 2020",
        deliveryDate: "-",
        status: "processing",
        total: "₹0",
    },
];

const ITEMS_PER_PAGE = 5;

const DashboardTable = () => {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

    const data = orders.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    return (
        <Card className="custom-card">
            <CardBody>
                {/* Header */}
                <div className="table-header">
                    <div className="table-title">Recent Orders</div>
                    <Button className="btn btn-primary btn-sm" style={{ background: "#7e6bef" }}>View All</Button>
                </div>

                {/* Table */}
                <Table className="custom-table" borderless responsive>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Payment Method</th>
                            <th>Order Date</th>
                            <th>Delivery Date</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th style={{ textAlign: "center" }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item, i) => (
                            <tr key={i}>
                                <td>{item.id}</td>
                                <td>{item.payment}</td>
                                <td>{item.orderDate}</td>
                                <td>{item.deliveryDate}</td>

                                <td>
                                    <span
                                        className={`status-badge status-${item.status}`}
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                <td className="amount">{item.total}</td>

                                <td>
                                    <div className="action-icons">
                                        <FaEye />
                                        <FaEdit />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Pagination */}
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

export default DashboardTable;