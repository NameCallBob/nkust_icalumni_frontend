import Axios from 'common/Axios';
import React from 'react';
import { Card, Button } from 'react-bootstrap';
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
    <Card className="photo-card">
      <Card.Img
        variant="top"
        src={`${process.env.REACT_APP_BASE_URL}${photo.image}`}
        className="photo-preview"
        style={{width:"350px"}}
      />
      <Card.Body>
        <Card.Title>{photo.title}</Card.Title>
        <Card.Text>{truncatedDescription}</Card.Text>
        <Button
          variant={photo.active ? "danger" : "success"}  // 使用不同顏色的按鈕
          onClick={() => handleActive(photo.id, photo.active)}
        >
          {photo.active ? "停用" : "啟用"}
        </Button>
        <Button
          variant="danger"
          onClick={() => handleDelete(photo.id)}
        >
          刪除
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PhotoItem;
