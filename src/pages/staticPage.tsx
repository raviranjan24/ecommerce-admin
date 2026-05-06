import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Input,
  FormGroup,
  Label,
} from "reactstrap";

const StaticPage = () => {
  const [page, setPage] = useState("about");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dummyData: any = {
      about: "This is About Us content...",
      privacy: "Privacy policy content...",
      terms: "Terms & Conditions content...",
      refund: "Refund policy content...",
    };

    setContent(dummyData[page]);
  }, [page]);


  const handleSave = () => {
    setLoading(true);
    const data = {
      page,
      content,
    };

    console.log("Saving:", data);

    // 👉 API CALL
    // fetch("/api/save-page", {
    //   method: "POST",
    //   body: JSON.stringify(data),
    // });

    setTimeout(() => {
      setLoading(false);
      alert("Content saved successfully!");
    }, 1000);
  };

  return (
    <Card className="custom-card">
      <CardBody>
        <div className="table-header">
          <div className="table-title">Static Pages CMS</div>
        </div>
        <Row>
          <Col md={4}>
            <FormGroup>
              <Label>Select Page</Label>
              <Input
                type="select"
                value={page}
                onChange={(e) => setPage(e.target.value)}
              >
                <option value="about">About Us</option>
                <option value="privacy">Privacy Policy</option>
                <option value="terms">Terms & Conditions</option>
                <option value="refund">Refund Policy</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>

        <FormGroup>
          <Label>Content</Label>
          <Input
            type="textarea"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write page content here..."
          />
        </FormGroup>
        <div style={{ textAlign: "right" }}>
          <Button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
            style={{ background: "#7e6bef" }}
          >
            {loading ? "Saving..." : "Save Content"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default StaticPage;