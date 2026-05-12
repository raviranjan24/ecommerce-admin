import { Row, Col } from "reactstrap";
// import OrderList from "../components/dashboard/orderList";
import InfoBox from "../components/dashboard/infoBox";

const Dashboard = () => {
  return (
    <div>
      <Row>
        <InfoBox />
      </Row>
      <Row>
        {/* <Col md="12" className="mt-3">
          <OrderList />
        </Col> */}
      </Row>
    </div>
  );
};

export default Dashboard;