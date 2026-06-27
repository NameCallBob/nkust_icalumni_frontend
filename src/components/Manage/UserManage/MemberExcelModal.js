import Axios from 'common/Axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FileSpreadsheet } from 'lucide-react';
import AppModal from 'components/common/AppModal';
import { Button } from 'components/common/ui';
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
      <AppModal
        show={show}
        onHide={handleClose}
        size="lg"
        variant="admin"
        title="上傳Excel到系統"
        icon={<FileSpreadsheet size={18} />}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                clearData();
                handleClose();
                toast.info('已取消並清空暫存資料。');
              }}
            >
              關閉
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={emailData.length === 0}
              loading={loading}
            >
              保存
            </Button>
          </>
        }
      >
        {/* 選擇 Excel 檔案區塊 */}
        <div className="form-control w-full mb-3">
          <label className="label pb-1">
            <span className="label-text font-medium text-base-content">
              選擇您的Excel（只接受 *.xlsx）
            </span>
          </label>
          <p>範例如下：</p>
          <img
            src={ExampleImage}
            style={{ height: '200px' }}
            alt=""
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full mt-2"
          />
        </div>

        <Button variant="secondary" onClick={handleUpload} loading={loading} className="mb-3">
          上傳
        </Button>

        {filteredData.failure.length > 0 && (
          <>
            <h5 className="text-lg font-semibold mb-2">無法新增的Email</h5>
            <div className="overflow-x-auto mb-3">
              <table className="table table-zebra table-bordered w-full">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.failure.map((item, index) => (
                    <tr key={index} className="text-error">
                      <td>{item.email}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {emailData.length > 0 && (
          <>
            <h5 className="text-lg font-semibold mb-2">可新增的Email</h5>
            <div className="overflow-x-auto">
              <table className="table table-zebra table-bordered w-full">
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
                        <input
                          type="text"
                          className="input input-bordered input-sm w-full"
                          value={email}
                          onChange={(e) => handleEmailChange(indexOfFirstItem + index, e.target.value)}
                        />
                      </td>
                      <td>
                        <Button
                          variant="error"
                          size="sm"
                          onClick={() => handleDelete(indexOfFirstItem + index)}
                        >
                          刪除
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="join mt-3">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`join-item btn btn-sm ${index + 1 === currentPage ? 'btn-active btn-primary' : ''}`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </AppModal>
    );
  };

  export default UploadExcelModal;
