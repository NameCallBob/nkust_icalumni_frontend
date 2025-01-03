import Axios from 'common/Axios';
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IndustryCRUD = () => {
  const [industries, setIndustries] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentIndustry, setCurrentIndustry] = useState({
    id: null,
    title: '',
    intro: '',
  });
  const validateFields = () => {
    const isValid = currentIndustry.title && currentIndustry.intro;
    if (!currentIndustry.title) {
      alert("產業名稱為必填項目！");
    }
    if (!currentIndustry.intro) {
      alert("產業簡介為必填項目！");
    }
    return isValid;
  };
  
  useEffect(() => {
    Axios()
      .get('/company/industry/all/')
      .then((res) => {
        setIndustries(res.data);
      })
      .catch((err) => {
        toast.error('取得產業資料失敗');
        console.error('取得產業資料失敗', err);
      });
  }, []);

  const handleSave = () => {
    if (isEdit) {
      // 更新資料
      Axios()
        .put(`/company/industry/change/`, currentIndustry)
        .then(() => {
          setIndustries(
            industries.map((industry) =>
              industry.id === currentIndustry.id ? currentIndustry : industry
            )
          );
          toast.success('產業資料修改成功');
        })
        .catch((err) => {
          toast.error('產業資料修改失敗');
          console.error('更新失敗', err);
        });
    } else {
      // 新增資料
      Axios()
        .post('/company/industry/new/', currentIndustry)
        .then((res) => {
          setIndustries([...industries, res.data]);
          toast.success('產業資料新增成功');
        })
        .catch((err) => {
          toast.error('產業資料新增失敗');
          console.error('新增失敗', err);
        });
    }
    setShowModal(false);
    setCurrentIndustry({ id: null, title: '', intro: '' });
    setIsEdit(false);
  };

  const handleEdit = (industry) => {
    setCurrentIndustry(industry);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setCurrentIndustry({ id: null, title: '', intro: '' }); // 重置表單
    setIsEdit(false); // 設定為新增模式
    setShowModal(true); // 顯示 modal
  };

  const handleDelete = (id) => {
    Axios()
      .post(`/company/industry/delete/`,{'id':id})
      .then(() => {
        setIndustries(industries.filter((industry) => industry.id !== id));
        toast.success('產業資料刪除成功');
      })
      .catch((err) => {
        toast.error('產業資料刪除失敗');
        console.error('刪除失敗', err);
      });
  };

  return (
    <div>
      <h2>公司產業別管理</h2>
      <Button variant="primary" onClick={handleAddNew}>
        新增產業別
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>產業名稱</th>
            <th>簡介</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {industries.map((industry, index) => (
            <tr key={industry.id}>
              <td>{index + 1}</td>
              <td>{industry.title}</td>
              <td>{industry.intro}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(industry)}>
                  修改
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(industry.id)}>
                  刪除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>{isEdit ? '修改產業別' : '新增產業別'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {/* 產業名稱 */}
      <Form.Group controlId="industryName">
        <Form.Label>產業名稱</Form.Label>
        <Form.Control
          type="text"
          value={currentIndustry.title}
          onChange={(e) =>
            setCurrentIndustry({ ...currentIndustry, title: e.target.value })
          }
          required // 設定必填
          placeholder="請輸入產業名稱"
          maxLength={50} // 限制字數
          isInvalid={!currentIndustry.title} // 驗證是否有值
        />
        <Form.Control.Feedback type="invalid">
          產業名稱為必填項目，且不得超過 50 字。
        </Form.Control.Feedback>
      </Form.Group>

      {/* 產業簡介 */}
      <Form.Group controlId="industryDescription">
        <Form.Label>產業簡介</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={currentIndustry.intro}
          onChange={(e) =>
            setCurrentIndustry({ ...currentIndustry, intro: e.target.value })
          }
          required // 設定必填
          placeholder="請輸入產業簡介"
          maxLength={200} // 限制字數
          isInvalid={!currentIndustry.intro} // 驗證是否有值
        />
        <Form.Control.Feedback type="invalid">
          產業簡介為必填項目，且不得超過 200 字。
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      取消
    </Button>
    <Button
      variant="primary"
      onClick={() => {
        if (validateFields()) {
          handleSave();
        }
      }}
    >
      {isEdit ? '儲存修改' : '新增'}
    </Button>
  </Modal.Footer>
</Modal>


      {/* Toastify container */}
      <ToastContainer />
    </div>
  );
};

export default IndustryCRUD;
