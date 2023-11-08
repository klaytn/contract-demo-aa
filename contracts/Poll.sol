// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./IPoll.sol";

contract Poll is IPoll {
    address public owner;

    uint256 public catVotes;
    uint256 public dogVotes;

    constructor() {
        owner = msg.sender;
    }

    function reset() external {
        require(msg.sender == owner);
        catVotes = 0;
        dogVotes = 0;
    }

    function voteCat() external {
        catVotes++;
    }

    function voteDog() external {
        dogVotes++;
    }
}
