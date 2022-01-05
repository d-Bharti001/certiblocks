const CertiContract = artifacts.require("./CertiContract.sol");

const { expect } = require("chai");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiAsPromised);
chai.use(chaiBN);

function generateRandomID() {
  let t = new Date().getTime().toString();
  t += Math.floor(Math.random() * 20);
  return web3.utils.keccak256(t);
}

contract("CertiContract test", accounts => {

  const [owner, acc1, acc2, acc3, acc4] = accounts

  describe("Ownership", () => {
    it("Should have the rightful owner", async () => {
      let instance = await CertiContract.deployed();
      await expect(await instance.owner()).to.be.equal(owner);
    });
    it("Owner should be registered as an authority", async () => {
      let instance = await CertiContract.deployed();
      await expect(await instance.checkIfRegistered(owner)).to.be.equal(true);
      await expect(await instance.getAuthorityCount()).to.be.a.bignumber.equal(new BN(1));
    });
  });

  describe("Authorities", () => {
    beforeEach(async () => {
      this.Contract = await CertiContract.new();
    });

    it("Owner should be able to register new authorities", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewAuthority(acc1, { from: owner })).to.eventually.be.fulfilled;
      await expect(instance.registerNewAuthority(acc2, { from: owner })).to.eventually.be.fulfilled;
      await expect(await instance.getAuthorityCount()).to.be.a.bignumber.equal(new BN(3));
    });

    it("Same account can't be registered again", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewAuthority(acc1, { from: owner })).to.eventually.be.fulfilled;
      await expect(instance.registerNewAuthority(acc1, { from: owner })).to.eventually.be.rejectedWith("Address already registered");
    });

    it("Unregistered account can't register new authorities", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewAuthority(acc1, { from: acc3 })).to.eventually.be.rejectedWith("You are not the owner");
    });

    it("Registered authority other than owner can't register new authorities", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewAuthority(acc1, { from: owner })).to.eventually.be.fulfilled;
      await expect(instance.registerNewAuthority(acc2, { from: acc1 })).to.eventually.be.rejectedWith("You are not the owner");
    });
  });

  describe("Certifications", () => {
    beforeEach(async () => {
      this.Contract = await CertiContract.new();
      await this.Contract.registerNewAuthority(acc1, { from: owner });
      await this.Contract.registerNewAuthority(acc2, { from: owner });
    });

    it("Should have the intended accounts registered", async () => {
      let instance = this.Contract;
      await expect(await instance.checkIfRegistered(owner)).to.be.equal(true);
      await expect(await instance.checkIfRegistered(acc1)).to.be.equal(true);
      await expect(await instance.checkIfRegistered(acc2)).to.be.equal(true);
    });

    it("Registered account should be able to certify students", async () => {
      let instance = this.Contract;
      await expect(instance.certify(generateRandomID(), acc3, 85, 100, "Python", "Rahul", { from: acc1 })).to.eventually.be.fulfilled;
    });

    it("Same Certification ID can't be registered again", async () => {
      let instance = this.Contract;
      let certificateId = generateRandomID();
      await expect(instance.certify(certificateId, acc3, 85, 100, "Python", "Rahul", { from: acc1 })).to.eventually.be.fulfilled;
      await expect(instance.certify(certificateId, acc4, 93, 100, "Python", "Shubham", { from: acc2 }))
        .to.eventually.be.rejectedWith("Certificate ID already present");
    });

    it("Unregistered account can't generate certificates", async () => {
      let instance = this.Contract;
      await expect(instance.certify(generateRandomID(), acc4, 85, 100, "Python", "Rahul", { from: acc3 }))
        .to.eventually.be.rejectedWith("Only a registered authority can carry out this action");
    });

    it("Authority account can't be certified", async () => {
      let instance = this.Contract;
      await expect(instance.certify(generateRandomID(), acc2, 85, 100, "Python", "Prakhar", { from: acc1 }))
        .to.eventually.be.rejectedWith("Authority account can't be certified");
    });
  });
});
