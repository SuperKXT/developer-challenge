import spriteHref from '../assets/icons/sprites.svg';
import { css } from '../css-hooks.js';

import type { ComponentProps } from 'react';
import type { IconName } from '../assets/icons/icon-names.js';

export type AppIconProps = {
	/** the name of the icon to show. will show a default icon if not found */
	name: IconName;

	/** the props to pass to the `svg` element */
	svgProps?: ComponentProps<'svg'>;
};

export const AppIcon = ({ name, svgProps: iconProps }: AppIconProps) => {
	return (
		<svg
			{...iconProps}
			style={css({
				children: { fill: 'currentColor' },
				hover: { focusChildren: { fill: 'darkblue' } },
				focus: { focusChildren: { fill: 'darkblue' } },
			})}
		>
			<use href={`${spriteHref}#${name}`} />
		</svg>
	);
};
