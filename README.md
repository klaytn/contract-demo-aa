# Contract-demo-aa

ERC-4337 demo login contracts for OAuth recovery

# Prerequisites

```bash
npm install

# env setup; requires docker
export HARDHAT_NETWORK=baobab
```

# Steps

## 1. Create an owner key

```
npx hardhat run script/01_createOwner.ts
```

Go to the faucet and top up. Check by:

```
npx hardhat accounts
```

## 2. Get sub field from JWT

```
npx hardhat run script/02_getSubFromJwt.ts
```

Check by running `cat .env`:

```
PRIVATE_KEY=0x...
INITIAL_OWNER_ADDRESS=0x...
SUB=...
```

Counter factual can be calculated with `sub` from JWT and the initial owner's address.

```
npx hardhat run script/getCounterfactual.ts
```

## 3. Send KLAY to the counter factual address

```
npx hardhat run script/03_sendKLAY.ts
```

## 4. Send UserOp

This UserOp writes a content to the board contract. It also supports Korean.

```
CONTENT="Hello, my name is Teemo." npx hardhat run script/04_sendUserOp.ts
```

Check the board:

```
npx hardhat run script/readBoard.ts
```

## 5. Lose the previous owner key, and create a new one

Open `.env` and comment out `PRIVATE_KEY`:

```
# PRIVATE_KEY=0x...
SUB=...
```

Then, run:

```
npx hardhat run script/05_createNewOwner.ts
```

Go to the faucet and top up. Check by:

```
npx hardhat accounts
```

## 6. Fetch JWT

```
npx hardhat run script/06_getJwt.ts
```

## 7. Recover

```
npx hardhat run script/07_recover.ts
```

Try sending UserOp again with the new owner.
