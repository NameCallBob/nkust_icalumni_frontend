import Axios from "common/Axios";
import React, { useState, useEffect } from "react";
import AppModal from "components/common/AppModal";
import { Button, Field, Spinner } from "components/common/ui";
import { UserPlus } from "lucide-react";
import "bootstrap-icons/font/bootstrap-icons.css";

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
    sort_order: 1,
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
    setAlumniData({ highlight: "", achievements: "", is_featured: false, sort_order: 1 });
    onClose();
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  // 底部按鈕區
  const footer = (
    <>
      <Button variant="ghost" onClick={resetForm}>
        <i className="bi bi-x-lg"></i> 取消
      </Button>
      {step === 1 && (
        <Button
          variant="primary"
          disabled={!selectedMember || loading}
          onClick={handleNextStep}
        >
          <i className="bi bi-arrow-right"></i> 下一步
        </Button>
      )}
      {step === 2 && (
        <>
          <Button variant="outline" onClick={() => setStep(1)} className="me-2">
            <i className="bi bi-arrow-left"></i> 上一步
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!alumniData.highlight}
          >
            <i className="bi bi-check2"></i> 新增
          </Button>
        </>
      )}
    </>
  );

  return (
    <AppModal
      show={show}
      onHide={resetForm}
      size="lg"
      variant="admin"
      title={step === 1 ? "選擇校友" : "填寫傑出校友資料"}
      icon={<UserPlus size={18} />}
      steps={["選擇校友", "填寫傑出校友資料"]}
      currentStep={step - 1}
      footer={footer}
    >
      {step === 1 && (
        <>
          <label className="input input-bordered flex items-center gap-2 mb-3">
            <i className="bi bi-search"></i>
            <input
              type="text"
              className="grow"
              placeholder="輸入名稱查詢..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </label>

          {loading ? (
            <Spinner size="md" center label="載入中..." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table table-zebra shadow-sm">
                  <thead className="bg-base-200">
                    <tr>
                      <th>名稱</th>
                      <th>電子郵件</th>
                      <th className="text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length > 0 ? (
                      members.map((member) => (
                        <tr key={member.id} className="hover">
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
                              <i className="bi bi-check-lg"></i>{" "}
                              {selectedMember?.id === member.id ? "已選" : "選擇"}
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-base-content/60">
                          無符合條件的校友
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
                        index + 1 === page ? "btn-active btn-primary" : ""
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
        <form>
          <Field
            as="input"
            type="text"
            label="摘要"
            required
            placeholder="輸入校友的簡要介紹"
            value={alumniData.highlight}
            onChange={(e) =>
              setAlumniData({ ...alumniData, highlight: e.target.value })
            }
          />
          <Field
            as="textarea"
            label="詳細成就"
            rows={4}
            placeholder="輸入校友的詳細成就（選填）"
            value={alumniData.achievements}
            onChange={(e) =>
              setAlumniData({ ...alumniData, achievements: e.target.value })
            }
          />
          <Field
            as="input"
            type="number"
            min="0"
            label="顯示順序"
            placeholder="輸入顯示順序（數字越小越前面）"
            help="順序數字越小，在列表中顯示越前面"
            value={alumniData.sort_order}
            onChange={(e) =>
              setAlumniData({ ...alumniData, sort_order: parseInt(e.target.value) || 0 })
            }
          />
          <div className="form-control">
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
            <div className="mt-3 p-3 bg-base-200 rounded">
              <strong>已選擇校友：</strong> {selectedMember.name} (
              {selectedMember.email || "無"})
            </div>
          )}
        </form>
      )}
    </AppModal>
  );
};

export default AddOutstandingAlumniModal;
