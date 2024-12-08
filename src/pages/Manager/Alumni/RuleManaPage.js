import Axios from 'common/Axios';
import React, { useState ,useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RuleManaPage = () => {
  // 狀態管理
  const [viewRule, setViewRule] = useState(null);
  const [rules, setRules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRule, setCurrentRule] = useState({
    id: null,
    date: '',
    intro: '',
    file: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // 模態框控制函數
  const handleClose = () => {
    setShowModal(false);
    setCurrentRule({
      id: null,
      date: '',
      intro: '',
      file: null
    });
  };

  const handleShow = (rule = null) => {
    if (rule) {
      // 編輯模式
      setCurrentRule(rule);
      setIsEditing(true);
    } else {
      // 新增模式
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('請上傳 PDF 檔案');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('檔案大小不得超過 5MB');
        return;
      }
      setCurrentRule((prev) => ({
        ...prev,
        file,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
        // 使用 FormData
        const formData = new FormData();
        formData.append('intro', currentRule.intro); // 添加章程簡介
        if (currentRule.file) {
            formData.append('pdf_file', currentRule.file); // 添加 PDF 檔案
        }

        if (isEditing) {
            // 編輯模式
            formData.append('id', currentRule.id); // 傳遞 ID
            const originalRule = rules.find((rule) => rule.id === currentRule.id);
            const isUpdated =
                originalRule.intro !== currentRule.intro || !!currentRule.file;

            if (!isUpdated) {
                alert('未檢測到任何變更');
                return;
            }

            // 傳送更新請求
            await Axios().put(`/info/constitutions/change/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // 確保以多部分表單數據格式發送
                },
            });

            // 更新本地資料
            setRules((prevRules) =>
                prevRules.map((rule) =>
                    rule.id === currentRule.id
                        ? { ...rule, ...currentRule, updated_at: new Date().toLocaleString() }
                        : rule
                )
            );
        } else {
            // 新增模式
            const response = await Axios().post('/info/constitutions/new/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // 添加到本地資料
            setRules((prevRules) => [
                { ...response.data, updated_at: new Date().toLocaleString() },
                ...prevRules,
            ]);
        }

        handleClose();
    } catch (error) {
        console.error('提交失敗:', error);
        alert('提交失敗，請稍後再試');
    }
};

  const handleDelete = async (id) => {
    try {
      await Axios().delete(`/info/constitutions/remove/`,{data:{'id':id}});
      setRules((prevRules) => prevRules.filter((rule) => rule.id !== id));
    } catch (error) {
      console.error('刪除失敗:', error);
      alert('刪除失敗，請稍後再試');
    }
  };



// 查看處理
const handleView = (rule) => {
    setViewRule(rule);
    setShowViewModal(true);
  };

  // 關閉查看模態框
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewRule(null);
  };

  useEffect(() => {
    cleanupFileUrls()
    Axios().get("/info/constitutions/all/")
    .then((res) => {
        setRules(res.data)
    })
  },[])

   // 釋放 URL 資源
   const cleanupFileUrls = () => {
    rules.forEach(rule => {
      if (rule.pdf_file) {
        URL.revokeObjectURL(rule.pdf_file);
      }
    });
  };
  return (
    <Container className="mt-5">
    <h1 className="text-center mb-4">章程管理系統</h1>

    <div className="mb-3">
      <Button variant="primary" onClick={() => handleShow()}>
        新增章程
      </Button>
    </div>

    <Table striped bordered hover>
      <thead>
        <tr>
          <th>流水號</th>
          <th>上傳日期</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {rules.map((rule) => (
          <tr key={rule.id}>
            <td>{rule.id}</td>
            <td>{rule.updated_at}</td>
            <td>
              <Button
                variant="info"
                size="sm"
                className="me-2"
                onClick={() => handleView(rule)}
              >
                查看
              </Button>
              <Button
                variant="warning"
                size="sm"
                className="me-2"
                onClick={() => handleShow(rule)}
              >
                編輯
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(rule.id)}
              >
                刪除
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

    <Modal show={showModal} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? '編輯章程' : '新增章程'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>章程簡介</Form.Label>
            <ReactQuill
              value={currentRule.intro}
              onChange={(value) =>
                setCurrentRule((prev) => ({
                  ...prev,
                  intro: value,
                }))
              }
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                  ['link'],
                ],
              }}
              placeholder="請輸入章程簡介"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>上傳PDF</Form.Label>
            <Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          取消
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {isEditing ? '更新' : '新增'}
        </Button>
      </Modal.Footer>
    </Modal>

    {viewRule && (
      <Modal show={showViewModal} onHide={handleCloseViewModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>查看章程</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="mb-3"
            dangerouslySetInnerHTML={{ __html: viewRule.intro }}
          />
          {viewRule.pdf_file && (
            <div>
              <h4>PDF 檔案</h4>
              <embed
                src={`${process.env.REACT_APP_BASE_URL}${viewRule.pdf_file}`}
                type="application/pdf"
                width="100%"
                height="500px"
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    )}
  </Container>
  );
};

export default RuleManaPage;