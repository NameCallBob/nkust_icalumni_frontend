import React from "react";

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
      <div className="form-control w-full mb-4">
        <label htmlFor="formIndustry" className="label pb-1">
          <span className="label-text font-medium text-base-content" style={{ fontSize: "18px", fontWeight: "500" }}>
            行業分類
          </span>
        </label>
        {/* InputGroup：圖示前綴 + 下拉選單 */}
        <div className="flex w-full">
          <span className="flex items-center px-3 rounded-l-lg border border-r-0 border-base-300 bg-base-200">
            <span className="text-primary">🏢</span>
          </span>
          <select
            id="formIndustry"
            name="industry"
            value={company.industry}
            onChange={handleInputChange}
            className="select select-bordered w-full rounded-l-none"
            style={{
              fontSize: "16px",
              padding: "12px",
              borderColor: "#ced4da",
            }}
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
          </select>
        </div>
        <span className="label-text-alt text-base-content/60 mt-2" style={{ fontSize: "14px" }}>
          <span>✅ 提示：選擇最能代表您公司的產業類型，這將幫助潛在客戶更容易找到您。</span>
        </span>
      </div>

      <div className="card card-bordered bg-base-200 mb-3">
        <div className="card-body">
          <h2 className="card-title" style={{ fontSize: "16px" }}>為什麼選擇產業分類很重要？</h2>
          <div>
            正確選擇產業分類有助於：
            <ul>
              <li>提高在相關搜尋中的曝光率</li>
              <li>讓有興趣的客戶更容易找到您</li>
              <li>與同產業公司建立更多合作機會</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryDropdown;
