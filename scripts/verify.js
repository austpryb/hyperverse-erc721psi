const hre = require('hardhat');

// [rinkeby] NFT Contract deployed to: 0x81596B132e9995F94791B843EcB1c227b5983FF5
// [rinkeby] NFT Factory deployed to: 0x1742ac9494ce4C22e78c0f2f72f39A29F7748501

require('dotenv').config();


async function main() {
	const [deployer] = await ethers.getSigners();
	const hyperverseAdmin = deployer.address;

  await hre.run('verify:verify', {
    address: "0x81596B132e9995F94791B843EcB1c227b5983FF5", // nftContractAddress
    constructorArguments: [
      hyperverseAdmin,
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
      3487,
      "0x6168499c0cFfCaCD319c818142124B7A15E857ab"
    ],
  })

  await hre.run('verify:verify', {
    address: "0x1742ac9494ce4C22e78c0f2f72f39A29F7748501", // nftFactoryContractAddress
    constructorArguments: [
      "0x81596B132e9995F94791B843EcB1c227b5983FF5", // nftContractAddress
      hyperverseAdmin
    ],
  })
}

main()
	// .then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

module.exports = { main };
