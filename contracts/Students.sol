// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Teachers.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract StudentsContract is TeachersContract {

  using EnumerableSet for EnumerableSet.AddressSet;

  struct StudentInfo {
    address addr;
    string name;
  }

  EnumerableSet.AddressSet students;
  mapping (address => StudentInfo) internal studentInfo;

  event StudentRegistered (
    address indexed addr,
    address indexed byAddr,
    string name
  );

  modifier onlyTeacher() {
    require(TeachersContract.checkTeacherRegistered(msg.sender),
      "Only a registered teacher account can carry out this action"
    );
    _;
  }

  function registerNewStudent(address _addr, string memory _name) public onlyTeacher {
    require(_addr != address(0), "Invalid address");
    require(bytes(_name).length > 0, "Empty name not allowed");

    require(students.add(_addr) == true, "Address already registered");
    StudentInfo memory _info = StudentInfo(_addr, _name);
    studentInfo[_addr] = _info;

    emit StudentRegistered(_addr, msg.sender, _name);
  }

  function getStudentCount() public view returns(uint) {
    return students.length();
  }

  function getStudentInfoByIndex(uint _index) public view returns (address addr, string memory name) {
    if (_index < getStudentCount()) {
      StudentInfo storage info = studentInfo[students.at(_index)];
      return (info.addr, info.name);
    }
    else {
      return (address(0), "");
    }
  }

  function getStudentsInfoByAddress(address _addr) public view returns (address addr, string memory name) {
    StudentInfo storage info = studentInfo[_addr];
    return (info.addr, info.name);
  }

  function checkStudentRegistered(address _addr) public view returns (bool) {
    return students.contains(_addr);
  }
}
