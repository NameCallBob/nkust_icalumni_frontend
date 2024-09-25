import React, { useState, useEffect } from "react";
import { Button, Container, Form , Row , Col ,Card} from "react-bootstrap";

// import axios from "axios";

import CompanyInfo from "components/Manage/Company/Info";
import ContactInfo from "components/Manage/Company/Contact";
import ProductInfo from "components/Manage/Company/Product";
import IndustryDropdown from "components/Manage/Company/IndustryDropdown";

const CompanyForm = () => {
  const [company, setCompany] = useState({
    name: "",
    member: "",
    industry: "",
    positions: "",
    description: "",
    products: "",
    productDescription: "",
    website: "",
    address: "",
    email: "",
    phoneNumber: "",
    photo: null,
  });

  const [industries, setIndustries] = useState([]);

//   useEffect(() => {
//       axios.get("/api/industries/").then((response) => {
//       setIndustries(response.data);
//     });
//   }, []);

  const handleInputChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCompany({ ...company, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(company).forEach((key) => {
      formData.append(key, company[key]);
    });

    // axios
    //   .post("/api/companies/", formData, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   })
    //   .then((response) => {
    //     alert("Company information saved!");
    //   })
    //   .catch((error) => {
    //     console.error("Error saving company data:", error);
    //   });
  };

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">公司資料維護</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col lg={6}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <CompanyInfo company={company} handleInputChange={handleInputChange} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <IndustryDropdown
                  industries={industries}
                  company={company}
                  handleInputChange={handleInputChange}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col lg={6}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <ProductInfo company={company} handleInputChange={handleInputChange} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <ContactInfo
                  company={company}
                  handleInputChange={handleInputChange}
                  handleFileChange={handleFileChange}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center">
          <Button variant="primary" type="submit">
            保存公司資料
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CompanyForm;
