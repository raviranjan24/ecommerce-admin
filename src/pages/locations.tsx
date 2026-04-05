import React, { useState } from "react";
import {
  Card,
  CardBody,
  Table,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

import {
  FaMapMarkerAlt,
  FaChartBar,
  FaCity,
  FaGlobeAsia,
} from "react-icons/fa";

interface LocationData {
  id: number;
  location: string;
  orders: number;
  revenue: number;
}

const ITEMS_PER_PAGE = 5;

const Locations: React.FC = () => {
  const [data] = useState<LocationData[]>([
    { id: 1, location: "Delhi", orders: 120, revenue: 250000 },
    { id: 2, location: "Mumbai", orders: 95, revenue: 210000 },
    { id: 3, location: "Bangalore", orders: 140, revenue: 300000 },
    { id: 4, location: "Kolkata", orders: 60, revenue: 120000 },
    { id: 5, location: "Chennai", orders: 80, revenue: 170000 },
    { id: 6, location: "Hyderabad", orders: 110, revenue: 240000 },
  ]);

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const currentData = data.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const topLocation = [...data].sort((a, b) => b.orders - a.orders)[0];
  const leastLocation = [...data].sort((a, b) => a.orders - b.orders)[0];

  return (
    <>
      <Row className="mb-4">
        <Col md="3">
          <div className="dashboard-card bg-total">
            <div>
              <h6>Total Orders</h6>
              <h3>{totalOrders}</h3>
            </div>
            <FaChartBar className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-delivered">
            <div>
              <h6>Total Revenue</h6>
              <h3>₹{totalRevenue}</h3>
            </div>
            <FaGlobeAsia className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-pending">
            <div>
              <h6>Top Location</h6>
              <h3>{topLocation?.location}</h3>
            </div>
            <FaCity className="icon" />
          </div>
        </Col>

        <Col md="3">
          <div className="dashboard-card bg-cancelled">
            <div>
              <h6>Lowest Orders</h6>
              <h3>{leastLocation?.location}</h3>
            </div>
            <FaMapMarkerAlt className="icon" />
          </div>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <CardBody>
          <h5 className="mb-3">Location Wise Orders</h5>

          <Table responsive hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Performance</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>{item.location}</td>
                  <td>{item.orders}</td>
                  <td>₹{item.revenue}</td>
                  <td>
                    <span
                      className={`badge ${item.orders > 100
                          ? "bg-success"
                          : item.orders > 70
                            ? "bg-warning"
                            : "bg-danger"
                        }`}
                    >
                      {item.orders > 100
                        ? "High"
                        : item.orders > 70
                          ? "Medium"
                          : "Low"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem active={page === i + 1} key={i}>
                <PaginationLink onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </Pagination>
        </CardBody>
      </Card>
    </>
  );
};

export default Locations;