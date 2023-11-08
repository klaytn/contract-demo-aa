import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("Board", {
    from: deployer,
    gasLimit: 4000000,
    args: [],
    log: true,
  });
};

func.tags = ["Board"];
export default func;
