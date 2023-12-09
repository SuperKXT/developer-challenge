import { http } from 'msw';

import { ApiError, AuthError, ConnectionError } from '../errors.js';
import { handlers } from '../mocks/handlers.js';
import { apiResponseSchema } from '../schemas.js';

import type { ResponseResolver } from 'msw';
import type { z } from 'zod';
import type { Utils } from '../types/utils.types.js';

export type ApiMethod = 'get' | 'patch' | 'put' | 'post' | 'delete';

/**
 * the helper to send a request to the backend
 * @param apiPath the path of the api request
 * @param method the method of the current request. defaults to `get`
 * @param body the body to sen with the request
 */
const apiRequest = async <Response = unknown>(
	apiPath: string,
	method: ApiMethod,
	body?: Obj | Obj[] | FormData,
): Promise<Response> => {
	if (!navigator.onLine)
		throw new ConnectionError('not connected to the internet!');

	const options: Omit<RequestInit, 'headers'> & { headers: Headers } = {
		method: method.toUpperCase(),
		headers: new Headers(),
	};

	if (body && !(body instanceof FormData)) {
		options.body = JSON.stringify(body);
		options.headers.set('Content-Type', 'application/json');
	} else {
		options.body = body;
	}

	const response = await fetch(apiPath, options);
	if (response.status === 401) throw new AuthError('login expired!');

	const result = apiResponseSchema.safeParse(await response.json());
	if (!result.success) throw new ApiError('invalid api response  format!');
	if (result.data.error) throw new ApiError(result.data.message);
	else if (!response.ok) throw new ApiError('Unknown api error');
	return result.data.data as never;
};

type ParamsFromPath<
	str extends string,
	params extends string = never,
> = str extends `${string}:${infer param}/${infer rest}`
	? ParamsFromPath<rest, params | param>
	: str extends `${string}:${infer param}`
	  ? params | param
	  : params;

type _ = [{}] extends [Record<string, never>] ? 1 : 0;
//   ^?

export const createRoute = <
	Path extends string,
	Body extends z.AnyZodObject | z.ZodArray<z.ZodUnknown> = never,
	Response extends
		| z.AnyZodObject
		| z.ZodString
		| z.ZodArray<z.AnyZodObject> = never,
	Params extends string = ParamsFromPath<Path>,
>(route: {
	path: Path;
	method: ApiMethod;
	body?: Body;
	response?: Response;
	mock: ResponseResolver<
		{ params: { [k in Params]: string } },
		Body['_output'],
		Response['_output']
	>;
}): ((
	...args: ([Params] extends [never]
		? unknown
		: { params: { [k in Params]: string } }) &
		([Body] extends [never] ? {} : { body: Body['_output'] }) extends infer Args
		? Args extends Record<string, never>
			? []
			: [args: Utils.prettify<Args>]
		: [never]
) => Promise<Response['_output']>) => {
	handlers.push(http[route.method](route.path, route.mock));
	return (async (args: {
		params: Record<string, string> | undefined;
		body: unknown;
	}) => {
		const path = args.params
			? route.path.replace(/:[^/]+)/gu, (match) =>
					args.params ? (args.params[match.slice(1)] as string) : match,
			  )
			: route.path;
		return apiRequest(path, route.method, args.body as never);
	}) as never;
};
