import React, { useState } from 'react';
import { UserPlus, Building2 } from 'lucide-react';
import AppModal from 'components/common/AppModal';
import { Button, Field, Spinner } from 'components/common/ui';

/**
 * 開發驗收頁（非正式路由）— Node 就緒後，臨時掛到路由即可目視驗收
 * AppModal 與原子元件的深藍高級風格。驗收後刪除此檔。
 *
 * 暫時掛載方式（App.js 內加一條 route）：
 *   <Route path="/_dev/modal" element={<DevModalDemo />} />
 */
const STEPS = ['基本資料', '聯絡資訊', '詳細說明', '上傳圖片'];

export default function DevModalDemo() {
  const [openForm, setOpenForm] = useState(false);
  const [openShowcase, setOpenShowcase] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [step, setStep] = useState(0);

  return (
    <div data-theme="nkust" className="min-h-screen bg-base-200 p-10">
      <h1 className="font-serif text-2xl font-semibold text-primary mb-6">
        AppModal 驗收頁
      </h1>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setOpenForm(true)} variant="primary">
          開啟表單型（admin / 多步驟）
        </Button>
        <Button onClick={() => setOpenShowcase(true)} variant="secondary">
          開啟展示型（showcase）
        </Button>
        <Button onClick={() => setOpenConfirm(true)} variant="outline">
          開啟確認框（sm）
        </Button>
      </div>

      {/* 表單型 + 多步驟 */}
      <AppModal
        show={openForm}
        onHide={() => setOpenForm(false)}
        title="新增校友資料"
        icon={<UserPlus size={18} />}
        size="lg"
        steps={STEPS}
        currentStep={step}
        footer={
          <>
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))}>
              上一步
            </Button>
            <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
              下一步
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <Field label="姓名" required placeholder="請輸入姓名" />
          <Field as="select" label="性別" required>
            <option value="">請選擇</option>
            <option value="M">男</option>
            <option value="F">女</option>
          </Field>
          <Field label="行動電話" placeholder="09xx-xxx-xxx" />
          <Field label="Email" type="email" help="作為登入帳號" />
          <div className="md:col-span-2">
            <Field as="textarea" label="簡介" rows={4} placeholder="個人簡介…" />
          </div>
        </div>
      </AppModal>

      {/* 展示型 */}
      <AppModal
        show={openShowcase}
        onHide={() => setOpenShowcase(false)}
        title="最新活動"
        icon={<Building2 size={18} />}
        size="lg"
        variant="showcase"
      >
        <div className="flex items-center justify-center h-72 bg-gradient-to-br from-navy-600 to-navy-900 text-white">
          <Spinner size="lg" center label="（此處放展示圖／輪播）" />
        </div>
      </AppModal>

      {/* 確認框 */}
      <AppModal
        show={openConfirm}
        onHide={() => setOpenConfirm(false)}
        title="確認刪除"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpenConfirm(false)}>
              取消
            </Button>
            <Button variant="error" onClick={() => setOpenConfirm(false)}>
              確認刪除
            </Button>
          </>
        }
      >
        <p className="text-base-content/80">此操作無法復原，確定要刪除嗎？</p>
      </AppModal>
    </div>
  );
}
