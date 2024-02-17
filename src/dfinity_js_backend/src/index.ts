import { start } from "@popperjs/core";
import {
  query,
  update,
  text,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  None,
  Some,
  Ok,
  Err,
  ic,
  Principal,
  Opt,
  nat64,
  Duration,
  Result,
  bool,
  Canister,
} from "azle";
import {
  Ledger,
  binaryAddressFromAddress,
  binaryAddressFromPrincipal,
  hexAddressFromPrincipal,
} from "azle/canisters/ledger";
// @ts-ignore
import { hashCode } from "hashcode";
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
  price: nat64,
  seller: Principal,
  soldAmount: nat64,
});

const EventPayload = Record({
  title: text,
  description: text,
  location: text,
  startTime: text,
  attachmentURL: text,
  date: text,
  price: nat64,
});

const Ticket = Record({
  id: text,
  eventId: text,
  price: nat64,
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
  price: nat64,
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
const persistedTickets = StableBTreeMap(1, Principal, Ticket);
const eventTickets = StableBTreeMap(2, text, Ticket);
const usersStorage = StableBTreeMap(3, text, User);

/* 
    initialization of the Ledger canister. The principal text value is hardcoded because 
    we set it in the `dfx.json`
*/
const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

export default Canister({
  addEvent: update([EventPayload], Result(Event, ErrorType), (payload) => {
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ NotFound: "invalid payoad" });
    }
    const event = {
      id: uuidv4(),
      soldAmount: 0n,
      seller: ic.caller(),
      ...payload,
    };
    eventsStorage.insert(event.id, event);
    return Ok(event);
  }),

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

  getEvents: query([], Vec(Event), () => {
    return eventsStorage.values();
  }),

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
          price: event.price,
          userId: ticket.userId,
          userName: userOpt.Some.name,
          userEmail: userOpt.Some.email,
          userPhone: userOpt.Some.phone,
        };
      });
  }),

  getEvent: query([text], Result(Event, ErrorType), (id) => {
    const eventOpt = eventsStorage.get(id);
    if ("None" in eventOpt) {
      return Err({ NotFound: `event with id=${id} not found` });
    }
    return Ok(eventOpt.Some);
  }),

  // get sold tickets for a given event
  getSoldTickets: query([text], Result(Vec(Ticket), ErrorType), (id) => {
    const eventOpt = eventsStorage.get(id);
    if ("None" in eventOpt) {
      return Err({ NotFound: `event with id=${id} not found` });
    }
    const event = eventOpt.Some;
    const tickets = persistedTickets.values();
    return Ok(
      tickets.filter((ticket) => {
        return ticket.eventId === event.id;
      })
    );
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

  updateEvent: update([Event], Result(Event, ErrorType), (payload) => {
    const eventOpt = eventsStorage.get(payload.id);
    if ("None" in eventOpt) {
      return Err({
        NotFound: `event with id=${payload.id} not found`,
      });
    }
    eventsStorage.insert(eventOpt.Some.id, payload);
    return Ok(payload);
  }),

  updateUser: update([User], Result(User, ErrorType), (payload) => {
    const userOpt = usersStorage.get(payload.id);
    if ("None" in userOpt) {
      return Err({
        NotFound: `user with id=${payload.id} not found`,
      });
    }
    usersStorage.insert(userOpt.Some.id, payload);
    return Ok(payload);
  }),

  deleteEvent: update([text], Result(text, ErrorType), (id) => {
    const deletedEventOpt = eventsStorage.remove(id);
    if ("None" in deletedEventOpt) {
      return Err({
        NotFound: `event with id=${id} not found`,
      });
    }
    return Ok(deletedEventOpt.Some.id);
  }),

  /*
        on create ticket we generate a hashcode of the ticket and then use this number as corelation id (memo) in the transfer function
        the memo is later used to identify a payment for this particular ticket.

        The entire flow is divided into the three main parts:
            1. Create an ticket
            2. Pay for the ticket (transfer ICP to the seller). 
            3. Complete the ticket (use memo from step 1 and the transaction block from step 2)
            
        Step 2 is done on the FE app because we cannot create an ticket and transfer ICP in the scope of the single method. 
        When we call the `createTicket` method, the ic.caller() would the principal of the identity which initiated this call in the frontend app. 
        However, if we call `ledger.transfer()` from `createTicket` function, the principal of the original caller won't be passed to the 
        ledger canister when we make this call. 
        In this case, when we call `ledger.transfer()` from the `createTicket` method,
        the caller identity in the `ledger.transfer()` would be the principal of the canister from which we just made this call - in our case it's the eventManager canister.
        That's we split this flow into three parts.
    */

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
        price: event.price,
        userId: payload.userId,
      };

      const returnTicket = {
        id: ticket.id,
        eventId: event.id,
        eventName: event.title,
        price: event.price,
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

      try {
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

  completePurchase: update(
    [Principal, text, nat64, nat64, nat64],
    Result(Ticket, ErrorType),
    async (seller, id, price, block, memo) => {
      const paymentVerified = await verifyPaymentInternal(
        seller,
        price,
        block,
        memo
      );
      if (!paymentVerified) {
        return Err({
          NotFound: `cannot verify the payment, memo=${memo}`,
        });
      }
      const pendingTicketOpt = eventTickets.remove(memo);
      if ("None" in pendingTicketOpt) {
        return Err({
          NotFound: `there is no pending ticket with id=${id}`,
        });
      }
      const ticket = pendingTicketOpt.Some;
      const updatedTicket = {
        ...ticket,
        paid_at_block: Some(block),
      };
      const eventOpt = eventsStorage.get(id);
      if ("None" in eventOpt) {
        throw Error(`event with id=${id} not found`);
      }
      const event = eventOpt.Some;
      event.soldAmount += 1n;
      eventsStorage.insert(event.id, event);
      persistedTickets.insert(ic.caller(), updatedTicket);
      return Ok(updatedTicket);
    }
  ),

  /*
        another example of a canister-to-canister communication
        here we call the `query_blocks` function on the ledger canister
        to get a single block with the given number `start`.
        The `length` parameter is set to 1 to limit the return amount of blocks.
        In this function we verify all the details about the transaction to make sure that we can mark the ticket as completed
    */

  verifyPayment: query(
    [Principal, nat64, nat64, nat64],
    bool,
    async (receiver, amount, block, memo) => {
      return await verifyPaymentInternal(receiver, amount, block, memo);
    }
  ),

  /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
  getAddressFromPrincipal: query([Principal], text, (principal) => {
    return hexAddressFromPrincipal(principal, 0);
  }),

  // not used right now. can be used for transfers from the canister for instances when a eventManager can hold a balance account for errorTypes
  makePayment: update(
    [text, nat64],
    Result(ErrorType, ErrorType),
    async (to, amount) => {
      const toPrincipal = Principal.fromText(to);
      const toAddress = hexAddressFromPrincipal(toPrincipal, 0);
      const transferFeeResponse = await ic.call(icpCanister.transfer_fee, {
        args: [{}],
      });
      const transferResult = ic.call(icpCanister.transfer, {
        args: [
          {
            memo: 0n,
            amount: {
              e8s: amount,
            },
            fee: {
              e8s: transferFeeResponse.transfer_fee.e8s,
            },
            from_subaccount: None,
            to: binaryAddressFromAddress(toAddress),
            created_at_time: None,
          },
        ],
      });
      if ("Err" in transferResult) {
        return Err({
          PaymentFailed: `payment failed, err=${transferResult.Err}`,
        });
      }
      return Ok({ PaymentCompleted: "payment completed" });
    }
  ),
});

/*
    a hash function that is used to generate correlation ids for tickets.
    also, we use that in the verifyPayment function where we check if the used has actually paid the ticket
*/
function hash(input: any): nat64 {
  return BigInt(Math.abs(hashCode().value(input)));
}

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

function generateCorrelationId(eventId: text): nat64 {
  const correlationId = `${eventId}_${ic.caller().toText()}_${ic.time()}`;
  return hash(correlationId);
}

/*
    after the ticket is created, we give the `delay` amount of minutes to pay for the ticket.
    if it's not paid during this timeframe, the ticket is automatically removed from the pending tickets.
*/
function discardByTimeout(memo: nat64, delay: Duration) {
  ic.setTimer(delay, () => {
    const ticket = eventTickets.remove(memo);
    console.log(`Ticket discarded ${ticket}`);
  });
}

async function verifyPaymentInternal(
  receiver: Principal,
  amount: nat64,
  block: nat64,
  memo: nat64
): Promise<bool> {
  const blockData = await ic.call(icpCanister.query_blocks, {
    args: [{ start: block, length: 1n }],
  });
  const tx = blockData.blocks.find((block) => {
    if ("None" in block.transaction.operation) {
      return false;
    }
    const operation = block.transaction.operation.Some;
    const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
    const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
    return (
      block.transaction.memo === memo &&
      hash(senderAddress) === hash(operation.Transfer?.from) &&
      hash(receiverAddress) === hash(operation.Transfer?.to) &&
      amount === operation.Transfer?.amount.e8s
    );
  });
  return tx ? true : false;
}
