import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import Axios from "common/Axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AlumniAssociationBylaws = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bodyContent, setBodyContent] = useState("");

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        // 從後端獲取 PDF 文件和介紹內容
        const response = await Axios().get("info/constitutions/latest/");
        setBodyContent(response.data.description);
        setPdfFile(`${process.env.REACT_APP_BASE_URL}${response.data.pdf_file}`);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPdf();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">載入中...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <Card className="text-danger">
          <Card.Body>
            無法載入章程 PDF：{error}
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={10} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Header as="h2" className="bg-primary text-white text-center">
              系友會章程
            </Card.Header>
            <Card.Body>
              {/* 介紹文字區域 */}
              <div className="introduction text-center mb-4">
                <div
                  dangerouslySetInnerHTML={{ __html: bodyContent }}
                  style={{ lineHeight: "1.8" }}
                />
                <p>如果無法查看 PDF，請 <a href={pdfFile} download>點擊這裡下載 PDF</a></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

        {/* PDF Viewer */}
              {pdfFile && (
                <div className="pdf-container" style={{ margin: "0 auto", maxWidth: "80%" }}>
                  <embed
                    src={pdfFile}
                    width="100%"
                    height="1000px"
                    style={{ border: "none" }}
                    title="系友會章程 PDF"
                  />
                </div>
              )}
    </Container>
  );
};

export default AlumniAssociationBylaws;
