import {
	isRouteErrorResponse,
	useNavigate,
	useRouteError,
} from 'react-router-dom';

import { Button } from './button.component.js';
import styles from './error-boundary.component.module.scss';

export const ErrorBoundary = () => {
	const navigate = useNavigate();
	const error = useRouteError();

	return (
		<div className={styles.container}>
			{isRouteErrorResponse(error) && (
				<>
					<h1>{error.status}</h1>
					<h3>{error.statusText}</h3>
					{/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
					{error.data?.message && (
						/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
						<p>{error.data.message}</p>
					)}
				</>
			)}

			{error instanceof Error && (
				<>
					<h3>{error.name}</h3>
					<p>{error.message}</p>
				</>
			)}
			<div>
				<Button
					label='Back'
					onClick={() => {
						navigate(-1);
					}}
				/>
				<Button
					label='Reload'
					onClick={() => {
						navigate(0);
					}}
				/>
			</div>
		</div>
	);
};
