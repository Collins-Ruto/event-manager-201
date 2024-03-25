import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const UpdateAsset = ({ save }) => {
  const [description, setDescription] = useState("");
  const [isTokenized, setIsTokenized] = useState("");
  const [image, setimage] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const isFormFilled = () =>
    isTokenized && image && description && pricePerUnit;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        onClick={handleShow}
        className="btn btn-success"
        style={{ width: "8rem" }}
      >
        <i className="bi bi-pencil-square "></i> Update
      </button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Asset</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputImage"
              label="image"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="image"
                onChange={(e) => {
                  setimage(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="isTokenized"
              label="Is Tokenized"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Is Tokenized"
                onChange={(e) => {
                  setIsTokenized(e.target.value);
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
              controlId="inputPricePerUnit"
              label="pricePerUnit"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="pricePerUnit"
                onChange={(e) => {
                  setPricePerUnit(e.target.value);
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
                description,
                isTokenized,
                image,
                pricePerUnit,
              });
              handleClose();
            }}
          >
            Save asset
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateAsset.propTypes = {
  save: PropTypes.func.isRequired,
};

export default UpdateAsset;
