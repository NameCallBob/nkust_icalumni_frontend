import React, { useState, useEffect } from "react";
import { Section, Card, Button, Spinner, EmptyState } from "components/common/ui";
import { ScrollText, FileText, Eye, EyeOff, AlertTriangle } from "lucide-react";
import Axios from "common/Axios";
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
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <Spinner center label="載入章程中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <EmptyState
            title="無法載入章程"
            description={`讀取章程文件時發生錯誤：${error}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-200/40">
      <SEO
        main={false}
        title="章程"
        description="瀏覽智慧商務系友會的章程與規範，了解我們的運作方式與核心價值。"
        keywords={["智慧商務", "章程", "規範"]}
      />

      {/* 頁首橫幅 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-neutral text-primary-content">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase ring-1 ring-white/20">
            <ScrollText className="h-4 w-4" />
            Bylaws &amp; Regulations
          </span>
          <h1 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold">
            系友會章程
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-primary-content/80">
            了解智慧商務系友會的運作規範、組織架構與核心價值。
          </p>
          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-secondary" />
        </div>
      </div>

      <Section width="default" className="pt-12 sm:pt-16">
        {/* 介紹文字區塊 */}
        <Card padding="lg" className="overflow-hidden">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-base-200 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-base-content">
                  章程內容
                </h2>
                <p className="text-sm text-base-content/60">系友會組織與運作之依據</p>
              </div>
            </div>
            {pdfFile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPDF(!showPDF)}
              >
                {showPDF ? (
                  <>
                    <EyeOff className="h-4 w-4" /> 隱藏 PDF
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" /> 顯示 PDF
                  </>
                )}
              </Button>
            )}
          </div>

          <div
            className="prose prose-slate mt-6 max-w-none leading-loose text-base-content/80 break-words prose-headings:font-serif prose-headings:text-primary prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: bodyContent }}
          />
        </Card>

        {/* PDF 顯示區：使用原生內建 PDF 檢視器 */}
        {pdfFile && showPDF && (
          <Card padding="none" className="mt-8 overflow-hidden">
            <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-neutral px-5 py-4 text-primary-content">
              <ScrollText className="h-5 w-5 text-secondary" />
              <h3 className="font-serif text-lg font-semibold">章程文件預覽</h3>
            </div>
            <div className="h-[80vh] w-full bg-base-200">
              <object
                data={`${pdfFile}#toolbar=0`}
                type="application/pdf"
                width="100%"
                height="100%"
                className="h-full w-full"
              >
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-base-content/60">
                  <AlertTriangle className="h-8 w-8 text-secondary" />
                  <p>您的瀏覽器不支援 PDF 檢視，請下載 PDF 檔案後再行檢視。</p>
                  <a
                    href={pdfFile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm">
                      <FileText className="h-4 w-4" /> 下載 PDF
                    </Button>
                  </a>
                </div>
              </object>
            </div>
          </Card>
        )}
      </Section>
    </div>
  );
};

export default AlumniAssociationBylaws;
