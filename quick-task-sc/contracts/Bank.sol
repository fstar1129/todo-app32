//SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

contract Bank {
    mapping(address => uint256) public userBalance;

    function getBalance(address user) public view returns (uint256 balance) {
        return userBalance[user];
    }

    function addToBalance() public payable {
        userBalance[msg.sender] += msg.value;
    }

    // this will prevent reentrancy attack.
    // we made first update state varible userBalance[msg.sender] = 0. then send the userBalance[msg.sender] to msg.sender
    function withdrawBalance() public {
        require(userBalance[msg.sender] != 0);
        userBalance[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: userBalance[msg.sender]}(
            "Withdraw started"
        );
        require(success, "Transfer failed.");
    }
}


contract Likable {
    uint256 public likes;

    function remove() public {
        require(likes < likes-1, "under flow");
        likes--;
    }

    function add() public {
        require(likes > likes+1, "Overflow");
        likes++;
    }
}
