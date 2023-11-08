# Contract-demo-aa

ERC-4337 demo login contracts for OAuth recovery

# Quickstart

```bash
# env setup; requires docker
export HARDHAT_NETWORK=localhost
npx hardhat klaytn-node --docker-image-id blukat29/klaytn:v1.11.1-aa
npx hardhat aa-bundler --docker-image-id blukat29/stackup-bundler:latest
npx hardhat deploy --tags localhost --reset

# get the counterfactual address
npx hardhat sca-addr
# 0xcd7D8013c3D342Ae2BD274c2549C49A3a68c33A7
# isCounterFactual true

# faucet to the address
SCA=0xcd7D8013c3D342Ae2BD274c2549C49A3a68c33A7
npx hardhat faucet --from 0 --to $SCA --amount 1

# send userOp. this will deploy SCA on the fly
npx hardhat send-userop --bundler

npx hardhat sca-addr
# 0xcd7D8013c3D342Ae2BD274c2549C49A3a68c33A7
# isCounterFactual false

# recovery
JWT=$(npx hardhat genjwt --nonce 0)
npx hardhat recover $JWT
```

# Configure

## Localhost

- Select network
  ```
  export HARDHAT_NETWORK=localhost
  ```
- Run a Klaytn node
  ```
  npx hardhat klaytn-node --docker-image-id blukat29/klaytn:v1.11.1-aa
  ```
- Run a bundler
  ```
  npx hardhat aa-bundler --docker-image-id blukat29/stackup-bundler:latest
  ```
- Deploy Singleton contracts. Only if the Klaytn node is restarted.
  ```
  npx hardhat deploy --tags localhost --reset --network hardhat
  ```

## Baobab

- Select network
  ```
  export HARDHAT_NETWORK=baobab
  ```
- Configure environments in `.env` file
  ```
  $ cat .env
  BAOBAB_BUNDLER_URL=http://1.2.3.4:4337/
  PRIVATE_KEY=0x1234...
  ```
- Check the private keys are correct
  ```
  npx hardhat accounts
  ```
  example output
  ```
  0x684a0cF8d682EAF5Ab3C9c769693706DA225F927 49.7730802235
  0x70997970C51812dc3A010C7d01b50e0d17dc79C8 0.000525
  ```
- Baobab Singleton contracts are already deployed. To see the addresses,
  ```
  npx hardhat addr
  ```
  example output
  ```
  Counter: '0x6BE35670d4F022b93e54F60e1f3e15efF8d3E351',
  EntryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  NonZKGoogleAccountFactory: '0x59dBa8ea57D435b00BF74B7CE306215E5f810523'
  ```

## Mumbai

- Select network
  ```
  export HARDHAT_NETWORK=mumbai
  ```
- Configure environments in `.env` file
  ```
  $ cat .env
  MUMBAI_URL="https://polygon-mumbai.g.alchemy.com/v2/[API_KEY]"
  PRIVATE_KEY=0x1234...
  NEW_PRIVATE_KEY=0x5678...
  ```
- Check the private keys are correct
  ```
  npx hardhat accounts
  ```
  example output
  ```
  0xBeBe3506E02c6EA2039B48cEb462Da6F7AfE6a89 0.588129131632171495
  0x47a945D6FaAad8512Cd10432FDf98b5A862DaC10 0.5
  ```
- Mumbai Singleton contracts are already deployed. To see the addresses,
  ```
  npx hardhat addr
  ```
  example output
  ```
  Counter: '0xa2688D6555F42b3A5131408Da66dE1409b7db87D',
  EntryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  NonZKGoogleAccountFactory: '0xFCadB6763A18d4A8f94d30E44a692Cc08eCC8837'
  ```

# User scenario

- Create SCA
  ```
  npx hardhat create-account
  ```
  example output
  ```
  sca deployed to 0xcd7D8013c3D342Ae2BD274c2549C49A3a68c33A7
  owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  ```
- Remember SCA address
  ```
  SCA=0x...  (copy from the output)
  ```
- If you forgot the SCA address,
  ```
  npx hardhat sca-addr
  ```
  example output
  ```
  0xcd7D8013c3D342Ae2BD274c2549C49A3a68c33A7
  ```
- Deposit KLAY to spend for gas to EntryPoint
  TODO: deposit to SCA instead of EntryPoint
  ```
  npx hardhat deposit $SCA
  ```
- Send UserOp
  ```
  npx hardhat send-userop --bundler
  ```
  example output
  ```
  counter.number before tx BigNumber { value: "3" }
  userOpHash 0x164aaceaf0e33738ea7a1b99b0fbe097610cc770061550b915e59e2fdf284a6f
  ..txHash 0x093079f143dea35dec5c202ddef9b2650da5171925e7370fce3042f7a4238400
  counter.number after tx BigNumber { value: "4" }
  ```
- Recover account
  ```
  npx hardhat recover $JWT
  ```
  example output
  ```
  sca owner before tx 0x684a0cF8d682EAF5Ab3C9c769693706DA225F927
  sca owner after tx 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  ```
