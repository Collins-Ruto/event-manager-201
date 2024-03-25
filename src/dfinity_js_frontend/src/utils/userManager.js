export async function createUser(user) {
  return window.canister.assetManager.addUser(user);
}

export async function updateUser(user) {
  return window.canister.assetManager.updateUser(user);
}

export async function getUsers() {
  try {
    return await window.canister.assetManager.getUsers();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
