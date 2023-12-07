import { z } from 'zod';

import { backendPath } from '../config.js';
import { ApiError, AuthError, ConnectionError } from '../errors.js';

const responseSchema = z.object({
	statusCode: z.number(),
	error: z.string(),
	message: z.string(),
	data: z.unknown().optional(),
});

/**
 * the helper to send a request to the backend
 * @param apiPath the path of the api request
 * @param method the method of the current request. defaults to `GET`
 * @param body the body to sen with the request
 */
const apiRequest = async <Response = unknown>(
	apiPath: string,
	method: 'GET' | 'PATCH' | 'PUT' | 'POST' | 'DELETE',
	body?: Obj | Obj[] | FormData,
): Promise<Response> => {
	if (!navigator.onLine)
		throw new ConnectionError('not connected to the internet!');

	const options: Omit<RequestInit, 'headers'> & { headers: Headers } = {
		method,
		headers: new Headers(),
	};

	if (body && !(body instanceof FormData)) {
		options.body = JSON.stringify(body);
		options.headers.set('Content-Type', 'application/json');
	} else {
		options.body = body;
	}

	const response = await fetch(`${backendPath}/${apiPath}`, options);
	if (response.status === 401) throw new AuthError('login expired!');

	const result = responseSchema.safeParse(await response.json());
	if (!result.success) throw new ApiError('invalid api response format!');
	const { statusCode, message, data } = result.data;
	if (statusCode !== 200) throw new ApiError(message);
	else if (!response.ok) throw new ApiError('Unknown api error');
	return data as Response;
};

/**
 * the helper to send a `GET` request to the backend
 * @param apiPath the path of the api request
 * @param options the options to send with the request
 * @param options.schema the zod schema to parse the response with
 */
export const getRequest = async <Schema extends z.ZodSchema = z.ZodUnknown>(
	apiPath: string,
	options?: {
		schema?: Schema;
	},
): Promise<Schema['_output']> => {
	const response = apiRequest(apiPath, 'GET');
	if (!options?.schema) return response;
	return response.then(async (data) => {
		const parsed = (
			options.schema ? options.schema.parse(data) : data
		) as Promise<Schema['_output']>;
		return parsed;
	});
};

/**
 * the helper to send a `PATCH` request to the backend
 * @param apiPath the path of the api request
 * @param body the body of the request
 */
export const patchRequest = async <Response = unknown>(
	apiPath: string,
	body: Obj | FormData,
) => apiRequest<Response>(apiPath, 'PATCH', body);

/**
 * the helper to send a `PUT` request to the backend
 * @param apiPath the path of the api request
 * @param body the body of the request
 */
export const putRequest = async <Response = unknown>(
	apiPath: string,
	body: Obj | FormData,
) => apiRequest<Response>(apiPath, 'PUT', body);

/**
 * the helper to send a `POST` request to the backend
 * @param apiPath the path of the api request
 * @param body the body of the request
 */
export const postRequest = async <Response = unknown>(
	apiPath: string,
	body: Obj | Obj[] | FormData,
) => apiRequest<Response>(apiPath, 'POST', body);

/**
 * the helper to send a `DELETE` request to the backend
 * @param apiPath the path of the api request
 */
export const deleteRequest = async <Response = unknown>(
	apiPath: string,
	body?: Obj | Obj[] | FormData,
) => apiRequest<Response>(apiPath, 'DELETE', body);
