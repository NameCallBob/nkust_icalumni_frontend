import React from "react";
import { Building2, Info, CheckCircle2 } from "lucide-react";
import { Field, Card } from "components/common/ui";

const IndustryDropdown = ({ industries, company, handleInputChange }) => {
  // 產業分類分組顯示
  const groupedIndustries = {
    "製造業": industries.filter(i => i.title.includes("製造")),
    "服務業": industries.filter(i => i.title.includes("服務")),
    "科技業": industries.filter(i => i.title.includes("科技") || i.title.includes("電子") || i.title.includes("資訊")),
    "其他": industries.filter(i => !i.title.includes("製造") && !i.title.includes("服務") && !i.title.includes("科技") && !i.title.includes("電子") && !i.title.includes("資訊"))
  };

  return (
    <div>
      {/* 行業分類下拉：圖示前綴 + Field 封裝的 select */}
      <Field
        as="select"
        label={
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#1e3a8a]/10 text-[#1e3a8a]">
              <Building2 className="h-4 w-4" />
            </span>
            行業分類
          </span>
        }
        id="formIndustry"
        name="industry"
        value={company.industry}
        onChange={handleInputChange}
        help={
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            提示：選擇最能代表您公司的產業類型，這將幫助潛在客戶更容易找到您。
          </span>
        }
      >
        <option value="">-- 請選擇行業分類 --</option>

        {Object.entries(groupedIndustries).map(([group, items]) => (
          items.length > 0 && (
            <optgroup label={group} key={group}>
              {items.map((industry) => (
                <option key={industry.id} value={industry.title}>
                  {industry.title}
                </option>
              ))}
            </optgroup>
          )
        ))}
      </Field>

      {/* 說明卡片 */}
      <Card padding="md" className="border border-slate-200 bg-slate-50">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[#0f172a]">
          <Info className="h-4 w-4 text-[#a0781c]" />
          為什麼選擇產業分類很重要？
        </h2>
        <p className="mt-2 text-sm text-slate-600">正確選擇產業分類有助於：</p>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1e3a8a]" />
            提高在相關搜尋中的曝光率
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1e3a8a]" />
            讓有興趣的客戶更容易找到您
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1e3a8a]" />
            與同產業公司建立更多合作機會
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default IndustryDropdown;
