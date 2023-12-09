import styles from './button.component.module.scss';

import { cx } from '../helpers/style.helpers.js';

import type { ComponentProps, ReactNode } from 'react';

export type ButtonProps = Omit<ComponentProps<'button'>, 'label'> & {
	label?: ReactNode;
};
export const Button = ({
	label,
	className,
	children,
	...props
}: ButtonProps) => {
	return (
		<button
			className={cx(styles.button, className)}
			{...props}
		>
			{label ?? children}
		</button>
	);
};
