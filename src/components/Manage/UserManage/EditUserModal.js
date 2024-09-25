import React from 'react';
import { Modal, Button, Form ,Col } from 'react-bootstrap';

const EditUserModal = ({
  showModal,
  handleCloseModal,
  currentUser,
  setCurrentUser,
  handleUpdateUser,
}) => {

  return (
    <Modal show={showModal} onHide={handleCloseModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>修改使用者資料</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="editName">
              <Form.Label>姓名</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group as={Col} controlId="editGender">
              <Form.Label>性別</Form.Label>
              <Form.Control
                as="select"
                value={currentUser.gender}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, gender: e.target.value })
                }
              >
                <option value="M">男性</option>
                <option value="F">女性</option>
                <option value="O">其他</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="editMobilePhone">
              <Form.Label>行動電話</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.mobile_phone}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, mobile_phone: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group as={Col} controlId="editHomePhone">
              <Form.Label>市內電話</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.home_phone}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, home_phone: e.target.value })
                }
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="editAddress">
              <Form.Label>住址</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.address}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, address: e.target.value })
                }
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="editPosition">
              <Form.Label>職位</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.position?.title || ""}
                readOnly
              />
            </Form.Group>

            <Form.Group as={Col} controlId="editGraduate">
              <Form.Label>畢業學校</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.graduate?.school || ""}
                readOnly
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="editIsPaid">
              <Form.Check
                type="checkbox"
                label="是否繳費"
                checked={currentUser.is_paid}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, is_paid: e.target.checked })
                }
              />
            </Form.Group>

            <Form.Group as={Col} controlId="editDateJoined">
              <Form.Label>加入日期</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.date_joined}
                readOnly
              />
            </Form.Group>
          </Form.Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          取消
        </Button>
        <Button variant="primary" onClick={handleUpdateUser}>
          保存修改
        </Button>
      </Modal.Footer>
    </Modal>
  );
}


export default EditUserModal;
