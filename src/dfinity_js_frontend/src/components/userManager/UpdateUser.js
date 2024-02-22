import React, { useState } from "react";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const UpdateUser = ({ user, save }) => {
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);

  const isFormFilled = () => address && phone && email;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill"
        // style={{ width: "38px" }}
      >
        Update <i className="bi bi-pencil-square"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New User</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputPhone"
              label={user.Phone}
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder={user.phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputAddress"
              label={user.address}
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder={user.Address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputEmail"
              label={user.email}
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder={user.email}
                style={{ height: "80px" }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                id: user.id,
                phone,
                address,
                email,
              });
              handleClose();
            }}
          >
            Save user
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateUser;
