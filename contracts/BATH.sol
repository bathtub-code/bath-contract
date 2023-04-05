// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BathToken is IERC20, Ownable {
    bool public mintDisabled;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    string public constant name = "Bath";
    string public constant symbol = "BATH";
    uint8 public constant decimals = 8;

    uint256 private _totalSupply = 0;

    address public deployer;
    address public taxAddress;
    uint8 public taxPercent; 
    mapping(address => bool) public isWhitelisted;

    event TransferFee(address sender, address recipient, uint256 amount);
    event SetBeneficiaryFeePercentage(uint8 feePercentage);
    event SetBeneficiaryAddress(address beneficiaryAddress);

    constructor(uint8 taxPercent_ ,address taxAddress_) {
        _balances[msg.sender] = _totalSupply;
        taxPercent = taxPercent_; //1000 is 100% 
        taxAddress = taxAddress_;
        isWhitelisted[msg.sender] = true;
        isWhitelisted[taxAddress] = true;
        deployer = msg.sender;
        mintDisabled = false;
    }

    modifier onlyOwnerOrOfficer() {
        require(owner() == msg.sender || deployer == msg.sender, "Caller is not the owner or the officer");
        _;
    }

    function stopMint() external onlyOwner {
        require(mintDisabled == false, "Already Disabled");
        mintDisabled = true;
    }

    function mint(uint256 amount) external onlyOwnerOrOfficer{
        require(mintDisabled == false, "Mint is Disabled");
        _mint(_msgSender(), amount);
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][_msgSender()];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }

        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) external returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool) {
        uint256 currentAllowance = _allowances[_msgSender()][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(_msgSender(), spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    function setBeneficiaryFeePercentage(uint8 taxPercent_) external onlyOwner {
        require(taxPercent_ <= 100, "Bath: transaction fee percentage exceeds 10%");
        require(taxPercent_ >= 0, "Bath: transaction fee percentage equals 0");
        taxPercent = taxPercent_;
        emit SetBeneficiaryFeePercentage(taxPercent);
    }
    
    function setBeneficiaryAddress(address taxAddress_) external onlyOwner {
        taxAddress = taxAddress_;
        emit SetBeneficiaryAddress(taxAddress);
    }
  
    function setWhitelist(address address_, bool isWhitelist) external onlyOwner {
        isWhitelisted[address_] = isWhitelist;
    }

    function totalSupply() external view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) private {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[sender] = senderBalance - amount;
        }

        uint256 receiveAmount = amount;
        if (isWhitelisted[sender] || isWhitelisted[recipient]) {
            _balances[recipient] += receiveAmount;
        } else {
            uint256 taxAmount = (amount * taxPercent) / 1000;
            receiveAmount = amount - taxAmount;
            _balances[taxAddress] += taxAmount;
            _balances[recipient] += receiveAmount;

            emit TransferFee(sender, taxAddress, taxAmount);
            emit Transfer(sender, recipient, receiveAmount);
        }

        emit Transfer(sender, recipient, receiveAmount);
    }

    function _mint(address account, uint256 amount) private {
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
}