const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('M3Token', function () {
  let M3Token;
  let m3Token;
  let owner;
  let forge;
  let COOLDOWN_PERIOD; // Define COOLDOWN_PERIOD

  beforeEach(async function () {
    [owner, forge] = await ethers.getSigners();

    M3Token = await ethers.getContractFactory('M3Token');
    m3Token = await M3Token.deploy('URI');
    await m3Token.deployed();

    await m3Token.setForge(forge.address);
    COOLDOWN_PERIOD = Number(await m3Token.COOLDOWN_PERIOD());
  });

  it('Should mint tokens', async function () {
    await m3Token.connect(forge).mint(owner.address, 0);
    const balance = await m3Token.balanceOf(owner.address, 0);
    expect(balance).to.equal(1);
  });

  it('Should not allow minting from non-forge address', async function () {
    try {
      // Execute the mint function that should revert with NotForge
      await m3Token.connect(owner).mint(owner.address, 0);

      // If the transaction does not revert, fail the test
      expect.fail('Transaction did not revert');
  } catch (error) {
      // Check that the error message matches the expected custom error
      expect(error.message).to.include('NotForge');
  }
  });


  it('Should successfully mint after cooldown period', async function () {
    const tokenId = 0;

    // Mint the token once to set the lastMintTime
    await m3Token.connect(forge).mint(owner.address, tokenId);

    // Fast-forward time beyond the cooldown period
    await network.provider.send("evm_increaseTime", [COOLDOWN_PERIOD + 1]);
    await network.provider.send("evm_mine");

    // Now try to mint again, it should succeed
    await m3Token.connect(forge).mint(owner.address, tokenId);

    // Check the balance after minting
    const balance = await m3Token.balanceOf(owner.address, tokenId);
    expect(balance).to.equal(2);
});

});


describe('M3Forge', function () {
  let M3Forge;
  let Forge;
  let M3Token;
  let m3Token;
  let owner;
  let userA;

  beforeEach(async function () {
    [owner, userA] = await ethers.getSigners();

    M3Token = await ethers.getContractFactory('M3Token');
    m3Token = await M3Token.deploy('URI');
    await m3Token.deployed();

    M3Forge = await ethers.getContractFactory('M3Forge');
    Forge = await M3Forge.deploy(m3Token.address);
    await Forge.deployed();

    await m3Token.setForge(Forge.address);
  });

  it('Should forge tokens', async function () {
    await Forge.forge(owner.address, 0);
    const balance = await m3Token.balanceOf(owner.address, 0);
    expect(balance).to.equal(1);
  });

  it('Should not succeed forging rare token', async function () {
    try {
      // Execute the mint function that should revert with NotForge
      await Forge.forge(userA.address, 3);  
      // If the transaction does not revert, fail the test
      expect.fail('Transaction did not revert');
    } catch (error) {
      // Check that the error message matches the expected custom error
      expect(error.message).to.include('BadForge');
    }
  });

  it('Should fail forging before cooldown', async function () {
    try {
      // Execute the mint function that should revert with NotForge
      await Forge.forge(userA.address, 0);  
      await Forge.forge(userA.address, 0);  
      // If the transaction does not revert, fail the test
      expect.fail('Transaction did not revert');
    } catch (error) {
      // Check that the error message matches the expected custom error
      expect(error.message).to.include('Cooldown');
    }
  });
  // Add more test cases as needed
});
