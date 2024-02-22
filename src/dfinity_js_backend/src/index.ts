import {
  query,
  update,
  text,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  Ok,
  Err,
  ic,
  Principal,
  nat64,
  Result,
  Canister,
} from "azle";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

/**
 * This type represents a event that can be listed on a eventManager.
 * It contains basic properties that are needed to define a event.
 */
const Event = Record({
  id: text,
  title: text,
  description: text,
  date: text,
  startTime: text,
  attachmentURL: text,
  location: text,
  seller: Principal,
  maxSlots: nat64,
  reservedAmount: nat64,
});

const EventPayload = Record({
  title: text,
  description: text,
  location: text,
  startTime: text,
  attachmentURL: text,
  maxSlots: nat64,
  date: text,
});

const UpdateEventPayload = Record({
  id: text,
  description: text,
  location: text,
  startTime: text,
  attachmentURL: text,
  maxSlots: nat64,
  date: text,
});

const Ticket = Record({
  id: text,
  eventId: text,
  userId: text,
});

const User = Record({
  id: text,
  name: text,
  email: text,
  phone: text,
  address: text,
  tickets: Vec(text),
});

const UserPayload = Record({
  name: text,
  email: text,
  phone: text,
  address: text,
});

const UpdateUserPayload = Record({
  id: text,
  email: text,
  phone: text,
  address: text,
});

const ErrorType = Variant({
  NotFound: text,
  InvalidPayload: text,
  PaymentFailed: text,
  PaymentCompleted: text,
});

const TicketPayload = Record({
  eventId: text,
  userId: text,
});

const TicketReturn = Record({
  id: text,
  eventId: text,
  eventName: text,
  userId: text,
  userName: text,
  userEmail: text,
  userPhone: text,
});

/**
 * `eventsStorage` - it's a key-value datastructure that is used to store events by sellers.
 * {@link StableBTreeMap} is a self-balancing tree that acts as a durable data storage that keeps data across canister upgrades.
 * For the sake of this contract we've chosen {@link StableBTreeMap} as a storage for the next reasons:
 * - `insert`, `get` and `remove` operations have a constant time complexity - O(1)
 * - data stored in the map survives canister upgrades unlike using HashMap where data is stored in the heap and it's lost after the canister is upgraded
 *
 * Brakedown of the `StableBTreeMap(text, Event)` datastructure:
 * - the key of map is a `eventId`
 * - the value in this map is a event itself `Event` that is related to a given key (`eventId`)
 *
 * Constructor values:
 * 1) 0 - memory id where to initialize a map
 * 2) 16 - it's a max size of the key in bytes.
 * 3) 1024 - it's a max size of the value in bytes.
 * 2 and 3 are not being used directly in the constructor but the Azle compiler utilizes these values during compile time
 */
const eventsStorage = StableBTreeMap(0, text, Event);
const eventTickets = StableBTreeMap(2, text, Ticket);
const usersStorage = StableBTreeMap(3, text, User);

export default Canister({
  addEvent: update([EventPayload], Result(Event, ErrorType), (payload) => {
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ NotFound: "invalid payoad" });
    }
    const event = {
      id: uuidv4(),
      reservedAmount: 0n,
      seller: ic.caller(),
      ...payload,
    };
    eventsStorage.insert(event.id, event);
    return Ok(event);
  }),

  getEvents: query([], Vec(Event), () => {
    return eventsStorage.values();
  }),

  getEvent: query([text], Result(Event, ErrorType), (id) => {
    const eventOpt = eventsStorage.get(id);
    if ("None" in eventOpt) {
      return Err({ NotFound: `event with id=${id} not found` });
    }
    return Ok(eventOpt.Some);
  }),

  updateEvent: update(
    [UpdateEventPayload],
    Result(Event, ErrorType),
    (payload) => {
      const eventOpt = eventsStorage.get(payload.id);
      if ("None" in eventOpt) {
        return Err({ NotFound: `event with id=${payload.id} not found` });
      }
      const event = eventOpt.Some;
      const updatedEvent = {
        ...event,
        ...payload,
      };
      eventsStorage.insert(event.id, updatedEvent);
      return Ok(updatedEvent);
    }
  ),

  addUser: update([UserPayload], Result(User, ErrorType), (payload) => {
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ NotFound: "invalid payoad" });
    }
    const user = {
      id: uuidv4(),
      tickets: [],
      ...payload,
    };
    usersStorage.insert(user.id, user);
    return Ok(user);
  }),

  getUsers: query([], Vec(User), () => {
    return usersStorage.values();
  }),

  getUser: query([text], Result(User, ErrorType), (id) => {
    const userOpt = usersStorage.get(id);
    if ("None" in userOpt) {
      return Err({ NotFound: `user with id=${id} not found` });
    }
    return Ok(userOpt.Some);
  }),
  
  // get events reserved by user
  getUserEvents: query([text], Vec(Event), (id) => {
    const userOpt = usersStorage.get(id);
    if ("None" in userOpt) {
      return [];
    }
    const user = userOpt.Some;
    const tickets = eventTickets.values();
    return tickets
      .filter((ticket) => {
        return ticket.userId === user.id;
      })
      .map((ticket) => {
        const eventOpt = eventsStorage.get(ticket.eventId);
        return eventOpt.Some;
      });
  }),

  updateUser: update(
    [UpdateUserPayload],
    Result(User, ErrorType),
    (payload) => {
      const userOpt = usersStorage.get(payload.id);
      if ("None" in userOpt) {
        return Err({ NotFound: `user with id=${payload.id} not found` });
      }
      const user = userOpt.Some;
      const updatedUser = {
        ...user,
        ...payload,
      };
      usersStorage.insert(user.id, updatedUser);
      return Ok(updatedUser);
    }
  ),

  createTicket: update(
    [TicketPayload],
    Result(TicketReturn, ErrorType),
    (payload) => {
      const eventOpt = eventsStorage.get(payload.eventId);
      const userOpt = usersStorage.get(payload.userId);
      if ("None" in userOpt) {
        return Err({
          NotFound: `user=${payload.userId} not found`,
        });
      }
      if ("None" in eventOpt) {
        return Err({
          NotFound: `event=${payload.eventId} not found`,
        });
      }
      const event = eventOpt.Some;
      const ticket = {
        id: uuidv4(),
        eventId: event.id,
        userId: payload.userId,
      };

      const returnTicket = {
        id: ticket.id,
        eventId: event.id,
        eventName: event.title,
        userId: payload.userId,
        userName: userOpt.Some.name,
        userEmail: userOpt.Some.email,
        userPhone: userOpt.Some.phone,
      };

      // add ticket to the user
      const user = userOpt.Some;
      const updatedUser = {
        ...user,
        tickets: user.tickets.concat(ticket.id),
      };

      // increase event sold ticket count
      event.reservedAmount += 1n;

      try {
        // update event in storage
        eventsStorage.insert(event.id, event);
        eventTickets.insert(ticket.id, ticket);
        usersStorage.insert(payload.userId, updatedUser);
      } catch (error) {
        return Err({
          NotFound: `cannot create ticket, err=${error}`,
        });
      }

      return Ok(returnTicket);
    }
  ),

  getTickets: query([], Vec(Ticket), () => {
    return eventTickets.values();
  }),

  // get tickets per event
  getEventTickets: query([text], Vec(TicketReturn), (id) => {
    const eventOpt = eventsStorage.get(id);
    if ("None" in eventOpt) {
      return [];
    }
    const event = eventOpt.Some;
    const tickets = eventTickets.values();
    return tickets
      .filter((ticket) => {
        return ticket.eventId === event.id;
      })
      .map((ticket) => {
        const userOpt = usersStorage.get(ticket.userId);

        return {
          id: ticket.id,
          eventId: event.id,
          eventName: event.title,
          userId: ticket.userId,
          userName: userOpt.Some.name,
          userEmail: userOpt.Some.email,
          userPhone: userOpt.Some.phone,
        };
      });
  }),

  getUserTickets: query([text], Vec(TicketReturn), (id) => {
    const userOpt = usersStorage.get(id);
    if ("None" in userOpt) {
      return [];
    }
    const user = userOpt.Some;
    const tickets = eventTickets.values();
    return tickets
      .filter((ticket) => {
        return ticket.userId === user.id;
      })
      .map((ticket) => {
        const eventOpt = eventsStorage.get(ticket.eventId);
        const event = eventOpt.Some;
        return {
          id: ticket.id,
          eventId: event.id,
          eventName: event.title,
          userId: ticket.userId,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone,
        };
      });
  }),
});

// a workaround to make uuid package work with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
