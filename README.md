# Contract-demo-aa

ERC-4337 demo login contracts for OAuth recovery

Forked from [contract-template](https://github.com/klaytn/contract-template)

# Prerequisites

- node@18 (configurable via [nvm](https://github.com/nvm-sh/nvm) or [devbox](https://github.com/jetpack-io/devbox))

```bash
npm install

export HARDHAT_NETWORK=baobab
alias hh='npx hardhat'
```

# Steps

## 1. Create an owner key

```
hh run script/01_createOwner.ts
```

Go to the faucet and top up. Check by:

```
hh accounts
```

## 2. Get sub field from JWT

```
hh run script/02_getSubFromJwt.ts
```

Check by running `cat .env`:

```
PRIVATE_KEY=0x...
INITIAL_OWNER_ADDRESS=0x...
SUB=...
```

Counter factual can be calculated with `sub` from JWT and the initial owner's address.

```
hh run script/getCounterfactual.ts
```

## 3. Send KLAY to the counter factual address

```
hh run script/03_sendKLAY.ts
```

## 4. Send UserOp

This UserOp writes a content to the board contract. It also supports Korean.

```
CONTENT="Hello, my name is Teemo." hh run script/04_sendUserOp.ts
```

Check the board:

```
hh run script/readBoard.ts
```

## 5. Lose the previous owner key, and create a new one

Open `.env` and comment out `PRIVATE_KEY`:

```
# PRIVATE_KEY=0x...             <<< change only this line
INITIAL_OWNER_ADDRESS=0x...
SUB=...
```

Then, run:

```
hh run script/05_createNewOwner.ts
```

Go to the faucet and top up. Check by:

```
hh accounts
```

## 6. Fetch JWT

```
hh run script/06_getJwt.ts
```

## 7. Recover

```
hh run script/07_recover.ts
```

Try sending UserOp again with the new owner.
