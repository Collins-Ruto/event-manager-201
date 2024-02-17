import React from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import { Principal } from "@dfinity/principal";

const User = ({ user }) => {
  const { id, name, email, phone, address, tickets } = user;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>Name: {name}</Card.Title>
          <Card.Text>Id: {id}</Card.Text>
          <Card.Text className="flex-grow-1 ">Email: {email}</Card.Text>
          <Card.Text className="flex-grow-1 ">Phone: {phone}</Card.Text>
          <Card.Text className="flex-grow-1 ">Address: {address}</Card.Text>
          <h3>User tickets</h3>
          {tickets.map((ticket, index) => (
            <Card.Text key={index} className="flex-grow-1 ">
              {ticket}
            </Card.Text>
          ))}
        </Card.Body>
      </Card>
    </Col>
  );
};

User.propTypes = {
  user: PropTypes.instanceOf(Object).isRequired,
};

export default User;
