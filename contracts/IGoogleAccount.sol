// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

interface IGoogleAccount {
    function getNonce() external view returns (uint256);

    function recoveryNonce() external view returns (uint256);

    function owner() external view returns (address);

    function execute(address dest, uint256 value, bytes calldata func) external;

    function updateOwnerByGoogleOIDC(
        address newOwner,
        string calldata header,
        string calldata idToken,
        bytes calldata sig
    ) external;
}
