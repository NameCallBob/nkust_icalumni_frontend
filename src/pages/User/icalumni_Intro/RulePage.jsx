import React, { useState, useEffect } from "react";
import { Section, Card, Button, Spinner, EmptyState } from "@/components/ui";
import {
  ScrollText,
  FileText,
  Eye,
  EyeOff,
  AlertTriangle,
  Download,
  ExternalLink,
} from "lucide-react";
import DOMPurify from "dompurify";
import { infoService, mediaUrl } from "@/services";
import { useIsMobile } from "@/hooks/useMediaQuery";
import SEO from "SEO";

const PDF_PANEL_ID = "rule-pdf-panel";

const AlumniAssociationBylaws = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bodyContent, setBodyContent] = useState("");
  const [showPDF, setShowPDF] = useState(true);

  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        // 端點與方法維持不變：GET info/constitutions/latest/
        const response = await infoService.latestConstitution();
        setBodyContent(response.data.description);
        setPdfFile(mediaUrl(response.data.pdf_file));
      } catch (err) {
        // 不對使用者洩漏原始例外字串，僅記錄於 console 供除錯
        console.error("讀取章程文件失敗", err);
        setError(true);
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
        <div className="mx-auto max-w-2xl" role="alert">
          <EmptyState
            title="無法載入章程"
            description="讀取章程文件時發生錯誤，請稍後再試。"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/40">
      <SEO
        main={false}
        title="章程"
        description="瀏覽智慧商務系友會的章程與規範，了解我們的運作方式與核心價值。"
        keywords={["智慧商務", "章程", "規範"]}
      />

      {/* 頁首橫幅 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy-deep text-primary-foreground">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-gold blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase ring-1 ring-white/20">
            <ScrollText className="h-4 w-4" aria-hidden="true" />
            Bylaws &amp; Regulations
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold">
            系友會章程
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-primary-foreground/80">
            了解智慧商務系友會的運作規範、組織架構與核心價值。
          </p>
          {pdfFile && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href={pdfFile} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" /> 在新分頁開啟
                </Button>
              </a>
              <a href={pdfFile} download>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" aria-hidden="true" /> 下載 PDF
                </Button>
              </a>
            </div>
          )}
          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-brand-gold" />
        </div>
      </div>

      <Section className="pt-12 sm:pt-16">
        {/* 介紹文字區塊 */}
        <Card className="overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  章程內容
                </h2>
                <p className="text-sm text-muted-foreground">系友會組織與運作之依據</p>
              </div>
            </div>
            {pdfFile && (
              <div className="flex flex-wrap items-center gap-2">
                <a href={pdfFile} download>
                  <Button variant="default" size="sm">
                    <Download className="h-4 w-4" aria-hidden="true" /> 下載 PDF
                  </Button>
                </a>
                {!isMobile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPDF((v) => !v)}
                    aria-expanded={showPDF}
                    aria-controls={PDF_PANEL_ID}
                  >
                    {showPDF ? (
                      <>
                        <EyeOff className="h-4 w-4" aria-hidden="true" /> 隱藏 PDF
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" aria-hidden="true" /> 顯示 PDF
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>

          <div
            className="prose prose-slate mt-6 max-w-none leading-loose text-foreground/80 break-words prose-headings:text-primary prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyContent) }}
          />
        </Card>

        {/* PDF 區塊 */}
        {pdfFile && (
          isMobile ? (
            /* 手機：不內嵌 <object>，改提供開啟／下載按鈕 */
            <Card className="mt-8 p-6 sm:p-8" id={PDF_PANEL_ID}>
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ScrollText className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">章程文件</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    為獲得最佳閱讀體驗，請在新分頁開啟或下載 PDF 檔案。
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a href={pdfFile} target="_blank" rel="noopener noreferrer">
                    <Button variant="default" size="default">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" /> 在新分頁開啟
                    </Button>
                  </a>
                  <a href={pdfFile} download>
                    <Button variant="outline" size="default">
                      <Download className="h-4 w-4" aria-hidden="true" /> 下載 PDF
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          ) : (
            showPDF && (
              /* 桌機：內建 PDF 檢視器 */
              <Card className="mt-8 overflow-hidden" id={PDF_PANEL_ID}>
                <div className="flex items-center gap-3 bg-gradient-to-r from-brand-navy to-brand-navy-deep px-5 py-4 text-primary-foreground">
                  <ScrollText className="h-5 w-5 text-brand-gold" aria-hidden="true" />
                  <h3 className="text-lg font-semibold">章程文件預覽</h3>
                  <a
                    href={pdfFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-gold hover:underline"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" /> 下載 PDF
                  </a>
                </div>
                <div className="h-[80vh] w-full bg-muted">
                  <object
                    data={`${pdfFile}#toolbar=0`}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    className="h-full w-full"
                    aria-label="章程 PDF 文件預覽"
                  >
                    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
                      <AlertTriangle className="h-8 w-8 text-brand-gold" aria-hidden="true" />
                      <p>您的瀏覽器不支援 PDF 檢視，請下載 PDF 檔案後再行檢視。</p>
                      <a href={pdfFile} download>
                        <Button variant="default" size="sm">
                          <Download className="h-4 w-4" aria-hidden="true" /> 下載 PDF
                        </Button>
                      </a>
                    </div>
                  </object>
                </div>
              </Card>
            )
          )
        )}
      </Section>
    </div>
  );
};

export default AlumniAssociationBylaws;
