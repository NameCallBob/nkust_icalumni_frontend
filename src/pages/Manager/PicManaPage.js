import React, { useState, useEffect } from 'react';
import { User, Building2, Plus, Images, Info } from 'lucide-react';
import { Button, PageHeader, Toolbar, Card, EmptyState, Spinner } from 'components/common/ui';
import PhotoItem from 'components/Manage/PicManage/PhotoItem';
import PhotoUploadModal from 'components/Manage/PicManage/PhotoUploadModal';
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

  const categories = [
    {
      key: '自身照片',
      icon: User,
      desc: '個人形象與活動照片',
    },
    {
      key: '公司照片',
      icon: Building2,
      desc: '公司環境與活動照片',
    },
  ];

  return (
    <div className="min-h-screen bg-base-200/40 px-4 py-6 sm:px-6 lg:px-8">
      <ToastContainer />

      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="照片管理中心"
          subtitle="上傳並管理您的照片集，維持最新、最佳的視覺展示"
          icon={<Images className="h-5 w-5" />}
          actions={
            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              新增照片
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 側邊欄：分類與使用指引 */}
          <div className="lg:col-span-3 min-w-0 space-y-4">
            <Card padding="none" className="overflow-hidden">
              <div className="border-b border-base-300/70 bg-base-200/40 px-4 py-3">
                <h2 className="text-sm font-semibold text-base-content">照片分類</h2>
              </div>
              <div className="p-2">
                {categories.map(({ key, icon: Icon, desc }) => {
                  const active = selectedCategory === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedCategory(key)}
                      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                        active
                          ? 'bg-primary text-primary-content shadow-sm'
                          : 'text-base-content hover:bg-base-200'
                      }`}
                    >
                      <span
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          active ? 'bg-primary-content/15' : 'bg-base-200 text-primary'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{key}</span>
                        <span
                          className={`block text-xs ${
                            active ? 'text-primary-content/80' : 'text-base-content/60'
                          }`}
                        >
                          {desc}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* 使用指引區塊 */}
            <Card padding="none" className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-base-300/70 bg-base-200/40 px-4 py-3">
                <Info className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-base-content">使用指引</h2>
              </div>
              <ul className="space-y-2 p-4 text-sm text-base-content/70">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  點擊左側分類切換照片類型
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  點擊「新增照片」上傳新照片
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  滑鼠懸停在照片上可查看操作選項
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  建議上傳比例適當、清晰的照片
                </li>
              </ul>
            </Card>
          </div>

          {/* 主面板 */}
          <div className="lg:col-span-9 min-w-0">
            {/* 類別說明與操作工具列 */}
            <Card padding="md" className="mb-6">
              <Toolbar
                className="mb-0"
                left={
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-base-content">{selectedCategory}</h3>
                    <p className="mt-1 text-sm text-base-content/60">{getCategoryDescription()}</p>
                  </div>
                }
                right={
                  <Button
                    variant="primary"
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    新增照片
                  </Button>
                }
              />
            </Card>

            {loading ? (
              <Card padding="lg" className="flex justify-center">
                <Spinner />
              </Card>
            ) : error ? (
              <Card padding="none">
                <EmptyState
                  icon={<Images className="h-8 w-8" />}
                  title={error}
                  description="您可以點擊「新增照片」按鈕開始上傳"
                  action={
                    <Button
                      variant="primary"
                      onClick={() => setShowUploadModal(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      新增照片
                    </Button>
                  }
                />
              </Card>
            ) : photos.length === 0 ? (
              <Card padding="none">
                <EmptyState
                  icon={<Images className="h-8 w-8" />}
                  title={`尚未上傳任何${selectedCategory}`}
                  description="點擊「新增照片」按鈕開始上傳"
                  action={
                    <Button
                      variant="primary"
                      onClick={() => setShowUploadModal(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      新增照片
                    </Button>
                  }
                />
              </Card>
            ) : (
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${rwd.getCardColumns()}, minmax(0, 1fr))` }}
              >
                {photos.map((photo) => (
                  <div key={photo.id} className="overflow-hidden rounded-2xl">
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
