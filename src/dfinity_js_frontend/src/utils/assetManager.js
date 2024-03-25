import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createAsset(asset) {
  return window.canister.assetManager.addAsset(asset);
}

export async function updateAsset(asset) {
  return window.canister.assetManager.updateAsset(asset);
}

export async function reserveAsset(ticket) {
  return window.canister.assetManager.createTicket(ticket);
}

export async function getAssets() {
  try {
    return await window.canister.assetManager.getAssets();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getAssetTickets(assetId) {
  try {
    return await window.canister.assetManager.getAssetTickets(assetId);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function buyAsset(assetId, amount) {
  const amountInt = parseInt(amount, 10);
  const assetManagerCanister = window.canister.assetManager;
  const orderResponse = await assetManagerCanister.createReservePay(
    assetId,
    amountInt
  );

  console.log(orderResponse);
  const sellerPrincipal = Principal.from(orderResponse.Ok.seller);
  const sellerAddress = await assetManagerCanister.getAddressFromPrincipal(
    sellerPrincipal
  );
  const block = await transferICP(
    sellerAddress,
    orderResponse.Ok.price,
    orderResponse.Ok.memo
  );
  await assetManagerCanister.completePayment(
    sellerPrincipal,
    assetId,
    orderResponse.Ok.price,
    block,
    orderResponse.Ok.memo
  );
}
