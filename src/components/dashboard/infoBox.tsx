import {Col, Card, CardBody } from "reactstrap";
import {
    FaShoppingCart,
    FaTimesCircle,
    FaSyncAlt
} from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

const cardData = [
    {
        title: "ORDER PENDING",
        value: 2,
        color: "#7e6bef",
        icon: <FaShoppingCart size={24} />,
    },
    {
        title: "ORDER CANCEL",
        value: 0,
        color: "#ff3b3b",
        icon: <FaTimesCircle size={24} />,
    },
    {
        title: "ORDER PROCESS",
        value: 5,
        color: "#2fa4c6",
        icon: <FaSyncAlt size={24} />,
    },
    {
        title: "TODAY INCOME",
        value: "9568.00",
        color: "#3ac569",
        icon: <FaIndianRupeeSign size={24} />,
    },
];

const InfoBox = () => {
    return (
        <>
            {cardData.map((item, index) => (
                <Col md="3" key={index}>
                    <Card
                        style={{
                            backgroundColor: item.color,
                            color: "#fff",
                            borderRadius: "10px",
                            border: "none",
                        }}
                    >
                        <CardBody
                            className="d-flex justify-content-between align-items-center"
                            style={{ padding: "20px" }}
                        >
                            <div>
                                <div style={{ fontSize: "14px", opacity: 0.9 }}>
                                    {item.title}
                                </div>
                                <div style={{ fontSize: "28px", fontWeight: "bold" }}>
                                    {item.value}
                                </div>
                            </div>

                            <div
                                style={{
                                    background: "rgba(255,255,255,0.2)",
                                    borderRadius: "50%",
                                    padding: "15px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {item.icon}
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            ))}
        </>
    );
};

export default InfoBox;