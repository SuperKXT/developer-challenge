import { NavLink } from 'react-router-dom';

import { fixedForwardRef } from '../helpers/ref.helpers.js';

import type { ElementRef, ReactNode, Ref } from 'react';
import type { NavLinkProps } from 'react-router-dom';

export type AppLinkProps = NavLinkProps & {
	/** the relative route for this link */
	to: string;

	/** the label of the link */
	label: ReactNode;
};

export const AppLinkInner = fixedForwardRef(
	(
		{ to, label, children, ...linkProps }: AppLinkProps,
		ref: Ref<ElementRef<typeof NavLink>>,
	) => {
		return (
			<NavLink
				ref={ref}
				to={to}
				{...linkProps}
			>
				{children ?? label}
			</NavLink>
		);
	},
);
