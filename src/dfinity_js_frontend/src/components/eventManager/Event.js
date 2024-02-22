import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import ReserveTicket from "./ReserveTicket";
import { Link } from "react-router-dom";
import UpdateEvent from "./UpdateEvent";

const Event = ({ event, reserve, update }) => {
  const {
    id,
    title,
    description,
    attachmentURL,
    date,
    startTime,
    location,
    seller,
    maxSlots,
    reservedAmount,
  } = event;

  const intMaxSlots = Number(maxSlots / BigInt(10 ** 8));
  const intReservedAmount = Number(reservedAmount);

  const triggerReserve = (userId) => {
    reserve({
      eventId: id,
      userId,
    });
  };

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <span className="font-monospace text-secondary">
            {Principal.from(seller).toText()}
          </span>
          <Stack direction="horizontal" gap={2}>
            <Badge bg="secondary" className="ms-auto">
              {intReservedAmount} Sold
            </Badge>
            <Badge bg="secondary" className="ms-auto">
              {intMaxSlots - intReservedAmount} Available Slots
            </Badge>
            <UpdateEvent event={event} save={update} />
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={attachmentURL} alt={title} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{title}</Card.Title>
          <Card.Text className="flex-grow-1 ">
            description: {description}
          </Card.Text>
          <Card.Text className="flex-grow-1 ">date: {date}</Card.Text>
          <Card.Text className="flex-grow-1 ">startTime: {startTime}</Card.Text>
          <Card.Text className="flex-grow-1">location: {location}</Card.Text>
          {/* Router Link to send user to tickets page passing the eventid as search param */}
          <Link
            to={`/tickets?eventId=${id}`}
            className="btn btn-outline-dark w-100 py-3 mb-3"
          >
            View Reserved Tickets
          </Link>
          <ReserveTicket
            reserve={triggerReserve}
            available={intReservedAmount < intMaxSlots}
          />
        </Card.Body>
      </Card>
    </Col>
  );
};

Event.propTypes = {
  event: PropTypes.instanceOf(Object).isRequired,
};

export default Event;
