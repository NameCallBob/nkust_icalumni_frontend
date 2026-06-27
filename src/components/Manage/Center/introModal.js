import React from 'react';
import { Sparkles, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import AppModal from 'components/common/AppModal';
import { ModalSection } from 'components/common/ui';

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
      <div className="alert alert-warning text-center flex-col mb-6">
        <h3 className="text-lg font-bold">親愛的系友，請注意！</h3>
        <p>在開始使用系友會平台前，您需要完成兩個重要步驟：</p>
      </div>

      <ModalSection title="資料登錄檢查表" icon={<ClipboardCheck size={18} />}>
        <ul className="space-y-1">
          <li className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-success" />個人資料登錄
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-success" />工作/公司資料登錄
          </li>
        </ul>
      </ModalSection>

      <ModalSection title="完成資料登錄後，您將可以">
        <ul className="list-disc list-inside text-base-content/60 space-y-1">
          <li>上傳個人、公司照片</li>
          <li>添加招募資訊</li>
          <li>登入各種商品</li>
        </ul>
      </ModalSection>
    </AppModal>
  );
};

export default ThankYouModal;
