# example-contract

PLEASE REPLACE `%%your ~~%%` ACCORDINGLY (also remove this statement)

This contract %%your description%%.

## Quickstart

### Prerequisites

From your hardhat project, run:

```bash
npm install %%your package%%
```

### Import abi, address from typescript/javascript

```typescript
import { %%your contract%% } from "%%your package%%";

async function main() {
  console.log(%%your contract%%.address, %%your contract%%.abi.substring(0,16));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Import from solidity

```sol
import "%%your package%%/contracts/%%your contract%%.sol";
```
