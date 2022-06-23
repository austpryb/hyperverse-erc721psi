import {
	isEvm,
	Blockchain,
	BlockchainEvm,
	EvmEnvironment,
	NetworkConfig,
} from '@decentology/hyperverse';

import Contracts from '../contracts.json';
import { ContractInterface } from 'ethers';
import ERC721FactoryABI from '../artifacts/contracts/ERC721PsiFactory.sol/ERC721PsiFactory.json';
import ERC721ABI from '../artifacts/contracts/ERC721PsiHyperverse.sol/ERC721PsiHyperverse.json';

export const FactoryABI = ERC721FactoryABI.abi as ContractInterface;
export const ContractABI = ERC721ABI.abi as ContractInterface;

const environment = Contracts as EvmEnvironment;

function getEnvironment(blockchainName: Blockchain, network: NetworkConfig) {
	if (blockchainName == null) {
		throw new Error('Blockchain is not set');
	}
	if (!isEvm(blockchainName)) {
		throw new Error('Blockchain is not EVM compatible');
	}

	const chain = environment[blockchainName as BlockchainEvm];
	if (!chain) {
		throw new Error('Blockchain is not supported');
	}
	const env = chain[network.type];
	//console.log(chain, blockchainName);
	return {
		...env,
		ContractABI,
		FactoryABI,
	};
}

export { environment, getEnvironment };
