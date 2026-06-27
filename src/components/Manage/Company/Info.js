import React from "react";
import { Card, Field } from "components/common/ui";
import { Building2, Users, FileText } from "lucide-react";

const CompanyInfo = ({ company, handleInputChange }) => {
  return (
    <Card padding="md">
      <div className="space-y-1">
        {/* 區塊標題 */}
        <div className="flex items-center gap-2 pb-4 mb-2 border-b border-base-200">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a]">
            <Building2 className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-[#0f172a]">公司基本資料</h3>
            <p className="text-sm text-base-content/60">填寫公司名稱、職位與簡介，將顯示於公司資料頁面</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {/* 公司名稱 */}
          <div className="md:col-span-2">
            <Field
              as="input"
              type="text"
              id="formName"
              name="name"
              value={company.name}
              onChange={handleInputChange}
              placeholder="例如：台灣創新科技有限公司"
              label={
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#a0781c]" /> 公司名稱
                </span>
              }
              help="提示：輸入您的公司完整名稱，這將顯示在您的公司資料頁面和搜尋結果中。"
            />
          </div>

          {/* 主要職位 */}
          <div className="md:col-span-2">
            <Field
              as="input"
              type="text"
              id="formPositions"
              name="positions"
              value={company.positions}
              onChange={handleInputChange}
              placeholder="例如：工程師、業務經理、客服專員"
              label={
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#a0781c]" /> 主要職位
                </span>
              }
              help="提示：請列出公司的主要職位，多個職位請用逗號「，」分隔。"
            />
          </div>

          {/* 公司簡介 */}
          <div className="md:col-span-2">
            <Field
              as="textarea"
              rows={4}
              id="formDescription"
              name="description"
              value={company.description}
              onChange={handleInputChange}
              placeholder="簡單介紹您的公司，例如：我們是一家專注於提供創新科技解決方案的公司，成立於2010年..."
              label={
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#a0781c]" /> 公司簡介
                </span>
              }
              help="提示：簡短描述您的公司背景、主要業務和特色，可讓潛在客戶更加了解您。建議寫100-300字。"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CompanyInfo;
