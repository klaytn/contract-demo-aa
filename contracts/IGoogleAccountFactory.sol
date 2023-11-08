// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "./IGoogleAccount.sol";

interface IGoogleAccountFactory {
    function createAccount(address owner, uint256 salt, string calldata sub) external returns (IGoogleAccount);

    function getAddress(address owner, uint256 salt, string memory sub) external view returns (address);
}
