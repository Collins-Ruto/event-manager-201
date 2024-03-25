import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Stack } from "react-bootstrap";

const Ticket = ({ ticket }) => {
  const { id, assetId, assetName, userId, userName, userEmail, userPhone } =
    ticket;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            {assetName}
          </Stack>
        </Card.Header>
        <Card.Body className="d-flex  flex-column ">
          <Card.Text className="flex-grow-1 ">TicketId: {id}</Card.Text>
          <Card.Text className="flex-grow-1 ">assetId: {assetId}</Card.Text>
          <Card.Text className="flex-grow-1 ">userId: {userId}</Card.Text>
          <Card.Text className="flex-grow-1 ">userName: {userName}</Card.Text>
          <Card.Text className="flex-grow-1 ">userEmail: {userEmail}</Card.Text>
          <Card.Text className="flex-grow-1 ">userPhone: {userPhone}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

Ticket.propTypes = {
  ticket: PropTypes.instanceOf(Object).isRequired,
};

export default Ticket;
