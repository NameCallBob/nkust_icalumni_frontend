import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import Axios from 'common/Axios';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const AlumniAssociationBylaws = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        // 假設後端 API 端點
        const response = await Axios().get("");

        if (!response.ok) {
          throw new Error('PDF 檔案無法取得');
        }

        const blob = await response.blob();
        setPdfFile(URL.createObjectURL(blob));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPdf();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

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
              <div className="d-flex justify-content-center">
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="pdf-document"
                >
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    width={800}
                  />
                </Document>
              </div>
              <div className="text-center mt-3">
                <p>
                  第 {pageNumber} 頁，共 {numPages} 頁
                </p>
                <div>
                  <button
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="btn btn-secondary me-2"
                  >
                    上一頁
                  </button>
                  <button
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                    disabled={pageNumber >= numPages}
                    className="btn btn-secondary"
                  >
                    下一頁
                  </button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AlumniAssociationBylaws;