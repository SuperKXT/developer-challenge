import { useState } from 'react';

import { css } from '../css-hooks.js';
import { AuthError, stringifyError } from '../errors.js';

import type { Utils } from '../types/utils.types.js';

const hiddenStatusTypes = ['idle', 'submitting', 'loading'] as const;
type HiddenType = (typeof hiddenStatusTypes)[number];

const showingStatusTypes = ['error', 'success', 'info', 'warning'] as const;
type ShowingType = (typeof showingStatusTypes)[number];

type HiddenStatus = {
	type: HiddenType;
	hidingFrom?: ShowingType;
};

type ShowingStatus = {
	type: ShowingType;
	message: string;
};

export type Status = HiddenStatus | ShowingStatus;

export type StatusUpdate = Utils.prettify<
	| HiddenStatus
	| { type: 'error'; message: unknown }
	| ({
			type: 'success' | 'info' | 'warning';
			message: string;
	  } & Utils.allOrNone<{
			/** should the message be hidden after the specified `duration`? */
			ephemeral: boolean;
			/** the duration of the message. @default `2500ms` */
			duration?: number;
	  }>)
>;

const colors: Record<ShowingType, string> = {
	error: 'tomato',
	success: 'green',
	info: 'blue',
	warning: 'orange',
};

type StatusParams = {
	/** the styles to apply to the status */
	style?: React.CSSProperties;

	/** the key to add to the status. @default `status-hook-jsx` */
	key?: string;
};

const isHiddenStatus = (
	value: Status | StatusUpdate,
): value is HiddenStatus => {
	return hiddenStatusTypes.includes(value.type);
};

export const useStatus = (params?: StatusParams) => {
	const [status, setStatus] = useState<Status>({ type: 'idle' });

	const isShowing = !isHiddenStatus(status);
	const isBusy = status.type === 'loading' || status.type === 'submitting';

	const updateStatus = (value: StatusUpdate) => {
		if (isHiddenStatus(value)) {
			setStatus(value);
			if (value.hidingFrom) {
				setTimeout(() => {
					setStatus({ ...value, hidingFrom: undefined });
				}, 250);
			}
		} else if (value.type === 'error') {
			setStatus({
				type: 'error',
				message: stringifyError(value.message),
			});
		} else {
			if (value.ephemeral) {
				setTimeout(() => {
					updateStatus({ type: 'idle', hidingFrom: value.type });
				}, value.duration ?? 2500);
			}
			setStatus(value);
		}
	};

	/**
	 * Async wrapper for loading/submitting. takes care of updating the status and error handling.
	 *
	 * The after state will be set to:
	 * - if returning `void`: `idle`
	 * - if returning `string`: `success` with `ephemeral` set to true
	 * - if returning `StatusAction`: the returned object is set
	 */
	const asyncWrapper = async (
		type: 'load' | 'submit',
		func: () =>
			| StatusUpdate
			| string
			| undefined
			| void
			| Promise<StatusUpdate | string | undefined | void>,
	) => {
		updateStatus({ type: type === 'load' ? 'loading' : 'submitting' });
		try {
			if (isBusy)
				throw new Error('page is busy! please wait a couple seconds...');
			const response = await func();
			switch (typeof response) {
				case 'string':
					updateStatus({
						type: 'success',
						message: response,
						ephemeral: true,
					});
					break;
				case 'object':
					updateStatus(response);
					break;
				default:
					updateStatus({ type: 'idle' });
					break;
			}
		} catch (message) {
			if (message instanceof AuthError) throw message;
			updateStatus({ type: 'error', message });
		}
	};

	return {
		status,
		updateStatus,
		isBusy,
		statusJsx:
			isShowing || status.hidingFrom ? (
				<div
					key={params?.key ?? 'status-hook-jsx'}
					hidden={!isShowing}
					style={css({
						display: 'flex',
						flexWrap: 'nowrap',
						justifyContent: 'space-between',
						alignItems: 'center',
						flexBasis: 40,
						width: '100%',
						backgroundColor:
							colors[isShowing ? status.type : status.hidingFrom ?? 'error'],
						...params?.style,
					})}
				>
					<p>{isShowing ? status.message : ''}</p>
					<button
						onClick={() => {
							if (isHiddenStatus(status)) return;
							updateStatus({ type: 'idle', hidingFrom: status.type });
						}}
					/>
				</div>
			) : null,
		asyncWrapper,
	};
};
