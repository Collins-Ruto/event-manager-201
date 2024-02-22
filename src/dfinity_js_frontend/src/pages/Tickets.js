import React from "react";
import { Container, Nav } from "react-bootstrap";
import { login, logout as destroy } from "../utils/auth";
import Wallet from "../components/Wallet";
import Cover from "../components/utils/Cover";
import coverImg from "../assets/img/cover.jpg";
import { Notification } from "../components/utils/Notifications";
import Tickets from "../components/eventManager/Tickets";

const TicketsPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("eventId");
  console.log(eventId);

  const isAuthenticated = window.auth.isAuthenticated;

  const principal = window.auth.principalText;

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        <Container fluid="md">
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              <Wallet
                principal={principal}
                symbol={"ICP"}
                isAuthenticated={isAuthenticated}
                destroy={destroy}
              />
            </Nav.Item>
          </Nav>
          <main>
            <Tickets eventId={eventId} />
          </main>
        </Container>
      ) : (
        <Cover name="Street Food" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default TicketsPage;
