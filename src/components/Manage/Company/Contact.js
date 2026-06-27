import React from "react";
import { Globe, MapPin, Mail, Phone, ImageIcon, Camera, UploadCloud, Info, Lightbulb } from "lucide-react";
import { Card, Field } from "components/common/ui";

const ContactInfo = ({ company, handleInputChange, handleFileChange }) => {
  return (
    <div className="space-y-6">
      {/* 聯絡資訊欄位 */}
      <Card padding="md">
        <div className="mb-5 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a]">
            <Phone size={18} />
          </span>
          <h3 className="text-base font-semibold text-[#0f172a]">聯絡資訊</h3>
        </div>

        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
          <div className="md:col-span-1">
            <Field
              as="input"
              label={
                <span className="inline-flex items-center gap-1.5">
                  <Globe size={15} className="text-[#1e3a8a]" />
                  公司網站連結
                </span>
              }
              id="formWebsite"
              type="url"
              name="website"
              value={company.website}
              onChange={handleInputChange}
              placeholder="例如：https://www.example.com"
              help="提示：輸入完整網址，記得包含 http:// 或 https://"
            />
          </div>

          <div className="md:col-span-1">
            <Field
              as="input"
              label={
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={15} className="text-[#1e3a8a]" />
                  聯絡信箱
                </span>
              }
              id="formEmail"
              type="email"
              name="email"
              value={company.email}
              onChange={handleInputChange}
              placeholder="例如：contact@example.com"
              help="提示：建議使用公司信箱，而非個人信箱"
            />
          </div>

          <div className="md:col-span-1">
            <Field
              as="input"
              label={
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={15} className="text-[#1e3a8a]" />
                  聯絡電話
                </span>
              }
              id="formPhoneNumber"
              type="text"
              name="phone_number"
              value={company.phone_number}
              onChange={handleInputChange}
              placeholder="例如：0287654321 或 0912345678"
              help="提示：請只輸入數字，不需輸入其他符號如空格、橫線等"
            />
          </div>

          <div className="md:col-span-1">
            <Field
              as="textarea"
              rows={2}
              label={
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={15} className="text-[#1e3a8a]" />
                  公司地址
                </span>
              }
              id="formAddress"
              name="address"
              value={company.address}
              onChange={handleInputChange}
              placeholder="例如：台北市信義區松仁路100號10樓"
              help="提示：填寫完整地址，包含郵遞區號（如有）"
            />
          </div>
        </div>
      </Card>

      {/* 照片上傳教學 */}
      <Card padding="md" className="bg-[#1e3a8a]/[0.04] border-[#1e3a8a]/20">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a8a]/10 text-[#1e3a8a]">
            <Camera size={18} />
          </span>
          <h3 className="text-base font-semibold text-[#0f172a]">照片上傳教學</h3>
        </div>
        <ol className="list-decimal space-y-1 pl-6 text-sm text-[#0f172a]/80">
          <li>準備一張清晰的公司照片（如公司外觀、辦公環境或團隊合照）</li>
          <li>點擊下方「選擇檔案」按鈕</li>
          <li>在您的電腦中選取照片</li>
          <li>照片會自動顯示在預覽區域</li>
        </ol>
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
          <Info size={16} className="mt-0.5 shrink-0" />
          <span>
            <b>注意：</b> 照片大小不能超過 5MB，建議使用正方形照片獲得最佳顯示效果。
          </span>
        </div>
      </Card>

      {/* 公司照片上傳 */}
      <Card padding="md">
        <div className="form-control w-full">
          <label htmlFor="formPhoto" className="label pb-1">
            <span className="label-text font-medium text-base-content inline-flex items-center gap-1.5">
              <UploadCloud size={15} className="text-[#1e3a8a]" />
              公司照片
            </span>
          </label>
          <input
            id="formPhoto"
            type="file"
            name="photo"
            accept="image/jpeg, image/png, image/gif"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
          <span className="label-text-alt text-base-content/60 mt-2 block">
            提示：上傳公司外觀、辦公環境或團隊合照，檔案大小不超過 5MB
          </span>
        </div>

        {/* 照片預覽 */}
        <div className="mt-6">
          <h4 className="mb-4 text-center text-base font-semibold text-[#0f172a]">照片預覽</h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="text-center">
              <h5 className="mb-3 text-sm font-medium text-[#0f172a]/80">您上傳的照片</h5>
              <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-100 p-3">
                {company.photo ? (
                  <img
                    src={company.photo}
                    alt="上傳照片預覽"
                    className="h-auto max-w-full"
                    style={{ maxWidth: "100%", maxHeight: "250px", objectFit: "contain" }}
                  />
                ) : company.photo_url ? (
                  <img
                    src={process.env.REACT_APP_BASE_URL + company.photo_url}
                    alt="公司照片"
                    className="h-auto max-w-full"
                    style={{ maxWidth: "100%", maxHeight: "250px", objectFit: "contain" }}
                  />
                ) : (
                  <div className="p-5 text-center text-base-content/50">
                    <Camera size={40} className="mx-auto" />
                    <p className="mt-3 text-sm">尚未上傳照片</p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <h5 className="mb-3 text-sm font-medium text-[#0f172a]/80">在網站上的顯示效果</h5>
              <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-200/50 p-3">
                {company.photo ? (
                  <img
                    src={company.photo}
                    className="h-auto max-w-full rounded-lg"
                    style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px" }}
                    alt="網站顯示效果預覽"
                  />
                ) : company.photo_url ? (
                  <img
                    src={process.env.REACT_APP_BASE_URL + company.photo_url}
                    className="h-auto max-w-full rounded-lg"
                    style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px" }}
                    alt="網站顯示效果預覽"
                  />
                ) : (
                  <div className="p-5 text-center text-base-content/50">
                    <ImageIcon size={40} className="mx-auto" />
                    <p className="mt-3 text-sm">尚未上傳照片</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 專業提示 */}
      <div className="flex items-start gap-2 rounded-xl bg-[#a0781c]/10 px-4 py-3 text-sm text-[#0f172a]/80">
        <Lightbulb size={18} className="mt-0.5 shrink-0 text-[#a0781c]" />
        <div>
          <p className="mb-1 font-semibold text-[#0f172a]">專業提示</p>
          <p>
            上傳一張高品質的公司照片可以提高客戶對您的信任度及專業形象。
            <br />
            建議使用專業拍攝的照片，避免使用模糊或像素低的圖片。
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
