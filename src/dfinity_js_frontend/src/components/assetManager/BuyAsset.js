import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const BuyAsset = ({ assetId, buy, available }) => {
  const [units, setUnits] = useState("");

  const isFormFilled = () => units;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {!available ? (
        <Button disabled={true} variant="outline-dark" className="w-100 py-3">
          Not available
        </Button>
      ) : (
        <>
          <Button
            onClick={handleShow}
            variant="outline-dark"
            className="w-100 py-3"
          >
            Buy Asset
          </Button>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>New Asset</Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                <FloatingLabel
                  controlId="inputUnits"
                  label="units"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      setUnits(e.target.value);
                    }}
                    placeholder="Number of Units"
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
                  const unitsInt = parseInt(units, 10);
                  buy(assetId, unitsInt);
                  handleClose();
                }}
              >
                Buy Asset
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

BuyAsset.propTypes = {
  buy: PropTypes.func.isRequired,
};

export default BuyAsset;
