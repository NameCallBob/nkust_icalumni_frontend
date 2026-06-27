import React from "react";

const ProductInfo = ({ company, handleInputChange }) => {
  return (
    <div>
      {/* 產品或服務名稱 */}
      <div className="mb-4">
        <label
          htmlFor="formProducts"
          className="block mb-2"
          style={{ fontSize: "18px", fontWeight: "500" }}
        >
          產品或服務名稱
        </label>
        <div className="join w-full">
          <span className="join-item flex items-center px-3 bg-base-200 border border-base-300">
            <span className="text-primary">🛒</span>
          </span>
          <input
            id="formProducts"
            type="text"
            name="products"
            value={company.products}
            onChange={handleInputChange}
            placeholder="例如：智慧家電、企業顧問服務、有機食品"
            className="join-item input input-bordered w-full"
            style={{
              fontSize: "16px",
              padding: "12px",
              borderRadius: "8px",
            }}
          />
        </div>
        <p className="text-base-content/60 mt-2" style={{ fontSize: "14px" }}>
          <span>✅ 提示：列出您主要的產品或服務名稱，多項請用逗號「，」分隔。</span>
        </p>
      </div>

      {/* 產品或服務簡介 */}
      <div className="mb-4">
        <label
          htmlFor="formProductDescription"
          className="block mb-2"
          style={{ fontSize: "18px", fontWeight: "500" }}
        >
          產品或服務簡介
        </label>
        <div className="join w-full">
          <span className="join-item flex items-start px-3 pt-3 bg-base-200 border border-base-300">
            <span className="text-primary">📋</span>
          </span>
          <textarea
            id="formProductDescription"
            rows={3}
            name="product_description"
            value={company.product_description}
            onChange={handleInputChange}
            placeholder="簡單描述您的產品或服務特色、優勢和用途..."
            className="join-item textarea textarea-bordered w-full"
            style={{
              fontSize: "16px",
              padding: "12px",
              borderRadius: "8px",
            }}
          />
        </div>
        <p className="text-base-content/60 mt-2" style={{ fontSize: "14px" }}>
          <span>✅ 提示：簡短描述您的產品或服務的特色和優勢。</span><br/>
          <span>註：未來系統有專門的產品詳細頁面，此處只需簡單介紹即可。</span>
        </p>
      </div>

      {/* 產品描述撰寫小技巧 */}
      <div className="card card-bordered bg-base-200 mb-3">
        <div className="card-body">
          <h3 className="card-title" style={{ fontSize: "16px" }}>產品描述撰寫小技巧</h3>
          <div>
            <ul>
              <li>簡單明瞭地說明產品或服務的主要功能</li>
              <li>提及您與競爭對手的差異化優勢</li>
              <li>說明產品或服務如何解決客戶的問題</li>
              <li>避免使用太多專業術語，讓一般人也能理解</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
