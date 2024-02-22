import React, { useState } from "react";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const Update = ({ event, save }) => {
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date);
  const [startTime, setStartTime] = useState(event.startTime);
  const [attachmentURL, setImage] = useState(event.attachmentURL);
  const [location, setLocation] = useState(event.location);
  const [maxSlots, setMaxSlots] = useState(event.maxSlots);
  const isFormFilled = () =>
    startTime && date && attachmentURL && description && maxSlots && location;

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
          <Modal.Title>New Event</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputUrl"
              label="Image URL"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Image URL"
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel controlId="inputDate" label="Date" className="mb-3">
              <Form.Control
                type="date"
                placeholder="Date"
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputTime"
              label="Start Time"
              className="mb-3"
            >
              <Form.Control
                type="time"
                placeholder="Start Time"
                onChange={(e) => {
                  setStartTime(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputLocation"
              label="Location"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Location"
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputMaxSlots"
              label="maxSlots"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="maxSlots"
                onChange={(e) => {
                  setMaxSlots(e.target.value);
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
                id: event.id,
                description,
                location,
                startTime,
                attachmentURL,
                maxSlots,
                date,
              });
              handleClose();
            }}
          >
            Save event
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Update;
