import React from 'react';
import { Sparkles } from 'lucide-react';
import AppModal from 'components/common/AppModal';

const ThankYouModal = ({ show, handleClose }) => {

  return (
    <AppModal
      show={show}
      onHide={handleClose}
      size="lg"
      variant="admin"
      title="哈摟系友～"
      icon={<Sparkles size={18} />}
      footer={
        <p className="text-center w-full m-0">請先到頁面左邊填寫個人資訊～</p>
      }
    >
      <div className="alert alert-warning text-center flex-col">
        <h3 className="text-lg font-bold">親愛的系友，請注意！</h3>
        <p>在開始使用系友會平台前，您需要完成兩個重要步驟：</p>
      </div>

      <div className="text-center mb-4">
        <h4 className="text-base font-semibold">📝 資料登錄檢查表</h4>
        <div className="flex justify-center">
          <ul className="text-left">
            <li>✅ 個人資料登錄</li>
            <li>✅ 工作/公司資料登錄</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <p className="text-base-content/60 mb-2">完成資料登錄後，您將可以：</p>
        <div className="flex justify-center">
          <ul className="text-left text-base-content/60 list-disc list-inside">
            <li>上傳個人、公司照片</li>
            <li>添加招募資訊</li>
            <li>登入各種商品</li>
          </ul>
        </div>
      </div>
    </AppModal>
  );
};

export default ThankYouModal;
