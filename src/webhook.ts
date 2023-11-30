import { answerCallbackQuery, editMessageReplyMarkup, sendPhoto } from './tgApi';
import { InlineKeyboardMarkup, Update } from './types';

export default async function webhook(request: Request, token: KVNamespace, ctx: ExecutionContext) {
	if (request.method != 'POST') return new Response('method not allowed', { status: 405 });

	const robotToken = await token.get('robotToken');
	if (!robotToken) return new Response('token didnt be storaged');
	const webhookToken = await token.get('webhookToken');
	if (webhookToken !== request.headers.get('X-Telegram-Bot-Api-Secret-Token')) {
		return new Response('unauthorized', { status: 401 });
	}

	const update = (await request.json()) as Update;
	console.log(update);
	if (update.message) {
		if (update.message.chat.type != 'private') return new Response('only private');
		const chatId = update.message.chat.id;
		if (update.message.photo) {
			const inlineKeyboard: InlineKeyboardMarkup = {
				inline_keyboard: [
					[
						{
							text: 'normi',
							callback_data: 'normi',
						},
						{
							text: 'delicious',
							callback_data: 'delicious',
						},
					],
				],
			};
			await sendPhoto(robotToken, chatId, update.message.photo[0].file_id, inlineKeyboard);
		}
	}

	if (update.callback_query) {
		const { id, inline_message_id, data } = update.callback_query;
		if (data === 'normi') {
			const inlineKeyboard: InlineKeyboardMarkup = {
				inline_keyboard: [
					[
						{
							text: 'Done',
						},
					],
				],
			};
			await answerCallbackQuery(robotToken, id);
			await editMessageReplyMarkup(robotToken, undefined, undefined, inline_message_id, inlineKeyboard);
		}
	}

	return new Response('ok');
}
