import { useERC721 } from '../source';
import { useEvm } from '@decentology/hyperverse-evm';
import './style.css';

export const Transfer = ({ ...props }) => {
	const { transfer } = useERC721();
	const { address, Connect } = useEvm();

	return address ? (
		<button
			type="button"
			className={['storybook-button', `storybook-button--large`].join(' ')}
			style={{ color: 'blue' }}
			onClick={() => {
				transfer(props.transfer);
			}}
		>
			Transfer
		</button>
	) : (
		<Connect />
	);
};
