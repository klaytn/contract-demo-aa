// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IPoll {
    // Read-only functions

    // Returns the contract owner who has permission to reset.
    function owner() external view returns (address);

    // Returns the number of votes received.
    function catVotes() external view returns (uint256);

    function dogVotes() external view returns (uint256);

    // Mutable functions

    // Reset all votes. Must be called by the owner.
    function reset() external;

    // Vote for one item.
    function voteCat() external;

    function voteDog() external;
}
