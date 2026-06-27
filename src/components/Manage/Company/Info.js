import React from "react";

const CompanyInfo = ({ company, handleInputChange }) => {
  return (
    <div>
      {/* 公司名稱 */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <div className="form-control w-full mb-4">
            <label className="label pb-1" htmlFor="formName">
              <span className="label-text font-medium text-[18px] text-base-content">
                公司名稱
              </span>
            </label>
            <div className="join w-full">
              <span className="join-item flex items-center px-3 bg-base-200 border border-base-300">
                <span className="text-primary">💼</span>
              </span>
              <input
                id="formName"
                type="text"
                name="name"
                value={company.name}
                onChange={handleInputChange}
                placeholder="例如：台灣創新科技有限公司"
                className="join-item input input-bordered w-full text-[16px] p-3"
              />
            </div>
            <span className="label-text-alt text-base-content/60 mt-2 text-[14px]">
              ✅ 提示：輸入您的公司完整名稱，這將顯示在您的公司資料頁面和搜尋結果中。
            </span>
          </div>
        </div>
      </div>

      {/* 主要職位 */}
      <div className="form-control w-full mb-4">
        <label className="label pb-1" htmlFor="formPositions">
          <span className="label-text font-medium text-[18px] text-base-content">
            主要職位
          </span>
        </label>
        <div className="join w-full">
          <span className="join-item flex items-center px-3 bg-base-200 border border-base-300">
            <span className="text-primary">👥</span>
          </span>
          <input
            id="formPositions"
            type="text"
            name="positions"
            value={company.positions}
            onChange={handleInputChange}
            placeholder="例如：工程師、業務經理、客服專員"
            className="join-item input input-bordered w-full text-[16px] p-3"
          />
        </div>
        <span className="label-text-alt text-base-content/60 mt-2 text-[14px]">
          ✅ 提示：請列出公司的主要職位，多個職位請用逗號「，」分隔。
        </span>
      </div>

      {/* 公司簡介 */}
      <div className="form-control w-full mb-4">
        <label className="label pb-1" htmlFor="formDescription">
          <span className="label-text font-medium text-[18px] text-base-content">
            公司簡介
          </span>
        </label>
        <div className="flex w-full">
          <span className="flex items-start px-3 pt-3 bg-base-200 border border-base-300 border-r-0 rounded-l-lg">
            <span className="text-primary">📝</span>
          </span>
          <textarea
            id="formDescription"
            rows={4}
            name="description"
            value={company.description}
            onChange={handleInputChange}
            placeholder="簡單介紹您的公司，例如：我們是一家專注於提供創新科技解決方案的公司，成立於2010年..."
            className="textarea textarea-bordered w-full rounded-l-none text-[16px] p-3"
          />
        </div>
        <span className="label-text-alt text-base-content/60 mt-2 text-[14px]">
          ✅ 提示：簡短描述您的公司背景、主要業務和特色，可讓潛在客戶更加了解您。建議寫100-300字。
        </span>
      </div>
    </div>
  );
};

export default CompanyInfo;
