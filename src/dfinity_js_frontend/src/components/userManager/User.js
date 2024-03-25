import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Stack } from "react-bootstrap";
import UpdateUser from "./UpdateUser";
import { Principal } from "@dfinity/principal";

const User = ({ user, update }) => {
  const { id, name, email, phone, principal, assets } = user;

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Body className="d-flex  flex-column text-start">
          <Stack className="d-flex justify-content-between">
            <Card.Title>Name: {name}</Card.Title>
            <UpdateUser user={user} save={update} />
          </Stack>
          <Card.Text>Id: {id}</Card.Text>
          <Card.Text className="flex-grow-1 ">Email: {email}</Card.Text>
          <Card.Text className="flex-grow-1 ">Phone: {phone}</Card.Text>
          <Card.Text className="flex-grow-1 ">
            Principal: {Principal.from(principal).toText()}
          </Card.Text>
          <h3>User assets</h3>
          {assets.map((ticket, index) => (
            <Card.Text key={index} className="flex-grow-1 ">
              {ticket.title}
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
