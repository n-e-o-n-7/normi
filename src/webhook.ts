import { sendPhoto } from './tgApi';
import { Update } from './types';

export default async function webhook(request: Request, token: KVNamespace, ctx: ExecutionContext) {
	if (request.method != 'POST') return new Response('method not allowed', { status: 405 });

	const robotToken = await token.get('robotToken');
	if (!robotToken) return new Response('token didnt be storaged');
	const webhookToken = await token.get('webhookToken');
	if (webhookToken !== request.headers.get('X-Telegram-Bot-Api-Secret-Token')) {
		return new Response('unauthorized', { status: 401 });
	}

	const update = (await request.json()) as Update;

	if (!update.message) return new Response('ok');

	if (update.message.chat.type != 'private') return new Response('ok');

	const chatId = update.message.chat.id;
	console.log(update.message);
	if (update.message.photo) {
		console.log(update.message.photo[0].file_id);
		const res = await sendPhoto(robotToken, chatId, update.message.photo[0].file_id);
		console.log(res);
	}

	return new Response('ok');
}
