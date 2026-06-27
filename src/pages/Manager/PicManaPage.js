import React, { useState, useEffect } from 'react';
import { FaUser, FaBuilding, FaPlus, FaImages } from 'react-icons/fa';
import { Button } from 'components/common/ui';
import PhotoItem from 'components/Manage/PicManage/PhotoItem';
import PhotoUploadModal from 'components/Manage/PicManage/PhotoUploadModal';
import 'css/manage/photo.css';
import LoadingSpinner from 'components/LoadingSpinner';
import Axios from 'common/Axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useRWD from 'hooks/useRWD';

const PhotoManager = () => {
  const rwd = useRWD();
  const [selectedCategory, setSelectedCategory] = useState('自身照片');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isFresh, setIsFresh] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      let apiname = "";
      try {
        if (selectedCategory === "自身照片") {
          apiname = "picture/self-images/selfInfo/";
        } else if (selectedCategory === "公司照片") {
          apiname = "picture/company-images/selfInfo/";
        }
        const response = await Axios().get(apiname);
        if (response.data.length === 0) {
          setPhotos([]);
          setError('未找到任何資料');
        } else {
          setPhotos(response.data);
        }
      } catch (err) {
        setError('無法取得資料，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [selectedCategory, isFresh]);

  const refreshPhotos = () => setIsFresh((prev) => !prev);

  // 取得類別說明文字
  const getCategoryDescription = () => {
    if (selectedCategory === '自身照片') {
      return '管理您的個人照片集。這些照片將顯示在您的個人資料頁面。';
    } else {
      return '管理您的公司相關照片。這些照片將顯示在公司資訊頁面。';
    }
  };

  return (
    <div className="photo-manager admin-container py-4" style={rwd.getContainerStyle()}>
      <ToastContainer />

      {/* 頁面標題 */}
      <div className="mb-4">
        <h2 className="flex items-center text-2xl font-bold">
          <FaImages className="mr-2" style={{ color: '#4a6cf7' }} />
          照片管理中心
        </h2>
        <p className="text-base-content/60">上傳並管理您的照片集，維持最新、最佳的視覺展示</p>
      </div>

      <div className={rwd.isMobile ? 'flex flex-col gap-4' : 'grid grid-cols-12 gap-4'}>
        <div className={`${rwd.isMobile ? '' : 'col-span-3'} sidebar`}>
          <div className="card card-bordered bg-base-100 shadow-sm mb-4">
            <div className="card-body p-0">
              <div className="px-4 py-3 border-b border-base-200 bg-base-200/40">
                <h5 className="mb-0 font-semibold">照片分類</h5>
              </div>
              <div className="category-container">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('自身照片')}
                  className={`flex items-center w-full text-left py-3 px-4 border-b border-base-200 transition-colors ${
                    selectedCategory === '自身照片'
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-base-200'
                  }`}
                >
                  <FaUser size={24} className="mr-3" />
                  <div>
                    <strong>自身照片</strong>
                    <div className={`text-sm ${selectedCategory === '自身照片' ? 'text-primary-content/80' : 'text-base-content/60'}`}>個人形象與活動照片</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('公司照片')}
                  className={`flex items-center w-full text-left py-3 px-4 border-b border-base-200 transition-colors ${
                    selectedCategory === '公司照片'
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-base-200'
                  }`}
                >
                  <FaBuilding size={24} className="mr-3" />
                  <div>
                    <strong>公司照片</strong>
                    <div className={`text-sm ${selectedCategory === '公司照片' ? 'text-primary-content/80' : 'text-base-content/60'}`}>公司環境與活動照片</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 使用指引區塊 */}
          <div className="card card-bordered bg-base-100 shadow-sm">
            <div className="card-body p-0">
              <div className="px-4 py-3 border-b border-base-200 bg-base-200/40">
                <h5 className="mb-0 font-semibold">使用指引</h5>
              </div>
              <div className="p-4">
                <ul className="list-disc pl-5 mb-0">
                  <li className="mb-2">點擊左側分類切換照片類型</li>
                  <li className="mb-2">點擊「新增照片」上傳新照片</li>
                  <li className="mb-2">滑鼠懸停在照片上可查看操作選項</li>
                  <li>建議上傳比例適當、清晰的照片</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={`${rwd.isMobile ? '' : 'col-span-9'} main-panel`}>
          {/* 類別說明與操作按鈕 */}
          <div className="card card-bordered bg-base-100 shadow-sm mb-4">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold">{selectedCategory}</h4>
                  <p className="text-base-content/60 mb-0">{getCategoryDescription()}</p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center"
                >
                  <FaPlus className="mr-2" />
                  新增照片
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-5">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="alert alert-warning flex-col text-center p-5">
              <div className="mb-3">
                <FaImages size={48} className="text-base-content/60" />
              </div>
              <h5 className="text-lg font-semibold">{error}</h5>
              <p className="mb-0">您可以點擊「新增照片」按鈕開始上傳</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="alert alert-info flex-col text-center p-5">
              <div className="mb-3">
                <FaImages size={48} className="text-base-content/60" />
              </div>
              <h5 className="text-lg font-semibold">尚未上傳任何{selectedCategory}</h5>
              <p className="mb-0">點擊「新增照片」按鈕開始上傳</p>
            </div>
          ) : (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${rwd.getCardColumns()}, minmax(0, 1fr))` }}
            >
              {photos.map((photo) => (
                <div key={photo.id} className="photo-item">
                  <PhotoItem
                    photo={photo}
                    type={selectedCategory}
                    refresh={refreshPhotos}
                    style={{
                      height: rwd.isMobile ? '250px' : rwd.isTablet ? '300px' : '350px',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <PhotoUploadModal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        onUpload={refreshPhotos}
        type={selectedCategory}
      />
    </div>
  );
};

export default PhotoManager;
