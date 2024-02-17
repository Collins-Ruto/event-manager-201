export async function createUser(user) {
  return window.canister.eventManager.addUser(user);
}

export async function getUsers() {
  try {
    return await window.canister.eventManager.getUsers();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
