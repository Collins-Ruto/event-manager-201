import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const ReserveTicket = ({ reserve }) => {
  const [userId, setUserId] = useState("");

  const isFormFilled = () => userId;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="outline-dark"
        className="w-100 py-3"
      >
        Reserve Ticket
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Event</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputUserId"
              label="userId"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setUserId(e.target.value);
                }}
                placeholder="Enter your userId"
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
              reserve(userId);
              handleClose();
            }}
          >
            Reserve Ticket
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ReserveTicket.propTypes = {
  reserve: PropTypes.func.isRequired,
};

export default ReserveTicket;
