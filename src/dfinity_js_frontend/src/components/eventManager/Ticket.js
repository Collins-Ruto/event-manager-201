import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Stack } from "react-bootstrap";

const Ticket = ({ ticket }) => {
  const {
    id,
    eventId,
    eventName,
    price,
    userId,
    userName,
    userEmail,
    userPhone,
  } = ticket;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            {eventName}
          </Stack>
        </Card.Header>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Text className="flex-grow-1 ">eventId: {eventId}</Card.Text>
          <Card.Text className="flex-grow-1 ">
            price: {(price / BigInt(10 ** 8)).toString()} ICP
          </Card.Text>
          <Card.Text className="flex-grow-1 ">userId: {userId}</Card.Text>
          <Card.Text className="flex-grow-1 ">userName: {userName}</Card.Text>
          <Card.Text className="flex-grow-1 ">userEmail: {userEmail}</Card.Text>
          <Card.Text className="text-secondary">
            <span>userPhone: {userPhone}</span>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

Ticket.propTypes = {
  ticket: PropTypes.instanceOf(Object).isRequired,
};

export default Ticket;
