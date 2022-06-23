import { initialize, Network, NetworkConfig, Provider } from '@decentology/hyperverse';
import { Localhost, Ethereum } from '@decentology/hyperverse-evm';
import { FC, VFC } from 'react';
import * as ERC721Psi from '../../source';

export const HyperverseProvider: FC<{}> = ({ children }) => {
	const hyperverse = initialize({
		blockchain: process.env.STORYBOOK_NETWORK === 'rinkeby' ? Ethereum : Localhost,
		network:
			process.env.STORYBOOK_NETWORK === 'rinkeby'
				? {
						type: Network.Testnet,
						name: 'rinkeby',
						chainId: 4,
						networkUrl: process.env.NEXT_PUBLIC_WEB3_BASE_URL + process.env.NEXT_PUBLIC_WEB3_API_KEY,
						providerId: process.env.NEXT_PUBLIC_WEB3_API_KEY,
						blockExplorer: 'https://rinkeby.etherscan.io',
				  }
				: {
						type: Network.Testnet,
						chainId: 31337,
						name: 'localhost',
						networkUrl: 'http://localhost:6006/hyperchain',
				  },
		modules: [
			{
				bundle: ERC721Psi,
				tenantId:
					process.env.STORYBOOK_NETWORK === 'rinkeby'
						? '0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81'
						: '0x5e7564d9942F2073d20C6B65d0e73750a6EC8D81',
			},
		],
	});
	return <Provider initialState={hyperverse}>{children}</Provider>;
};
