import Axios from "common/Axios";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Table,
  Form,
  InputGroup,
  Spinner,
  Pagination,
  Badge,
} from "react-bootstrap";
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
    setAlumniData({ highlight: "", achievements: "", is_featured: false });
    onClose();
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <Modal show={show} onHide={resetForm} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {step === 1 ? "選擇系友" : "填寫傑出系友資料"}
          <Badge bg="secondary" className="ms-2">
            步驟 {step}/2
          </Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 && (
          <>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="輸入名稱查詢..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // 查詢時重置到第一頁
                }}
              />
            </InputGroup>

            {loading ? (
              <div className="text-center my-4">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-2">載入中...</p>
              </div>
            ) : (
              <>
                <Table hover responsive className="shadow-sm">
                  <thead className="bg-light">
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
                                  : "outline-primary"
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
                        <td colSpan="3" className="text-center text-muted">
                          無符合條件的系友
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                {totalPages > 1 && (
                  <Pagination className="justify-content-center mt-3">
                    <Pagination.Prev
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === page}
                        onClick={() => setPage(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                    />
                  </Pagination>
                )}
              </>
            )}
          </>
        )}
        {step === 2 && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                摘要 <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="輸入系友的簡要介紹"
                value={alumniData.highlight}
                onChange={(e) =>
                  setAlumniData({ ...alumniData, highlight: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>詳細成就</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="輸入系友的詳細成就（選填）"
                value={alumniData.achievements}
                onChange={(e) =>
                  setAlumniData({ ...alumniData, achievements: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="switch"
                label="展示於官網"
                checked={alumniData.is_featured}
                onChange={(e) =>
                  setAlumniData({ ...alumniData, is_featured: e.target.checked })
                }
              />
            </Form.Group>
            {selectedMember && (
              <div className="mt-3 p-3 bg-light rounded">
                <strong>已選擇系友：</strong> {selectedMember.name} (
                {selectedMember.email || "無"})
              </div>
            )}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={resetForm}>
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
            <Button
              variant="outline-primary"
              onClick={() => setStep(1)}
              className="me-2"
            >
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
      </Modal.Footer>
    </Modal>
  );
};

export default AddOutstandingAlumniModal;