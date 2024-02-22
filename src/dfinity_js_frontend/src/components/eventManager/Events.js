import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddEvent from "./AddEvent";
import Event from "./Event";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getEvents as getEventList,
  createEvent,
  reserveEvent,
  updateEvent,
} from "../../utils/eventManager";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // function to get the list of events
  const getEvents = useCallback(async () => {
    try {
      setLoading(true);
      setEvents(await getEventList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addEvent = async (data) => {
    try {
      setLoading(true);
      const maxSlotsStr = data.maxSlots;
      data.maxSlots = parseInt(maxSlotsStr, 10) * 10 ** 8;
      createEvent(data).then((resp) => {
        getEvents();
        toast(<NotificationSuccess text="Event added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a event." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to reserve book
  const reserve = async (ticket) => {
    try {
      setLoading(true);
      reserveEvent(ticket).then((resp) => {
        getEvents();
        toast(
          <NotificationSuccess text="Event reserved successfully, check users tab for your tickets" />
        );
      });
    } catch (error) {
      toast(<NotificationError text="Failed to reserve event." />);
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    try {
      setLoading(true);
      const maxSlotsStr = data.maxSlots;
      data.maxSlots = parseInt(maxSlotsStr, 10) * 10 ** 8;
      updateEvent(data).then((resp) => {
        getEvents();
        toast(<NotificationSuccess text="Event added successfully." />);
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a event." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Events</h1>
            <Link
              to="/users"
              className="justify-content-start py-2 px-3 my-2 bg-secondary text-white rounded-pill "
            >
              Users Manager
            </Link>
            <div className="d-flex align-items-center">
              <div className="mr-6">Add Event</div>
              <AddEvent save={addEvent} />
            </div>
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {events.map((_event, index) => (
              <Event
                key={index}
                event={{
                  ..._event,
                }}
                reserve={reserve}
                update={update}
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

export default Events;
