// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

contract BathToken is ERC20, Ownable {
    using SafeMath for uint256;

    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair;

    string private _name = "Bath";
    string private _symbol = "BATH";

    mapping(address => bool) excluded;
    bool public mintDisabled;
    address public taxAddress;
    address public deployer;
    uint256 public buyLiquidityFee; // 500 is 5%
    uint256 public sellLiquidityFee;

    constructor(
        uint256 _buyFee,
        uint256 _sellFee,
        address _routerAddr,
        address _taxAddr
    ) ERC20(_name, _symbol) {
        excluded[msg.sender] = true;
        taxAddress = _taxAddr;

        updateUniswapV2Router(_routerAddr);
        buyLiquidityFee = _buyFee;
        sellLiquidityFee = _sellFee;
        deployer = msg.sender;
        mintDisabled = false;
    }

    //to recieve ETH from uniswapV2Router when swaping
    receive() external payable {}

    modifier onlyOwnerOrOfficer() {
        require(
            owner() == msg.sender || deployer == msg.sender,
            "Caller is not the owner or the officer"
        );
        _;
    }

    function stopMint() external onlyOwner {
        require(mintDisabled == false, "Already Disabled");
        mintDisabled = true;
    }

    function mint(uint256 amount) external onlyOwnerOrOfficer {
        require(mintDisabled == false, "Mint is Disabled");
        _mint(_msgSender(), amount);
    }

    function updateUniswapV2Router(address _addr) public onlyOwnerOrOfficer {
        require(_addr != address(0), "zero address");

        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(_addr);

        // Create a uniswap pair for this new token
        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());

        // set the rest of the contract variables
        uniswapV2Router = _uniswapV2Router;
    }

    function excludeFromFee(address _addr) external onlyOwnerOrOfficer {
        require(_addr != address(0), "zero address is not allowed");
        excluded[_addr] = true;
    }

    function includeFromFee(address _addr) external onlyOwnerOrOfficer {
        require(_addr != address(0), "zero address is not allowed");
        excluded[_addr] = false;
    }

    function isExcludedFromFee(address _addr) public view returns (bool) {
        return excluded[_addr];
    }

    function updateBuyLiquidityFee(uint256 _fee) external onlyOwner {
        buyLiquidityFee = _fee;
    }

    function updateSellLiquidityFee(uint256 _fee) external onlyOwner {
        sellLiquidityFee = _fee;
    }

    function setTaxAddress(address taxAddress_) external onlyOwner {
        taxAddress = taxAddress_;
    }

    function transfer(address recipient, uint256 amount)
        public
        override
        returns (bool)
    {
        _tokenTransfer(_msgSender(), recipient, amount);

        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        _tokenTransfer(sender, recipient, amount);

        _approve(
            sender,
            _msgSender(),
            allowance(sender, _msgSender()).sub(
                amount,
                "ERC20: transfer amount exceeds allowance"
            )
        );
        return true;
    }

    function _tokenTransfer(
        address from,
        address to,
        uint256 amount
    ) private {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");

        if (
            (from == uniswapV2Pair || to == uniswapV2Pair) &&
            !isExcludedFromFee(from) &&
            !isExcludedFromFee(to)
        ) {
            uint256 swapFee = 0;

            if (to == uniswapV2Pair) {
                // Sell
                swapFee = sellLiquidityFee;
            } else {
                swapFee = buyLiquidityFee;
            }

            uint256 swapAmount = amount.mul(swapFee).div(10**4);
            uint256 remainingAmount = amount.sub(swapAmount);

            if (swapAmount > 0) {
                _transfer(from, taxAddress, swapAmount);
            }
            _transfer(from, to, remainingAmount);
        } else {
            _transfer(from, to, amount);
        }
    }
}
