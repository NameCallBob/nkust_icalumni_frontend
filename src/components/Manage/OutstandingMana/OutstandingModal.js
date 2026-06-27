import Axios from "common/Axios";
import React, { useState, useEffect } from "react";
import AppModal from "components/common/AppModal";
import { Button, Field, Spinner } from "components/common/ui";
import {
  Award,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Search,
} from "lucide-react";

const AddOutstandingAlumniModal = ({ show, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);
  const [alumniData, setAlumniData] = useState({
    highlight: "",
    achievements: "",
    is_featured: false,
    sort_order: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === 1) fetchMembers();
  }, [step, page, searchQuery]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await Axios().get("member/admin/tableOutput_all/", {
        params: { page, search: searchQuery, page_size: pageSize },
      });
      setMembers(res.data || []);
      setTotalResults(res.data || 0);
    } catch (err) {
      console.error("Error fetching members:", err);
      setMembers([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (selectedMember) {
      setAlumniData((prev) => ({ ...prev, member: selectedMember.id }));
      setStep(2);
    }
  };

  const handleSubmit = () => {
    if (!alumniData.highlight) {
      alert("請填寫摘要");
      return;
    }
    onSubmit(alumniData);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setSearchQuery("");
    setPage(1);
    setSelectedMember(null);
    setAlumniData({ highlight: "", achievements: "", is_featured: false, sort_order: 0 });
    onClose();
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  // 底部按鈕區
  const footer = (
    <>
      <Button variant="ghost" onClick={resetForm}>
        <X size={16} /> 取消
      </Button>
      {step === 1 && (
        <Button
          variant="primary"
          disabled={!selectedMember || loading}
          onClick={handleNextStep}
        >
          <ArrowRight size={16} /> 下一步
        </Button>
      )}
      {step === 2 && (
        <>
          <Button variant="outline" onClick={() => setStep(1)}>
            <ArrowLeft size={16} /> 上一步
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!alumniData.highlight}
          >
            <Check size={16} /> 新增
          </Button>
        </>
      )}
    </>
  );

  return (
    <AppModal
      show={show}
      onHide={resetForm}
      title={step === 1 ? "選擇系友" : "填寫傑出系友資料"}
      icon={<Award size={20} />}
      size="lg"
      variant="admin"
      steps={["選擇系友", "填寫傑出系友資料"]}
      currentStep={step - 1}
      footer={footer}
    >
      {step === 1 && (
        <>
          <div className="relative mb-3">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
            />
            <input
              className="input input-bordered w-full pl-9"
              placeholder="輸入名稱查詢..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // 查詢時重置到第一頁
              }}
            />
          </div>

          {loading ? (
            <div className="text-center my-4">
              <Spinner center label="載入中..." />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>名稱</th>
                      <th>電子郵件</th>
                      <th className="text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length > 0 ? (
                      members.map((member) => (
                        <tr key={member.id}>
                          <td>{member.name}</td>
                          <td>{member.email || "無"}</td>
                          <td className="text-center">
                            <Button
                              variant={
                                selectedMember?.id === member.id
                                  ? "primary"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => setSelectedMember(member)}
                            >
                              <Check size={16} />{" "}
                              {selectedMember?.id === member.id ? "已選" : "選擇"}
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-base-content/60">
                          無符合條件的系友
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="join flex justify-center mt-3">
                  <button
                    className="join-item btn btn-sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    «
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`join-item btn btn-sm ${
                        index + 1 === page ? "btn-primary" : ""
                      }`}
                      onClick={() => setPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className="join-item btn btn-sm"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                  >
                    »
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
      {step === 2 && (
        <div>
          <Field
            label="摘要"
            required
            type="text"
            placeholder="輸入系友的簡要介紹"
            value={alumniData.highlight}
            onChange={(e) =>
              setAlumniData({ ...alumniData, highlight: e.target.value })
            }
          />
          <Field
            as="textarea"
            label="詳細成就"
            rows={4}
            placeholder="輸入系友的詳細成就（選填）"
            value={alumniData.achievements}
            onChange={(e) =>
              setAlumniData({ ...alumniData, achievements: e.target.value })
            }
          />
          <Field
            label="顯示順序"
            type="number"
            min="0"
            placeholder="輸入顯示順序（數字越小越前面）"
            value={alumniData.sort_order}
            onChange={(e) =>
              setAlumniData({ ...alumniData, sort_order: parseInt(e.target.value) || 0 })
            }
            help="順序數字越小，在列表中顯示越前面"
          />
          <div className="form-control mb-4">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={alumniData.is_featured}
                onChange={(e) =>
                  setAlumniData({ ...alumniData, is_featured: e.target.checked })
                }
              />
              <span className="label-text">展示於官網</span>
            </label>
          </div>
          {selectedMember && (
            <div className="mt-3 p-3 bg-base-200 rounded-lg">
              <strong>已選擇系友：</strong> {selectedMember.name} (
              {selectedMember.email || "無"})
            </div>
          )}
        </div>
      )}
    </AppModal>
  );
};

export default AddOutstandingAlumniModal;
