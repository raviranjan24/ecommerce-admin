import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Input,
  Button,
  FormFeedback,
  Spinner,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { routes } from "../utils/apiRoute";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const Login = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}${routes.authentication.loginEmail}`,
          values
        );

        if (response.status === 200) {
          localStorage.setItem(
            "userDetails",
            JSON.stringify(response?.data)
          );
          localStorage.setItem("isLogin", "true");
          toast.success("Login successful");
          navigate("/dashboard");
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Login failed"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container fluid className="p-0">
      <Row className="g-0 min-vh-100">
        <Col
          lg="7"
          className="d-none d-lg-block p-0 position-relative"
        >
          <div
            style={{
              width: "100%",
              height: "100vh",
              backgroundImage: "url('./login banner.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(15,23,42,0.45), rgba(15,23,42,0.10))",
              }}
            />
            <div
              className="position-absolute d-flex align-items-center"
              style={{
                top: "35px",
                left: "35px",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: "65px",
                  height: "65px",
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 15px 35px rgba(99,102,241,0.35)",
                }}
              >
                <ShoppingBagOutlinedIcon
                  style={{
                    color: "#fff",
                    fontSize: "34px",
                  }}
                />
              </div>
              <div className="ms-3 text-white">
                <h3 className="fw-bold mb-0">
                  Farmhouselivings
                </h3>
                <p
                  className="mb-0"
                  style={{
                    opacity: 0.85,
                    fontSize: "15px",
                    letterSpacing: "1px",
                  }}
                >
                  Admin Login
                </p>
              </div>
            </div>
          </div>
        </Col>
        <Col
          lg="5"
          className="d-flex align-items-center justify-content-center"
          style={{
            background: "#f8fafc",
            padding: "30px",
          }}
        >
          <Card
            className="border-0"
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "32px",
              boxShadow:
                "0 25px 70px rgba(15,23,42,0.12)",
            }}
          >
            <CardBody className="p-4 p-md-5">
              <div className="text-center">
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "28px",
                    background:
                      "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 25px",
                    boxShadow:
                      "0 20px 45px rgba(99,102,241,0.3)",
                  }}
                >
                  <ShoppingBagOutlinedIcon
                    style={{
                      color: "#fff",
                      fontSize: "40px",
                    }}
                  />
                </div>

                <h1
                  className="fw-bold mb-2"
                  style={{
                    color: "#0f172a",
                    fontSize: "25px",
                  }}
                >
                  Welcome Back
                </h1>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "16px",
                  }}
                >
                  Login to your ecommerce dashboard
                </p>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <FormGroup className="mb-4">
                  <label
                    className="fw-semibold mb-2"
                    style={{
                      color: "#334155",
                      fontSize: "15px",
                    }}
                  >
                    Email Address
                  </label>

                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    className="border-0"
                    style={{
                      height: "40px",
                      borderRadius: "18px",
                      background: "#f1f5f9",
                      paddingLeft: "20px",
                      fontSize: "15px",
                      boxShadow: "none",
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    invalid={
                      !!(
                        formik.touched.email &&
                        formik.errors.email
                      )
                    }
                  />

                  <FormFeedback className="d-block">
                    {formik.errors.email}
                  </FormFeedback>
                </FormGroup>
                <FormGroup className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <label
                      className="fw-semibold"
                      style={{
                        color: "#334155",
                        fontSize: "15px",
                      }}
                    >
                      Password
                    </label>

                    <span
                      style={{
                        color: "#6366f1",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Forgot Password?
                    </span>
                  </div>

                  <div className="position-relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password"
                      className="border-0"
                      style={{
                        height: "40px",
                        borderRadius: "18px",
                        background: "#f1f5f9",
                        paddingLeft: "20px",
                        paddingRight: "60px",
                        fontSize: "15px",
                        boxShadow: "none",
                      }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      invalid={
                        !!(
                          formik.touched.password &&
                          formik.errors.password
                        )
                      }
                    />
                    <div
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      style={{
                        position: "absolute",
                        right: "20px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#94a3b8",
                        cursor: "pointer",
                        zIndex: 2,
                      }}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </div>
                  </div>

                  <FormFeedback className="d-block">
                    {formik.errors.password}
                  </FormFeedback>
                </FormGroup>

                {/* REMEMBER */}
                <div className="form-check mb-4 mt-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="remember"
                  />

                  <label
                    className="form-check-label"
                    htmlFor="remember"
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    Remember me
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-100 border-0"
                  disabled={formik.isSubmitting}
                  style={{
                    height: "60px",
                    borderRadius: "18px",
                    background:
                      "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    fontWeight: 700,
                    fontSize: "16px",
                    letterSpacing: "1px",
                    boxShadow:
                      "0 20px 40px rgba(99,102,241,0.28)",
                  }}
                >
                  {formik.isSubmitting ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Logging in...
                    </>
                  ) : (
                    "LOGIN"
                  )}
                </Button>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardBody,
//   FormGroup,
//   Input,
//   Button,
//   FormFeedback
// } from "reactstrap";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { routes } from "../utils/apiRoute";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },

//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email("Invalid email format")
//         .required("Email is required"),

//       password: Yup.string()
//         .min(6, "Minimum 6 characters")
//         .required("Password is required"),
//     }),

//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         const response = await axios.post(
//           `${API_BASE_URL}${routes.authentication.loginEmail}`,
//           values
//         );
//         if (response.status === 200) {
//           localStorage.setItem("userDetails", JSON.stringify(response?.data));
//           localStorage.setItem("isLogin", "true");
//           toast.success("Login successful..");
//           navigate("/dashboard");
//         }
//       } catch (error: any) {
//         toast.error(
//           error?.response?.data?.message || "Login failed"
//         );
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   return (
//     <Container fluid className="p-0">
//       <Row className="g-0 vh-100">
//         <Col md="7" className="d-none d-md-block">
//           <div
//             style={{
//               backgroundImage: "url('./login banner.jpg')",
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               height: "100%",
//             }}
//           />
//         </Col>

//         <Col md="5" className="d-flex align-items-center justify-content-center bg-white">
//           <Card className="border-0" style={{ width: "80%", maxWidth: "400px" }}>
//             <CardBody>
//               <h2 className="mb-2 fw-bold">Login</h2>
//               <br />
//               <form onSubmit={formik.handleSubmit}>
//                 <FormGroup className="mb-3">
//                   <label className="fw-semibold">Email Address</label>
//                   <Input
//                     type="email"
//                     name="email"
//                     placeholder="Enter email address"
//                     className="py-2"
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     value={formik.values.email}
//                     invalid={!!(formik.touched.email && formik.errors.email)}
//                   />
//                   <FormFeedback>{formik.errors.email}</FormFeedback>
//                 </FormGroup>
//                 <FormGroup className="mb-2">
//                   <label className="fw-semibold">Password</label>
//                   <Input
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     className="py-2"
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     value={formik.values.password}
//                     invalid={!!(formik.touched.password && formik.errors.password)}
//                   />
//                   <FormFeedback>{formik.errors.password}</FormFeedback>
//                 </FormGroup>
//                 <Button
//                   type="submit"
//                   color="danger"
//                   className="w-100 mt-3 py-2 fw-bold"
//                   style={{ borderRadius: "6px" }}
//                   disabled={formik.isSubmitting}
//                 >
//                   {formik.isSubmitting ? "Logging in..." : "Login"}
//                 </Button>
//               </form>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Login;