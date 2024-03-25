import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddAsset = ({ save }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [isTokenized, setIsTokenized] = useState("");
  const [assetType, setassetType] = useState("");
  const [availableUnits, setAvailableUnits] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const isFormFilled = () =>
    name &&
    image &&
    isTokenized &&
    assetType &&
    description &&
    pricePerUnit &&
    availableUnits;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div onClick={handleShow} className="text-success">
        <i className="bi bi-plus"></i> Add Asset
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Asset</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="Asset name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter name of asset"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputAssetType"
              label="assetType"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="assetType"
                onChange={(e) => {
                  setassetType(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputImage"
              label="Image"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setImage(e.target.value);
                }}
                placeholder="Enter image url"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="isTokenized"
              label="Is Tokenized"
              className="mb-3"
            >
              <select
                onChange={(e) => {
                  setIsTokenized(e.target.value);
                }}
                className="form-select"
                aria-label="Default select example"
              >
                <option defaultValue="">select</option>
                <option value={"true"}>True</option>
                <option value={"false"}>False</option>
              </select>
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
              controlId="inputAvailableUnits"
              label="AvailableUnits"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="AvailableUnits"
                onChange={(e) => {
                  setAvailableUnits(e.target.value);
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
                name,
                image,
                description,
                availableUnits,
                isTokenized,
                assetType,
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

AddAsset.propTypes = {
  save: PropTypes.func.isRequired,
};

export default AddAsset;
