// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Authorities.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract CertiContract is AuthoritiesContract {

  using EnumerableSet for EnumerableSet.Bytes32Set;

  struct CertificateInfo {
    bytes32 certificateId;
    address studentAddr;
    address certProviderAddr;
    uint marks;
    uint totalMarks;
    uint timestamp;
    string courseName;
    string studentName;
  }

  EnumerableSet.Bytes32Set certificates;
  mapping (bytes32 => CertificateInfo) public certificateInfo;

  event CertificateGenerated (
    address indexed studAddr,
    address indexed providerAddr,
    bytes32 certId,
    uint timestamp,
    string courseName
  );

  function certify(
    bytes32 _id,
    address _studAddr,
    uint _marks,
    uint _totalMarks,
    string memory _course,
    string memory _studName
  ) public onlyAuthority {
    require(uint(_id) != 0, "Invalid certificate id");
    require(_studAddr != msg.sender, "You can't certify yourself");
    require(bytes(_course).length > 0, "Empty course name!");
    require(bytes(_studName).length > 0, "Empty student name!");
    require(_marks <= _totalMarks, "Obtained marks can't be more than total marks");

    require(certificates.add(_id) == true, "Certificate ID already present");
    CertificateInfo memory _certificate;
    _certificate.certificateId = _id;
    _certificate.studentAddr = _studAddr;
    _certificate.certProviderAddr = msg.sender;
    _certificate.marks = _marks;
    _certificate.totalMarks = _totalMarks;
    _certificate.timestamp = block.timestamp;
    _certificate.courseName = _course;
    _certificate.studentName = _studName;
    certificateInfo[_id] = _certificate;

    emit CertificateGenerated(_studAddr, msg.sender, _id, block.timestamp, _course);
  }

  function getCertificateCount() public view returns(uint) {
    return certificates.length();
  }

  function getCertificateInfoByIndex(uint _index) public view
  returns(
    bytes32 certificateId,
    address studentAddr,
    address certProviderAddr,
    uint marks,
    uint totalMarks,
    uint timestamp,
    string memory courseName,
    string memory studentName
  )
  {
    if (_index < getCertificateCount()) {
      CertificateInfo storage cert = certificateInfo[certificates.at(_index)];
      return (
        cert.certificateId,
        cert.studentAddr,
        cert.certProviderAddr,
        cert.marks,
        cert.totalMarks,
        cert.timestamp,
        cert.courseName,
        cert.studentName
      );
    }
    else {
      return (bytes32(0), address(0), address(0), 0, 0, 0, "", "");
    }
  }

  function checkCertificateProvided(bytes32 _id) public view returns (bool) {
    return certificates.contains(_id);
  }
}
