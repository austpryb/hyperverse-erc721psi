// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./hyperverse/IHyperverseModule.sol";
//import "./hyperverse/Initializable.sol";
import "./utils/SafeMath.sol";
import "./utils/Counters.sol";
import "./extension/ERC721PsiRandomSeedRevealUpgradeable.sol";


/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */
contract ERC721PsiHyperverse is ERC721PsiRandomSeedRevealUpgradeable, IHyperverseModule {

	using SafeMath for uint256;
	using Counters for Counters.Counter;

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ S T A T E @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

	// Account used to deploy contract
	address public immutable contractOwner;

	//stores the tenant owner
	address private _tenantOwner;

	Counters.Counter public tokenCounter;
	bool public publicMint;

	bytes32 immutable public keyHash;
	uint64 immutable public subscriptionId;

	mapping(uint256 => string) public tokenName;

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E R R O R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	error AlreadyInitialized();
	error ZeroAddress();
	error NonexistentToken();
	error SameAddress();
	error Unauthorized();
	error InvalidERC721Receiver();
	error TokenAlreadyMinted();
	error TokenNotOwnedBySender();

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ M O D I F I E R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
	modifier isTenantOwner() {
		if (msg.sender != _tenantOwner) {
			revert Unauthorized();
		}
		_;
	}

	modifier canInitialize(address _tenant) {
		if (_tenantOwner != address(0)) {
			revert AlreadyInitialized();
		}
		_;
	}

	modifier checkMint() {
		if (publicMint == false && msg.sender != _tenantOwner) {
			revert Unauthorized();
		}
		_;
	}

	/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ C O N S T R U C T O R @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

	constructor(
		address _owner,
		bytes32 keyHash_,
		uint64 subscriptionId_,
		address _vrfV2Coordinator
		)
        ERC721PsiRandomSeedRevealUpgradeable(_vrfV2Coordinator, 100000, 3)
        {
		metadata = ModuleMetadata(
			"ERC721Psi",
			Author(_owner, "https://externallink.net"),
			"0.0.1",
			3479831479814,
			"https://externallink.net"
		);
		keyHash = keyHash_;
		subscriptionId = subscriptionId_;
		contractOwner = _owner;
	}

	function initialize(
    string memory name_,
		string memory symbol_,
    address _tenant
        //bytes32 keyHash_,
		//uint64 subscriptionId_,
		//address _vrfV2Coordinator
	) external initializer canInitialize(_tenant) {
		__ERC721Psi_init(name_, symbol_);
		_tenantOwner = _tenant;
	}

	function togglePublicMint() external isTenantOwner {
		publicMint = !publicMint;
	}

	function _baseURI() internal pure override returns (string memory) {
			return "https://dapp.io/api/metadata/";
	}

	function mint(address to, uint256 quantity) external {
			_safeMint(to, quantity);
	}

	function _burn(uint256 _tokenId) internal  {
			delete tokenName[_tokenId];
	}

	function reveal() external {
			_reveal();
	}

	function _keyHash() internal view override returns (bytes32) {
			return keyHash;
	}

	function _subscriptionId() internal view override returns (uint64) {
			return subscriptionId;
	}



}
