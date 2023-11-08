// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

struct Article {
    address writer;
    string content;
}

interface IBoard {
    function reset() external;

    function write(string calldata content) external;

    function read(uint256 idx) external view returns (Article memory);

    function readAll() external view returns (Article[] memory);
}
