import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * 
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("M3Token", {
    from: deployer,
    // Contract constructor arguments
    args: [process.env.TOKEN_COLLECTION_IPFS],
    log: true,
    autoMine: true, // remove for production, no effect only for dev
  });

  const m3tokenContract = await hre.ethers.getContract("M3Token", deployer);
  console.log("M3Token deployed at: ", m3tokenContract.address);

  await deploy("M3Forge", {
    from: deployer,
    // Contract constructor arguments
    args: [m3tokenContract.address],
    log: true,
    autoMine: true, // remove for production, no effect only for dev
  });

  const m3Forge = await hre.ethers.getContract("M3Forge", deployer);
  console.log("M3Forge deployed at: ", m3Forge.address);
  
  await m3tokenContract.setForge(m3Forge.address);
  console.log("Forge Set for M3Token: ", m3Forge.address);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["M3Token", "M3Forge"];
