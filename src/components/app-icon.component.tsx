import styles from './app-icon.component.module.scss';

import spriteHref from '../assets/icons/sprites.svg';
import { cx } from '../helpers/style.helpers.js';

import type { ComponentProps } from 'react';
import type { IconName } from '../assets/icons/icon-names.js';

export type AppIconProps = {
	/** the name of the icon to show. will show a default icon if not found */
	name: IconName;

	/** the size of the icon. @default `32px` */
	size?: number;

	/** the styles to apply to the svg element */
	className?: string;

	/** the props to pass to the `svg` element */
	svgProps?: Omit<ComponentProps<'svg'>, 'width' | 'height' | 'className'>;
};

export const AppIcon = ({ name, className, size, svgProps }: AppIconProps) => {
	return (
		<svg
			{...svgProps}
			width={size ?? 32}
			height={size ?? 32}
			className={cx(styles.svg, className)}
		>
			<use href={`${spriteHref}#${name}`} />
		</svg>
	);
};
