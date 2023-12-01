/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import webhook from './webhook';
import setWebhook from './setWebhook';
export interface Env {
	token: KVNamespace;
	imgs: R2Bucket;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { pathname } = new URL(request.url);
		try {
			switch (pathname) {
				case '/setWebhook':
					return setWebhook(request, env.token, ctx);
				case '/webhook':
					return webhook(request, env.token, env.imgs, ctx);
				default:
					return new Response('404 not found', {
						status: 404,
					});
			}
		} catch (e) {
			console.log(e);
		}
		return new Response('okk');
	},
};
