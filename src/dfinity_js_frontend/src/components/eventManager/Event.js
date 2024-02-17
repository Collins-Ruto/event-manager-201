import React from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import ReserveTicket from "./ReserveTicket";
import { Link } from "react-router-dom";

const Event = ({ event, buy, reserve }) => {
  const {
    id,
    title,
    description,
    attachmentURL,
    date,
    startTime,
    location,
    price,
    seller,
    soldAmount,
  } = event;

  const triggerBuy = () => {
    buy(id);
  };

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
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-secondary">
              {Principal.from(seller).toText()}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {soldAmount.toString()} Sold
            </Badge>
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
          <Card.Text className="flex-grow-1 ">
            price: {(price / BigInt(10 ** 8)).toString()} ICP
          </Card.Text>
          <Card.Text className="flex-grow-1 ">startTime: {startTime}</Card.Text>
          <Card.Text className="text-secondary">
            <span>location: {location}</span>
          </Card.Text>
          {/* Router Link to send user to tickets page passing the eventid as search param */}
          <Link
            to={`/tickets?eventId=${id}`}
            className="btn btn-outline-dark w-100 py-3"
          >
            View Reserved Tickets
          </Link>
          <ReserveTicket reserve={triggerReserve} />
        </Card.Body>
      </Card>
    </Col>
  );
};

Event.propTypes = {
  event: PropTypes.instanceOf(Object).isRequired,
  buy: PropTypes.func.isRequired,
};

export default Event;
