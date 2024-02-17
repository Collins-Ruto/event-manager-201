import React, { useEffect, useState, useCallback } from "react";
import Ticket from "./Ticket";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getEventTickets as getEventTicketList } from "../../utils/eventManager";

const Tickets = ({ eventId }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of tickets
  const getEventTickets = useCallback(async () => {
    try {
      setLoading(true);
      setTickets(await getEventTicketList(eventId));
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    getEventTickets();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Tickets</h1>
            <Link
              to="/"
              className="justify-content-start mr-4 py-2 px-3 my-2 bg-secondary text-white rounded-pill "
            >
              Events Page
            </Link>
            <Link
              to="/users"
              className="justify-content-start py-2 px-3 my-2 bg-secondary text-white rounded-pill "
            >
              Users Manager
            </Link>
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {tickets.map((_ticket, index) => (
              <Ticket
                key={index}
                ticket={{
                  ..._ticket,
                }}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Tickets;
