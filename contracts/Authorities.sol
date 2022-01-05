// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract AuthoritiesContract is Ownable {

  using EnumerableSet for EnumerableSet.AddressSet;

  EnumerableSet.AddressSet authorities;

  event AuthorityRegistered (
    address indexed addr
  );

  constructor() {
    registerNewAuthority(owner);
  }

  modifier onlyAuthority() {
    require(checkIfRegistered(msg.sender) == true, "Only a registered authority can carry out this action");
    _;
  }

  function registerNewAuthority(address _addr) public onlyOwner {
    require(_addr != address(0), "Invalid address");
    require(authorities.add(_addr) == true, "Address already registered");
    emit AuthorityRegistered(_addr);
  }

  function getAuthorityCount() public view returns(uint) {
    return authorities.length();
  }

  function getAuthorityByIndex(uint _index) public view returns (address addr) {
    return authorities.at(_index);
  }

  function checkIfRegistered(address _addr) public view returns (bool) {
    return authorities.contains(_addr);
  }
}
