import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createEvent(event) {
  return window.canister.eventManager.addEvent(event);
}

export async function updateEvent(event) {
  return window.canister.eventManager.updateEvent(event);
}

export async function reserveEvent(ticket) {
  return window.canister.eventManager.createTicket(ticket);
}

export async function getEvents() {
  try {
    return await window.canister.eventManager.getEvents();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getEventTickets(eventId) {
  try {
    return await window.canister.eventManager.getEventTickets(eventId);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function buyEvent(event) {
  const eventManagerCanister = window.canister.eventManager;
  const orderResponse = await eventManagerCanister.createTicket(event.id);
  const sellerPrincipal = Principal.from(orderResponse.Ok.seller);
  const sellerAddress = await eventManagerCanister.getAddressFromPrincipal(
    sellerPrincipal
  );
  const block = await transferICP(
    sellerAddress,
    orderResponse.Ok.price,
    orderResponse.Ok.memo
  );
  await eventManagerCanister.completePurchase(
    sellerPrincipal,
    event.id,
    orderResponse.Ok.price,
    block,
    orderResponse.Ok.memo
  );
}
