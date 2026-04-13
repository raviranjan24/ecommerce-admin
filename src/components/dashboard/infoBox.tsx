import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { Col, Card, CardBody } from "reactstrap";
import {
  FaShoppingCart,
  FaTimesCircle,
  FaSyncAlt,
} from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

const InfoBox = () => {
  const [stats, setStats] = useState({
    pending: 0,
    cancelled: 0,
    processing: 0,
    todayIncome: 0,
  });

  const [loading, setLoading] = useState(false);

  // ===========================
  // 🔥 FETCH ORDERS + CALCULATE
  // ===========================
  const fetchStats = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.post("/api/order/list");

      const orders = res?.data?.orders || [];

      const today = new Date().toDateString();

      let pending = 0;
      let cancelled = 0;
      let processing = 0;
      let todayIncome = 0;

      orders.forEach((o: any) => {
        // STATUS COUNT
        if (o.status === "Pending") pending++;
        if (o.status === "Cancelled") cancelled++;
        if (o.status === "Processing") processing++;

        // TODAY INCOME
        const orderDate = new Date(o.createdAt).toDateString();

        if (orderDate === today) {
          todayIncome += o.total || 0;
        }
      });

      setStats({
        pending,
        cancelled,
        processing,
        todayIncome,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ===========================
  // CARD DATA (DYNAMIC)
  // ===========================
  const cardData = [
    {
      title: "ORDER PENDING",
      value: stats.pending,
      color: "#7e6bef",
      icon: <FaShoppingCart size={24} />,
    },
    {
      title: "ORDER CANCEL",
      value: stats.cancelled,
      color: "#ff3b3b",
      icon: <FaTimesCircle size={24} />,
    },
    {
      title: "ORDER PROCESS",
      value: stats.processing,
      color: "#2fa4c6",
      icon: <FaSyncAlt size={24} />,
    },
    {
      title: "TODAY INCOME",
      value: `₹${stats.todayIncome}`,
      color: "#3ac569",
      icon: <FaIndianRupeeSign size={24} />,
    },
  ];

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
                  {loading ? "..." : item.value}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  padding: "15px",
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

// import {Col, Card, CardBody } from "reactstrap";
// import {
//     FaShoppingCart,
//     FaTimesCircle,
//     FaSyncAlt
// } from "react-icons/fa";
// import { FaIndianRupeeSign } from "react-icons/fa6";

// const cardData = [
//     {
//         title: "ORDER PENDING",
//         value: 2,
//         color: "#7e6bef",
//         icon: <FaShoppingCart size={24} />,
//     },
//     {
//         title: "ORDER CANCEL",
//         value: 0,
//         color: "#ff3b3b",
//         icon: <FaTimesCircle size={24} />,
//     },
//     {
//         title: "ORDER PROCESS",
//         value: 5,
//         color: "#2fa4c6",
//         icon: <FaSyncAlt size={24} />,
//     },
//     {
//         title: "TODAY INCOME",
//         value: "9568.00",
//         color: "#3ac569",
//         icon: <FaIndianRupeeSign size={24} />,
//     },
// ];

// const InfoBox = () => {
//     return (
//         <>
//             {cardData.map((item, index) => (
//                 <Col md="3" key={index}>
//                     <Card
//                         style={{
//                             backgroundColor: item.color,
//                             color: "#fff",
//                             borderRadius: "10px",
//                             border: "none",
//                         }}
//                     >
//                         <CardBody
//                             className="d-flex justify-content-between align-items-center"
//                             style={{ padding: "20px" }}
//                         >
//                             <div>
//                                 <div style={{ fontSize: "14px", opacity: 0.9 }}>
//                                     {item.title}
//                                 </div>
//                                 <div style={{ fontSize: "28px", fontWeight: "bold" }}>
//                                     {item.value}
//                                 </div>
//                             </div>

//                             <div
//                                 style={{
//                                     background: "rgba(255,255,255,0.2)",
//                                     borderRadius: "50%",
//                                     padding: "15px",
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                 }}
//                             >
//                                 {item.icon}
//                             </div>
//                         </CardBody>
//                     </Card>
//                 </Col>
//             ))}
//         </>
//     );
// };

// export default InfoBox;