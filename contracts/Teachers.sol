// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract TeachersContract is Ownable {

  using EnumerableSet for EnumerableSet.AddressSet;

  struct TeacherInfo {
    address addr;
    string name;
  }

  EnumerableSet.AddressSet teachers;
  mapping (address => TeacherInfo) internal teacherInfo;

  event TeacherRegistered (
    address indexed addr,
    string name
  );

  function registerNewTeacher(address _addr, string memory _name) public onlyOwner {
    require(_addr != address(0), "Invalid address");
    require(bytes(_name).length > 0, "Empty name not allowed");

    require(teachers.add(_addr) == true, "Address already registered");
    TeacherInfo memory _info = TeacherInfo(_addr, _name);
    teacherInfo[_addr] = _info;

    emit TeacherRegistered(_addr, _name);
  }

  function getTeacherCount() public view returns(uint) {
    return teachers.length();
  }

  function getTeacherInfoByIndex(uint _index) public view returns (address addr, string memory name) {
    if (_index < getTeacherCount()) {
      TeacherInfo storage info = teacherInfo[teachers.at(_index)];
      return (info.addr, info.name);
    }
    else {
      return (address(0), "");
    }
  }

  function getTeacherInfoByAddress(address _addr) public view returns (address addr, string memory name) {
    TeacherInfo storage info = teacherInfo[_addr];
    return (info.addr, info.name);
  }

  function checkTeacherRegistered(address _addr) public view returns (bool) {
    return teachers.contains(_addr);
  }
}
