// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BathToken is ERC20 {
    constructor() ERC20("Bathtub Token", "BATH") {
        _mint(msg.sender, 100_000_000 * 10 ** decimals()); // 18 decimals as per standard
    }
}
