import Axios from 'common/Axios';
import React, { useState } from 'react';
import { Button, Modal, Table, Pagination, Form ,Spinner} from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExampleImage from 'assets/example/ExcelFileExample.png'


const UploadExcelModal = ({ show, handleClose }) => {
    const [file, setFile] = useState(null);
    const [emailData, setEmailData] = useState([]);
    const [filteredData, setFilteredData] = useState({ success: [], failure: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
  
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const handleUpload = async () => {
      if (!file) {
        toast.error('請選擇Excel檔案後上傳。');
        return;
      }
  
      setLoading(true);
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await Axios().post('member/Add_byExcel/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        const successEmails = response.data.preview.filter(item => item.status === '可新增').map(item => item.email);
        const failureEmails = response.data.preview.filter(item => item.status !== '可新增');
  
        setEmailData(successEmails);
        setFilteredData({
          success: successEmails,
          failure: failureEmails,
        });
  
        if (failureEmails.length > 0) {
          toast.warn(`部分Email無法新增，共 ${failureEmails.length} 條`);
        } else {
          toast.success('檔案上傳成功！');
        }
      } catch (error) {
        console.error('上傳檔案錯誤:', error);
        toast.error('檔案上傳失敗，請再試一次。');
      } finally {
        setLoading(false);
      }
    };
  
    const handleEmailChange = (index, value) => {
      const updatedEmails = [...emailData];
      updatedEmails[index] = value;
      setEmailData(updatedEmails);
    };
  
    const handleDelete = (index) => {
      const updatedEmails = emailData.filter((_, i) => i !== index);
      setEmailData(updatedEmails);
    };
  
    const handleSave = async () => {
      setLoading(true);
      try {
        const response = await Axios().post('member/Add_byExcel_checked/', { emails: emailData });
        const created = response.data.created || [];
        const failed = response.data.failed || [];
  
        if (created.length > 0) {
          toast.success(`成功保存: ${created.length} 條`);
        }
  
        if (failed.length > 0) {
          toast.error(`保存失敗: ${failed.length} 條，原因: ${failed.map(f => f.reason).join(', ')}`);
        }
  
        clearData();
        handleClose();
      } catch (error) {
        console.error('保存錯誤:', error);
        toast.error('保存失敗，請再試一次。');
      } finally {
        setLoading(false);
      }
    };
  
    const clearData = () => {
      setFile(null);
      setEmailData([]);
      setFilteredData({ success: [], failure: [] });
      setCurrentPage(1);
    };
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEmails = emailData.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(emailData.length / itemsPerPage);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    return (
      <>
              <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>上傳Excel到系統</Modal.Title>
          </Modal.Header>
  
          <Modal.Body>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>選擇您的Excel（只接受 *.xlsx）</Form.Label>
              <br></br>
              <p>範例如下：</p>
              <img 
              src={ExampleImage}
              style={{height:'200px'}}
              />
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
  
            <Button variant="secondary" onClick={handleUpload} className="mb-3">
              {loading ? <Spinner animation="border" size="sm" /> : '上傳'}
            </Button>
  
            {filteredData.failure.length > 0 && (
              <>
                <h5>無法新增的Email</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>狀態</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.failure.map((item, index) => (
                      <tr key={index} style={{ color: 'red' }}>
                        <td>{item.email}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
  
            {emailData.length > 0 && (
              <>
                <h5>可新增的Email</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Email</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmails.map((email, index) => (
                      <tr key={indexOfFirstItem + index}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          <Form.Control
                            type="text"
                            value={email}
                            onChange={(e) => handleEmailChange(indexOfFirstItem + index, e.target.value)}
                          />
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(indexOfFirstItem + index)}
                          >
                            刪除
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
  
                <Pagination>
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </>
            )}
          </Modal.Body>
  
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={emailData.length === 0}
            >
              {loading ? <Spinner animation="border" size="sm" /> : '保存'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                clearData();
                handleClose();
                toast.info('已取消並清空暫存資料。');
              }}
            >
              關閉
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  export default UploadExcelModal;
  