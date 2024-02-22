# ICP 201 Event Management System

## Overview

This is a comprehensive system for managing events, tickets, and user interactions in a decentralized manner on the Internet Computer blockchain Typescript challenge 201. It includes features like event creation, ticket purchase, payment verification, and user management, demonstrating the capabilities of smart contracts for real-world applications.

## Structure

### 1. Data Structures

- **Event**: Represents an event with properties like `id`, `title`, `description`, `date`, `startTime`, `attachmentURL`, `location`, `price`, `seller`, and `reservedAmount`.
- **EventPayload**: Used for creating or updating an event with necessary properties.
- **Ticket**: Represents a ticket with properties like `id`, `eventId`, `price`, and `userId`.
- **User**: Represents a user with properties like `id`, `name`, `email`, `phone`, `address`, and `tickets`.
- **ErrorType**: Variant type representing different error scenarios.

### 2. Storage

- `eventsStorage`: A `StableBTreeMap` to store events by their IDs.
- `persistedTickets`: A `StableBTreeMap` to store tickets by seller's principal.
- `eventTickets`: A `StableBTreeMap` to store tickets by event ID.
- `usersStorage`: A `StableBTreeMap` to store users by their IDs.

### 3. Canister Functions

- **Add Event**: Adds a new event to the system.
- **Add User**: Adds a new user to the system.
- **Get Events**: Retrieves all events from storage.
- **Get Tickets**: Retrieves all tickets from storage.
- **Get Event Tickets**: Retrieves tickets for a specific event.
- **Get Event**: Retrieves an event by its ID.
- **Get Sold Tickets**: Retrieves sold tickets for a specific event.
- **Get Users**: Retrieves all users from storage.
- **Get User**: Retrieves a user by their ID.
- **Update Event**: Updates an existing event.
- **Update User**: Updates an existing user.
- **Delete Event**: Deletes an event by its ID.
- **Create Ticket**: Creates a new ticket for an event.
- **Complete Purchase**: Completes a ticket purchase after verifying payment.
- **Verify Payment**: Verifies payment for a ticket.
- **Get Address From Principal**: Gets the address from a principal.
- **Make Payment**: Initiates a payment to another principal.

### 4. Helper Functions

- **Hash**: Generates a hash code for correlation IDs.
- **Generate Correlation ID**: Generates a correlation ID for tickets.
- **Discard By Timeout**: Automatically removes a ticket if not paid within a specified timeframe.
- **Verify Payment Internal**: Verifies payment internally by checking transaction details.

### 5. Dependencies

- Imports necessary modules from the `"azle"` and `"azle/canisters/ledger"` libraries.
- Uses external libraries like `"hashcode"` and `"uuidv4"` for hash code generation and UUID generation, respectively.

### 6. Miscellaneous

- Uses `globalThis.crypto` for generating random values, providing a workaround for UUID generation.
- Utilizes various IC APIs like `ic.call`, `ic.setTimer`, and `ic.time` for blockchain interaction.

### 7. Error Handling

- Functions return `Result` types to handle success or different error scenarios.

## Things to be explained in the course

1. What is Ledger? More details here: <https://internetcomputer.org/docs/current/developer-docs/integrations/ledger/>
2. What is Internet Identity? More details here: <https://internetcomputer.org/internet-identity>
3. What is Principal, Identity, Address? <https://internetcomputer.org/internet-identity> | <https://yumieventManager.medium.com/whats-the-difference-between-principal-id-and-account-id-3c908afdc1f9>
4. Canister-to-canister communication and how multi-canister development is done? <https://medium.com/icp-league/explore-backend-multi-canister-development-on-ic-680064b06320>

## How to deploy canisters implemented in the course

### Ledger canister

`./deploy-local-ledger.sh` - deploys a local Ledger canister. IC works differently when run locally so there is no default network token available and you have to deploy it yourself. Remember that it's not a token like ERC-20 in Ethereum, it's a native token for ICP, just deployed separately.
This canister is described in the `dfx.json`:

```markdown
 "ledger_canister": {
   "type": "custom",
   "candid": "https://raw.githubusercontent.com/dfinity/ic/928caf66c35627efe407006230beee60ad38f090/rs/rosetta-api/icp_ledger/ledger.did",
   "wasm": "https://download.dfinity.systems/ic/928caf66c35627efe407006230beee60ad38f090/canisters/ledger-canister.wasm.gz",
   "remote": {
     "id": {
       "ic": "ryjl3-tyaaa-aaaaa-aaaba-cai"
     }
   }
 }
```

`remote.id.ic` - that is the principal of the Ledger canister and it will be available by this principal when you work with the ledger.

Also, in the scope of this script, a minter identity is created which can be used for minting tokens
for the testing purposes.
Additionally, the default identity is pre-populated with 1000_000_000_000 e8s which is equal to 10_000 * 10**8 ICP.
The decimals value for ICP is 10**8.

List identities:
`dfx identity list`

Switch to the minter identity:
`dfx identity use minter`

Transfer ICP:
`dfx ledger transfer <ADDRESS>  --memo 0 --icp 100 --fee 0`
where:

- `--memo` is some correlation id that can be set to identify some particular transactions (we use that in the eventManager canister).
- `--icp` is the transfer amount
- `--fee` is the transaction fee. In this case it's 0 because we make this transfer as the minter idenity thus this transaction is of type MINT, not TRANSFER.
- `<ADDRESS>` is the address of the recipient. To get the address from the principal, you can use the helper function from the eventManager canister - `getAddressFromPrincipal(principal: Principal)`, it can be called via the Candid UI.

### Internet identity canister

`dfx deploy internet_identity` - that is the canister that handles the authentication flow. Once it's deployed, the `js-agent` library will be talking to it to register identities. There is UI that acts as a wallet where you can select existing identities
or create a new one.

### eventManager canister

`dfx deploy dfinity_js_backend` - deploys the eventManager canister where the business logic is implemented.
Basically, it implements functions like add, view, update, delete, and buy events + a set of helper functions.

Do not forget to run `dfx generate dfinity_js_backend` anytime you add/remove functions in the canister or when you change the signatures.
Otherwise, these changes won't be reflected in IDL's and won't work when called using the JS agent.

### eventManager frontend canister

`dfx deploy dfinity_js_frontend` - deployes the frontend app for the `dfinity_js_backend` canister on IC.
