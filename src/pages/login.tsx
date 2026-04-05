import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Input,
  Button,
  FormFeedback
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { routes } from "../utils/apiRoute";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
        console.log("response", response);
        //localStorage.setItem("token", response.data.token);
        if (response.status === 200) {
          localStorage.setItem("token", '123456');
          localStorage.setItem("isLogin", "true");
          toast.success("Login successful..");
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
      <Row className="g-0 vh-100">
        <Col md="7" className="d-none d-md-block">
          <div
            style={{
              backgroundImage: "url('./login banner.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
            }}
          />
        </Col>

        <Col md="5" className="d-flex align-items-center justify-content-center bg-white">
          <Card className="border-0" style={{ width: "80%", maxWidth: "400px" }}>
            <CardBody>
              <h2 className="mb-2 fw-bold">Login</h2>
              <br />
              <form onSubmit={formik.handleSubmit}>
                <FormGroup className="mb-3">
                  <label className="fw-semibold">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    className="py-2"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    invalid={!!(formik.touched.email && formik.errors.email)}
                  />
                  <FormFeedback>{formik.errors.email}</FormFeedback>
                </FormGroup>
                <FormGroup className="mb-2">
                  <label className="fw-semibold">Password</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="py-2"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    invalid={!!(formik.touched.password && formik.errors.password)}
                  />
                  <FormFeedback>{formik.errors.password}</FormFeedback>
                </FormGroup>
                <Button
                  type="submit"
                  color="danger"
                  className="w-100 mt-3 py-2 fw-bold"
                  style={{ borderRadius: "6px" }}
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Logging in..." : "Login"}
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