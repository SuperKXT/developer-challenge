import { NavLink } from 'react-router-dom';

import styles from './app-link.component.module.scss';

import { fixedForwardRef } from '../helpers/ref.helpers.js';
import { cx } from '../helpers/style.helpers.js';

import type { ElementRef, ReactNode, Ref } from 'react';
import type { NavLinkProps } from 'react-router-dom';

export type AppLinkProps = Omit<
	NavLinkProps,
	'to' | 'children' | 'className'
> & {
	/** the styles to apply to the anchor component */
	className?: string;

	/** the relative route for this link */
	to: string;

	/** the label of the link */
	children: ReactNode;
};

export const AppLink = fixedForwardRef(
	(
		{ to, children, className, ...linkProps }: AppLinkProps,
		ref: Ref<ElementRef<typeof NavLink>>,
	) => {
		return (
			<NavLink
				ref={ref}
				className={cx(styles.link, className)}
				to={to}
				{...linkProps}
			>
				{children}
			</NavLink>
		);
	},
);
