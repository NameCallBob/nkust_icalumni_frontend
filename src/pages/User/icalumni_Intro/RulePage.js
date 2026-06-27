import React, { useState, useEffect } from "react";
import { Button, Spinner } from "components/common/ui";
import Axios from "common/Axios";
import "css/user/AlumniAssociation.css";
import SEO from "SEO";

const AlumniAssociationBylaws = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bodyContent, setBodyContent] = useState("");
  const [showPDF, setShowPDF] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        // 從後端取得 PDF 文件與介紹內容
        const response = await Axios().get("info/constitutions/latest/");
        setBodyContent(response.data.description);
        setPdfFile(`${process.env.REACT_APP_BASE_URL}${response.data.pdf_file}`);
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
      <div className="container mx-auto px-4 text-center py-12">
        <Spinner center label="載入中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="alert alert-error justify-center text-center">
          無法載入章程 PDF：{error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4">
      <SEO
        main={false}
        title="章程"
        description="瀏覽智慧商務系友會的章程與規範，了解我們的運作方式與核心價值。"
        keywords={["智慧商務", "章程", "規範"]}
      />
      <div className="flex justify-center">
        <div className="w-full md:w-5/6">
          {/* 介紹文字區塊 */}
          <section className="mb-4">
            <h2 className="text-center bg-primary text-primary-content py-2">系友會章程</h2>
            <div
              className="mt-3"
              style={{ lineHeight: "1.8" }}
              dangerouslySetInnerHTML={{ __html: bodyContent }}
            />
            {pdfFile && (
              <div className="flex justify-center mt-3">
                <Button variant="outline" onClick={() => setShowPDF(!showPDF)}>
                  {showPDF ? "隱藏 PDF" : "顯示 PDF"}
                </Button>
              </div>
            )}
          </section>

          {/* PDF 顯示區：使用原生內建 PDF 檢視器 */}
          {pdfFile && showPDF && (
            <section className="shadow-sm" style={{ marginBottom: "1rem" }}>
              <h3 className="bg-secondary text-secondary-content text-center py-2">預覽文件</h3>
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
        </div>
      </div>
    </div>
  );
};

export default AlumniAssociationBylaws;
