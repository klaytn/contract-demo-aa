// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

interface IGoogleAccountFactory {
    function getAddress(address owner, uint256 salt, string memory sub) external view returns (address);
}
