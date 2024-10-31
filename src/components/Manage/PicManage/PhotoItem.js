import React from 'react';
import { Card, Button } from 'react-bootstrap';

const PhotoItem = ({ photo }) => {
  return (
    <Card className="photo-card">
      <Card.Img variant="top" src={photo.src} className="photo-preview" />
      <Card.Body>
        <Card.Title>{photo.title}</Card.Title>
        <Card.Text>{photo.description}</Card.Text>
        <Button variant="danger">刪除</Button>
      </Card.Body>
    </Card>
  );
};

export default PhotoItem;