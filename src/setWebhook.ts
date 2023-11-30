export default function setWebhook(request: Request, token: KVNamespace, ctx: ExecutionContext) {
	const PRESHARED_AUTH_HEADER_KEY = 'X-Custom-1K';
	const PRESHARED_AUTH_HEADER_VALUE = 'pig';
	const value = request.headers.get(PRESHARED_AUTH_HEADER_KEY);
	if (value != PRESHARED_AUTH_HEADER_VALUE)
		return new Response('Sorry, you have supplied an invalid key.', {
			status: 403,
		});

	return new Response('Hello World!');
}
