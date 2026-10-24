import React from "react";
import { ShoppingCart, FileText, Lightbulb } from "lucide-react";
import { Card, Field } from "components/common/ui";

const ProductInfo = ({ company, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a]">
            <ShoppingCart size={18} />
          </span>
          <div>
            <h3 className="text-base font-semibold text-[#0f172a]">
              產品與服務
            </h3>
            <p className="text-sm text-base-content/60">
              填寫您主要的產品或服務資訊
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6">
          {/* 產品或服務名稱 */}
          <Field
            id="formProducts"
            as="input"
            type="text"
            name="products"
            label="產品或服務名稱"
            value={company.products}
            onChange={handleInputChange}
            placeholder="例如：智慧家電、企業顧問服務、有機食品"
            help="提示：列出您主要的產品或服務名稱，多項請用逗號「，」分隔。"
          />

          {/* 產品或服務簡介 */}
          <Field
            id="formProductDescription"
            as="textarea"
            rows={4}
            name="product_description"
            label="產品或服務簡介"
            value={company.product_description}
            onChange={handleInputChange}
            placeholder="簡單描述您的產品或服務特色、優勢和用途..."
            help={
              <>
                <span>提示：簡短描述您的產品或服務的特色和優勢。</span>
                <br />
                <span>註：未來系統有專門的產品詳細頁面，此處只需簡單介紹即可。</span>
              </>
            }
          />
        </div>
      </Card>

      {/* 產品描述撰寫小技巧 */}
      <Card padding="md" className="border border-[#a0781c]/20 bg-[#a0781c]/5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#a0781c]/15 text-[#a0781c]">
            <Lightbulb size={18} />
          </span>
          <div>
            <h3 className="text-base font-semibold text-[#0f172a] mb-2">
              產品描述撰寫小技巧
            </h3>
            <ul className="space-y-1.5 text-sm text-base-content/70">
              <li className="flex gap-2">
                <FileText size={16} className="mt-0.5 shrink-0 text-[#a0781c]" />
                簡單明瞭地說明產品或服務的主要功能
              </li>
              <li className="flex gap-2">
                <FileText size={16} className="mt-0.5 shrink-0 text-[#a0781c]" />
                提及您與競爭對手的差異化優勢
              </li>
              <li className="flex gap-2">
                <FileText size={16} className="mt-0.5 shrink-0 text-[#a0781c]" />
                說明產品或服務如何解決客戶的問題
              </li>
              <li className="flex gap-2">
                <FileText size={16} className="mt-0.5 shrink-0 text-[#a0781c]" />
                避免使用太多專業術語，讓一般人也能理解
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductInfo;
