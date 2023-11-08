// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./IBoard.sol";

contract Board is IBoard {
    address public owner;

    uint256 public cnt;
    mapping(uint256 => Article) public article;

    constructor() {
        owner = msg.sender;
    }

    function reset() external {
        require(msg.sender == owner);
        cnt = 0;
    }

    function write(string calldata content) external {
        article[cnt] = Article(msg.sender, content);
        cnt += 1;
    }

    function read(uint256 idx) external view returns (Article memory) {
        return article[idx];
    }

    function readAll() external view returns (Article[] memory) {
        Article[] memory ret = new Article[](cnt);
        for (uint256 i = 0; i < cnt; i++) {
            ret[i] = article[i];
        }
        return ret;
    }
}
