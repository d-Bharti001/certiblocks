const CertiContract = artifacts.require("./CertiContract.sol");

const { expect } = require("chai");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised")
const BN = web3.utils.BN
const chaiBN = require("chai-bn")(BN)
chai.use(chaiAsPromised)
chai.use(chaiBN)

function generateRandomID() {
  let t = new Date().getTime().toString();
  t += Math.floor(Math.random() * 20);
  return web3.utils.keccak256(t);
}

contract("CertiContract test", accounts => {

  const [owner, teacher1, teacher2, student1, student2, anotherAcc] = accounts

  describe("Ownership", () => {
    it("Should have the rightful owner", async () => {
      let instance = await CertiContract.new();
      await expect(await instance.owner()).to.be.equal(owner);
    });
  });

  describe("Teachers", () => {
    beforeEach(async () => {
      this.Contract = await CertiContract.new();
    });

    it("Owner should be able to enroll new teachers", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewTeacher(teacher1, "Nikhil Gupta", {from: owner})).to.eventually.be.fulfilled;
      await expect(instance.registerNewTeacher(teacher2, "Suraj Prabhakar", {from: owner})).to.eventually.be.fulfilled;
      // Teacher count should be 2
      await expect(await instance.getTeacherCount()).to.be.a.bignumber.equal(new BN(2));
    });

    it("Same account can't be registered again as a teacher", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewTeacher(teacher1, "Nikhil Gupta")).to.eventually.be.fulfilled;
      await expect(instance.registerNewTeacher(teacher1, "Nikhil")).to.eventually.be.rejectedWith("Address already registered");
    })

    it("Registered teacher can't enroll new teachers", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewTeacher(teacher1, "Nikhil Gupta", {from: owner})).to.eventually.be.fulfilled;
      await expect(await instance.checkTeacherRegistered(teacher1)).to.be.equal(true);
      await expect(instance.registerNewTeacher(teacher2, "Suraj Prabhakar", {from: teacher1})).to.eventually.be.rejectedWith("You are not the owner");
      });

    it("Unregistered account can't enroll new teachers", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewTeacher(teacher2, "Suraj Prabhakar", {from: anotherAcc})).to.eventually.be.rejected;
    });
  });

  describe("Students", () => {
    beforeEach(async () => {
      this.Contract = await CertiContract.new();
      await this.Contract.registerNewTeacher(teacher1, "Nikhil Gupta");
    });

    it("Should have teacher1 registered", async () => {
      let instance = this.Contract;
      await expect(await instance.checkTeacherRegistered(teacher1)).to.be.equal(true);
    });

    it("Registered teacher should be able enroll new students", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewStudent(student1, "Rahul Kumar", {from: teacher1})).to.eventually.be.fulfilled;
      await expect(instance.registerNewStudent(student2, "Rahul Raj", {from: teacher1})).to.eventually.be.fulfilled;
      // Student count should be 2
      await expect(await instance.getStudentCount()).to.be.a.bignumber.equal(new BN(2));
    });

    it("Same account can't be registered again as a student", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewStudent(student1, "Rahul Kumar", {from: teacher1})).to.eventually.be.fulfilled;
      await expect(instance.registerNewStudent(student1, "Rahul Kumar", {from: teacher1}))
        .to.eventually.be.rejectedWith("Address already registered");
    })

    it("Registered student can't enroll new students", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewStudent(student1, "Rahul Kumar", {from: teacher1})).to.eventually.be.fulfilled;
      await expect(await instance.checkStudentRegistered(student1)).to.be.equal(true);
      await expect(instance.registerNewStudent(student2, "Rahul Raj", {from: student2}))
        .to.eventually.be.rejectedWith("Only a registered teacher account can carry out this action");
    });

    it("Owner can't enroll new students", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewStudent(student1, "Rahul Kumar"))
        .to.eventually.be.rejectedWith("Only a registered teacher account can carry out this action");
    });

    it("Unregistered account can't enroll new students", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewStudent(student1, "Rahul Kumar", {from: anotherAcc}))
        .to.eventually.be.rejectedWith("Only a registered teacher account can carry out this action");
    });

    it("Student account can't enroll new teachers", async () => {
      let instance = this.Contract;
      await expect(instance.registerNewStudent(student1, "Rahul Kumar", {from: teacher1})).to.eventually.be.fulfilled;
      await expect(instance.registerNewTeacher(teacher2, "Suraj", {from: student1}))
        .to.eventually.be.rejectedWith("You are not the owner");
    });
  });

  describe("Certifications", () => {
    beforeEach(async () => {
      this.Contract = await CertiContract.new();
      await this.Contract.registerNewTeacher(teacher1, "Nikhil", {from: owner});
      await this.Contract.registerNewStudent(student1, "Rahul Kumar", {from: teacher1});
    });

    it("Should have the intended accounts registered", async () => {
      let instance = this.Contract;
      await expect(await instance.checkTeacherRegistered(teacher1)).to.be.equal(true);
      await expect(await instance.checkStudentRegistered(student1)).to.be.equal(true);
    });

    it("Teacher should be able to certify student", async () => {
      let instance = this.Contract;
      await expect(instance.certifyStudent(generateRandomID(), student1, 63, 100, "Python", {from: teacher1})).to.eventually.be.fulfilled;
    });

    it("Same Certification ID can't be registered again", async () => {
      let instance = this.Contract;
      let certificateId = generateRandomID();
      await expect(instance.certifyStudent(certificateId, student1, 63, 100, "Python", {from: teacher1})).to.eventually.be.fulfilled;
      await expect(instance.certifyStudent(certificateId, student1, 93, 100, "Python", {from: teacher1}))
        .to.eventually.be.rejectedWith("Certificate ID already present");
    });

    it("Student can't generate certificates", async () => {
      let instance = this.Contract;
      await expect(instance.certifyStudent(generateRandomID(), student1, 63, 100, "Python", {from: student1}))
        .to.eventually.be.rejectedWith("Only a registered teacher account can carry out this action");
    });

    it("Owner can't generate certificates", async () => {
      let instance = this.Contract;
      await expect(instance.certifyStudent(generateRandomID(), student1, 63, 100, "Python", {from: owner}))
        .to.eventually.be.rejectedWith("Only a registered teacher account can carry out this action");
    });

    it("Unregistered account can't generate certificates", async () => {
      let instance = this.Contract;
      await expect(instance.certifyStudent(generateRandomID(), student1, 63, 100, "Python", {from: teacher2}))
        .to.eventually.be.rejectedWith("Only a registered teacher account can carry out this action");
    });

    it("Unregistered account can't be certified", async () => {
      let instance = this.Contract;
      await expect(instance.certifyStudent(generateRandomID(), student2, 63, 100, "Python", {from: teacher1}))
        .to.eventually.be.rejectedWith("Student account not registered");
    });
  });
});
