import { setWebhook as setWebhookApi } from '../utils/tgApi';
export default async function setWebhook(request: Request, token: KVNamespace, ctx: ExecutionContext) {
	const PRESHARED_AUTH_HEADER_KEY = 'X-Custom-1K';
	const PRESHARED_AUTH_HEADER_VALUE = 'pig';
	const value = request.headers.get(PRESHARED_AUTH_HEADER_KEY);
	if (value != PRESHARED_AUTH_HEADER_VALUE)
		return new Response('Sorry, you have supplied an invalid key.', {
			status: 403,
		});

	const { origin, searchParams } = new URL(request.url);
	const robotToken = searchParams.get('token');
	if (!robotToken) return new Response('Hello World!');
	const workerURL = origin + '/webhook';
	const webhookToken = crypto.randomUUID();
	await token.put('webhookToken', webhookToken);
	await token.put('robotToken', robotToken);
	const res = await setWebhookApi(workerURL, robotToken, webhookToken);
	if (!res.ok) return new Response('setWebhook error');
	return new Response('setWebhook success');
}
