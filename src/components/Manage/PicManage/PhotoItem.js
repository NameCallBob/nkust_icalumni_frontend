import Axios from 'common/Axios';
import React from 'react';
import { Button, Card, Badge } from 'components/common/ui';
import { Power, Trash2 } from 'lucide-react';
import { toast } from "react-toastify";

const PhotoItem = ({ photo, type, refresh }) => {
  let apiname;

  const handleDelete = (id) => {
    if (type === "自身照片") {
      apiname = "picture/self-images/delete/";
    } else if (type === "公司照片") {
      apiname = "picture/company-images/delete/";
    }
    Axios()
      .delete(apiname, { data: { id: id } })  // 使用 params 傳遞 ID
      .then((res) => {
        toast.success("刪除成功!");
        refresh(); // 呼叫父元件的刷新方法
      })
      .catch((error) => {
        toast.error("刪除失敗: 無法刪除該項目");
      });
  };

  const handleActive = (id, isActive) => {
    if (type === "自身照片") {
      apiname = "picture/self-images/switch_active/";
    } else if (type === "公司照片") {
      apiname = "picture/company-images/switch_active/";
    }
    Axios()
      .post(apiname, { id: id })
      .then((res) => {
        toast.success("狀態轉換成功!");
        refresh(); // 呼叫父元件的刷新方法
      })
      .catch((error) => {
        toast.error("狀態轉換失敗: 請稍後再試");
      });
  };

  // 處理簡介文字長度，超過20字則以...表示
  const truncatedDescription = photo.description.length > 20
    ? `${photo.description.substring(0, 20)}...`
    : photo.description;

  return (
    <Card
      padding="none"
      hover
      className="flex flex-col overflow-hidden"
    >
      <div className="relative bg-slate-100">
        <img
          src={`${process.env.REACT_APP_BASE_URL}${photo.image}`}
          className="aspect-[4/3] w-full object-cover"
          alt={photo.title}
        />
        <div className="absolute top-3 left-3">
          <Badge variant={photo.active ? "success" : "neutral"} soft={false}>
            {photo.active ? "已啟用" : "已停用"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h2 className="text-base font-semibold text-[#0f172a] line-clamp-1">
          {photo.title}
        </h2>
        <p className="flex-1 text-sm leading-relaxed text-slate-500">
          {truncatedDescription}
        </p>

        <div className="mt-2 flex flex-wrap gap-2 border-t border-base-300/70 pt-3">
          <Button
            variant={photo.active ? "outline" : "success"}  // 使用不同顏色的按鈕
            size="sm"
            className="flex-1"
            onClick={() => handleActive(photo.id, photo.active)}
          >
            <Power className="h-4 w-4" />
            {photo.active ? "停用" : "啟用"}
          </Button>
          <Button
            variant="error"
            size="sm"
            className="flex-1"
            onClick={() => handleDelete(photo.id)}
          >
            <Trash2 className="h-4 w-4" />
            刪除
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PhotoItem;
