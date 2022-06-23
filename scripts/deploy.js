// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');
const fs = require('fs-extra');
const path = require('path');
const { constants } = require('ethers');

require('dotenv').config();
async function main() {
	const [deployer] = await ethers.getSigners();
	const hyperverseAdmin = deployer.address;
	console.log('Deploying contracts with the account:', deployer.address);
	console.log('Account balance:', (await deployer.getBalance()).toString());


	const NFT = await ethers.getContractFactory('ERC721PsiHyperverse');
	const nftContract = await NFT.deploy(hyperverseAdmin, "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", 3487, "0x6168499c0cFfCaCD319c818142124B7A15E857ab");
	await nftContract.deployed();

	const NFTFactory = await ethers.getContractFactory('ERC721PsiFactory');
	const nftFactoryContract = await NFTFactory.deploy(nftContract.address, hyperverseAdmin);
	await nftFactoryContract.deployed();


	console.log(`[${hre.network.name}] NFT Contract deployed to: ${nftContract.address}`);
	console.log(`[${hre.network.name}] NFT Factory deployed to: ${nftFactoryContract.address}`);

	const env = JSON.parse(fs.readFileSync('contracts.json').toString());
	env[hre.network.name] = env[hre.network.name] || {};
	env[hre.network.name].testnet = env[hre.network.name].testnet || {};

	env[hre.network.name].testnet.contractAddress = nftContract.address;
	env[hre.network.name].testnet.factoryAddress = nftFactoryContract.address;

	// Save contract addresses back to file
	fs.writeJsonSync('contracts.json', env, { spaces: 2 });
	let proxyAddress = constants.AddressZero;
	const instanceTnx = await nftFactoryContract.createInstance(deployer.address, 'Neutrino', 'NTRN');
	instanceTnx.wait();
	console.log('Instance Created', instanceTnx.hash);
	while (proxyAddress === constants.AddressZero) {
		try {
			proxyAddress = await nftFactoryContract.getProxy(deployer.address);
		} catch (error) {
			proxyAddress = constants.AddressZero;
		}
	}

}

main()
	// .then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

module.exports = { main };
