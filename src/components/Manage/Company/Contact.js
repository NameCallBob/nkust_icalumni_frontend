import React from "react";

const ContactInfo = ({ company, handleInputChange, handleFileChange }) => {
  return (
    <div>
      <div className="form-control w-full mb-4">
        <label htmlFor="formWebsite" className="label pb-1">
          <span className="label-text" style={{ fontSize: "18px", fontWeight: "500" }}>
            公司網站連結
          </span>
        </label>
        <label className="input input-bordered flex items-center gap-2 w-full" style={{ height: "auto" }}>
          <span className="text-primary">🌐</span>
          <input
            id="formWebsite"
            type="url"
            name="website"
            value={company.website}
            onChange={handleInputChange}
            placeholder="例如：https://www.example.com"
            className="grow"
            style={{ fontSize: "16px", padding: "12px", borderRadius: "8px" }}
          />
        </label>
        <span className="label-text-alt text-base-content/60 mt-2" style={{ fontSize: "14px" }}>
          ✅ 提示：輸入完整網址，記得包含 http:// 或 https://
        </span>
      </div>

      <div className="form-control w-full mb-4">
        <label htmlFor="formAddress" className="label pb-1">
          <span className="label-text" style={{ fontSize: "18px", fontWeight: "500" }}>
            公司地址
          </span>
        </label>
        <label className="textarea textarea-bordered flex items-start gap-2 w-full">
          <span className="text-primary mt-1">📍</span>
          <textarea
            id="formAddress"
            rows={2}
            name="address"
            value={company.address}
            onChange={handleInputChange}
            placeholder="例如：台北市信義區松仁路100號10樓"
            className="grow bg-transparent border-0 outline-none resize-y"
            style={{ fontSize: "16px", padding: "12px", borderRadius: "8px" }}
          />
        </label>
        <span className="label-text-alt text-base-content/60 mt-2" style={{ fontSize: "14px" }}>
          ✅ 提示：填寫完整地址，包含郵遞區號（如有）
        </span>
      </div>

      <div className="form-control w-full mb-4">
        <label htmlFor="formEmail" className="label pb-1">
          <span className="label-text" style={{ fontSize: "18px", fontWeight: "500" }}>
            聯絡信箱
          </span>
        </label>
        <label className="input input-bordered flex items-center gap-2 w-full" style={{ height: "auto" }}>
          <span className="text-primary">✉️</span>
          <input
            id="formEmail"
            type="email"
            name="email"
            value={company.email}
            onChange={handleInputChange}
            placeholder="例如：contact@example.com"
            className="grow"
            style={{ fontSize: "16px", padding: "12px", borderRadius: "8px" }}
          />
        </label>
        <span className="label-text-alt text-base-content/60 mt-2" style={{ fontSize: "14px" }}>
          ✅ 提示：建議使用公司信箱，而非個人信箱
        </span>
      </div>

      <div className="form-control w-full mb-4">
        <label htmlFor="formPhoneNumber" className="label pb-1">
          <span className="label-text" style={{ fontSize: "18px", fontWeight: "500" }}>
            聯絡電話
          </span>
        </label>
        <label className="input input-bordered flex items-center gap-2 w-full" style={{ height: "auto" }}>
          <span className="text-primary">📞</span>
          <input
            id="formPhoneNumber"
            type="text"
            name="phone_number"
            value={company.phone_number}
            onChange={handleInputChange}
            placeholder="例如：0287654321 或 0912345678"
            className="grow"
            style={{ fontSize: "16px", padding: "12px", borderRadius: "8px" }}
          />
        </label>
        <span className="label-text-alt text-base-content/60 mt-2" style={{ fontSize: "14px" }}>
          ✅ 提示：請只輸入數字，不需輸入其他符號如空格、橫線等
        </span>
      </div>

      <div className="card card-bordered bg-base-200 mb-4">
        <div className="card-body">
          <h3 className="card-title" style={{ fontSize: "16px" }}>照片上傳教學</h3>
          <div>
            <ol>
              <li>準備一張清晰的公司照片（如公司外觀、辦公環境或團隊合照）</li>
              <li>點擊下方「選擇檔案」按鈕</li>
              <li>在您的電腦中選取照片</li>
              <li>照片會自動顯示在預覽區域</li>
            </ol>
            <div className="alert alert-warning mt-2">
              <span>
                <b>注意：</b> 照片大小不能超過 5MB，建議使用正方形照片獲得最佳顯示效果。
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-control w-full mb-4">
        <label htmlFor="formPhoto" className="label pb-1">
          <span className="label-text" style={{ fontSize: "18px", fontWeight: "500" }}>
            公司照片
          </span>
        </label>
        <div className="custom-file-upload">
          <input
            id="formPhoto"
            type="file"
            name="photo"
            accept="image/jpeg, image/png, image/gif"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
            style={{ padding: "12px", borderRadius: "8px", fontSize: "16px" }}
          />
          <span className="label-text-alt text-base-content/60 mt-2 block" style={{ fontSize: "14px" }}>
            ✅ 提示：上傳公司外觀、辦公環境或團隊合照，檔案大小不超過 5MB
          </span>
        </div>
      </div>

      <h4 className="text-center mt-5 mb-3 text-lg font-semibold">照片預覽</h4>

      <div className="grid grid-cols-12 gap-4 text-center">
        <div className="col-span-12 md:col-span-6 mb-4">
          <h5 style={{ fontSize: "18px", marginBottom: "15px" }}>您上傳的照片</h5>
          <div style={{ border: "1px dashed #ccc", padding: "10px", borderRadius: "8px", minHeight: "200px" }}>
            {company.photo ? (
              <img
                src={company.photo}
                alt="上傳照片預覽"
                className="max-w-full h-auto"
                style={{
                  maxWidth: "100%",
                  maxHeight: "250px",
                  objectFit: "contain",
                }}
              />
            ) : company.photo_url ? (
              <img
                src={process.env.REACT_APP_BASE_URL + company.photo_url}
                alt="公司照片"
                className="max-w-full h-auto"
                style={{
                  maxWidth: "100%",
                  maxHeight: "250px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div className="text-center p-5 text-base-content/60">
                <span style={{ fontSize: "40px" }}>📷</span>
                <p className="mt-3">尚未上傳照片</p>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 mb-4">
          <h5 style={{ fontSize: "18px", marginBottom: "15px" }}>在網站上的顯示效果</h5>
          <div style={{ border: "1px dashed #ccc", padding: "10px", borderRadius: "8px", minHeight: "200px", backgroundColor: "#f9f9f9" }}>
            {company.photo ? (
              <img
                src={company.photo}
                className="max-w-full h-auto rounded"
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                alt="網站顯示效果預覽"
              />
            ) : company.photo_url ? (
              <img
                src={process.env.REACT_APP_BASE_URL + company.photo_url}
                className="max-w-full h-auto rounded"
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                alt="網站顯示效果預覽"
              />
            ) : (
              <div className="text-center p-5 text-base-content/60">
                <span style={{ fontSize: "40px" }}>🖼️</span>
                <p className="mt-3">尚未上傳照片</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center p-3 bg-base-200 rounded" style={{ fontSize: "16px" }}>
        <p className="mb-1">💡 <b>專業提示：</b></p>
        <p>上傳一張高品質的公司照片可以提高客戶對您的信任度及專業形象。<br/>
        建議使用專業拍攝的照片，避免使用模糊或像素低的圖片。</p>
      </div>
    </div>
  );
};

export default ContactInfo;
