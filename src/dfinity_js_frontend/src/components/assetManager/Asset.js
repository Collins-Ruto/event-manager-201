import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import BuyAsset from "./BuyAsset";
import { Link } from "react-router-dom";
import UpdateAsset from "./UpdateAsset";

const Asset = ({ asset, buy, update }) => {
  const {
    id,
    name,
    description,
    assetType,
    image,
    createdAt,
    isTokenized,
    updatedAt,
    owner,
    availableUnits,
    pricePerUnit,
  } = asset;

  const intAvailableUnits = Number(availableUnits);
  const intPricePerUnit = Number(pricePerUnit / BigInt(10 ** 8));

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <span className="font-monospace text-secondary">
            {Principal.from(owner).toText()}
          </span>
          <Stack direction="horizontal" gap={2}>
            <Badge bg="secondary" className="ms-auto">
              price: {intPricePerUnit} ICP
            </Badge>
            <Badge bg="secondary" className="ms-auto">
              {intAvailableUnits} Available Units
            </Badge>
            <UpdateAsset asset={asset} save={update} />
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={image} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Text className="flex-grow-1 ">
            description: {description}
          </Card.Text>
          <Card.Text className="flex-grow-1 ">Type: {assetType}</Card.Text>
          <Card.Text className="flex-grow-1 ">date: {createdAt}</Card.Text>
          <Card.Text className="flex-grow-1 ">
            isTokenized: {isTokenized}
          </Card.Text>
          <Card.Text className="flex-grow-1">updatedAt: {updatedAt}</Card.Text>
          <BuyAsset assetId={id} buy={buy} available={intAvailableUnits > 0} />
        </Card.Body>
      </Card>
    </Col>
  );
};

Asset.propTypes = {
  asset: PropTypes.instanceOf(Object).isRequired,
};

export default Asset;
