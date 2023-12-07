import type { CSSProperties } from 'react';

export type CxInput = 0 | undefined | false | null | string | CxInput[];

export const cx = (...input: CxInput[]): string => {
	return input
		.map((row) => {
			if (typeof row === 'string') return row;
			if (Array.isArray(row)) return cx(...row);
			return '';
		})
		.filter(Boolean)
		.join(' ');
};

export const wrappedTextStyle = {
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
} satisfies CSSProperties;

export const scrollStyles = {
	x: { overflowX: 'auto', overflowY: 'hidden', flexWrap: 'nowrap' },
	y: { overflowX: 'hidden', overflowY: 'auto', flexWrap: 'nowrap' },
	xy: { overflowX: 'auto', overflowY: 'auto', flexWrap: 'nowrap' },
} satisfies Record<string, CSSProperties>;
