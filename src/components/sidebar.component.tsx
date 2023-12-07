import { css } from '../css-hooks.js';

const width = { full: 200, minimized: 70 };

export const Sidebar = () => {
	return (
		<aside
			style={css({
				width: width.full,
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				whiteSpace: 'nowrap',
				backgroundColor: 'grey',
				borderRightWidth: 2,
				borderRightStyle: 'solid',
				borderRightColor: 'darkgrey',
				transition: 'width 0.2s linear',
			})}
		>
			Sidebar
		</aside>
	);
};
