import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import Axios from "common/Axios";
import "bootstrap/dist/css/bootstrap.min.css";
import SEO from "SEO";

const JoinUsPage_v2 = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bodyContent, setBodyContent] = useState("");
  const [showPDF, setShowPDF] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await Axios().get("info/requirement-v2/latest/");
        setBodyContent(response.data.description);
        setPdfFile(`${process.env.REACT_APP_BASE_URL}static/${response.data.pdf_file}`);
      } catch (err) {
        setError(err.message);
      } finally {
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
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          無法載入加入說明：{error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <SEO
        main={false}
        title="加入我們"
        description="成為智慧商務系友會的一員，獲取資源、商務合作，並與系友共同成長。立即加入！"
        keywords={["智慧商務", "加入", "交流"]}
      />
      <Row className="justify-content-center">
        <Col md={10}>
          {/* 介紹文字區塊 */}
          <section className="mb-4">
            <h2 className="text-center bg-primary text-white py-2">加入系友會</h2>
            <div
              className="mt-3"
              style={{ lineHeight: "1.8" }}
              dangerouslySetInnerHTML={{ __html: bodyContent }}
            />
            {pdfFile && (
              <div className="d-flex justify-content-center mt-3">
                <Button variant="outline-primary" onClick={() => setShowPDF(!showPDF)}>
                  {showPDF ? "隱藏 PDF" : "顯示 PDF"}
                </Button>
              </div>
            )}
          </section>

          {/* PDF 顯示區：使用原生內建 PDF 檢視器 */}
          {pdfFile && showPDF && (
            <section className="shadow-sm" style={{ marginBottom: "1rem" }}>
              <h3 className="bg-secondary text-white text-center py-2">預覽文件</h3>
              <div style={{ height: "90vh", padding: "0" }}>
                <object
                  data={`${pdfFile}#toolbar=0`}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                >
                  您的瀏覽器不支援 PDF 檢視，請下載 PDF 檔案後再行檢視。
                </object>
              </div>
            </section>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default JoinUsPage_v2;