import {
	isRouteErrorResponse,
	useNavigate,
	useRouteError,
} from 'react-router-dom';

import { css } from '../css-hooks.js';
import { wrappedTextStyle } from '../helpers/style.helpers.js';

export const ErrorBoundary = () => {
	const navigate = useNavigate();
	const error = useRouteError();

	const headingStyles = css({
		...wrappedTextStyle,
		maxWidth: '95%',
		lineHeight: 1,
		textAlign: 'center',
	});
	const styles = {
		h1: css({
			...headingStyles,
			fontSize: '10rem',
			fontWeight: 'bold',
			color: 'tomato',
		}),
		h3: css({
			fontSize: '3.5rem',
			fontWeight: 'medium',
			color: 'tomato',
		}),
		p: css({
			textAlign: 'center',
			fontSize: '1.1rem',
			lineHeight: 1.3,
			maxWidth: '80%',
			maxHeight: 300,
		}),
	};

	return (
		<div
			style={css({
				display: 'flex',
				flexDirection: 'column',
			})}
		>
			<div>
				{isRouteErrorResponse(error) && (
					<>
						<h1 style={styles.h1}>{error.status}</h1>
						<h3 style={styles.h3}>{error.statusText}</h3>
						{/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
						{error.data?.message && (
							/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
							<p style={styles.p}>{error.data.message}</p>
						)}
					</>
				)}

				{error instanceof Error && (
					<>
						<h3 style={styles.h3}>{error.name}</h3>
						<p style={styles.p}>{error.message}</p>
					</>
				)}
				<div
					style={css({
						display: 'flex',
						gap: 10,
					})}
				>
					<button
						onClick={() => {
							navigate(-1);
						}}
					>
						Back
					</button>
					<button
						onClick={() => {
							navigate(0);
						}}
					>
						Reload
					</button>
				</div>
			</div>
		</div>
	);
};
