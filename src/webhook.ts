import { catAppendImage, createNotion } from './notionApi';
import { answerCallbackQuery, editMessageReplyMarkup, sendPhoto } from './tgApi';
import { InlineKeyboardMarkup, Update } from './types';

export default async function webhook(request: Request, token: KVNamespace, ctx: ExecutionContext) {
	if (request.method != 'POST') return new Response('method not allowed', { status: 405 });

	const robotToken = await token.get('robotToken');
	if (!robotToken) return new Response('robot token didnt be storaged');
	const notionToken = await token.get('notionToken');
	if (!notionToken) return new Response('notion token didnt be storaged');
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
		const { id, message, inline_message_id, data } = update.callback_query;
		async function setDone() {
			const inlineKeyboard: InlineKeyboardMarkup = {
				inline_keyboard: [
					[
						{
							text: 'Done',
							callback_data: 'Done',
						},
					],
				],
			};
			await editMessageReplyMarkup(robotToken!, message?.chat.id, message?.message_id, inline_message_id, inlineKeyboard);
		}

		switch (data) {
			case 'normi': {
				const notion = await createNotion(notionToken);
				const url = ' ';
				await catAppendImage(notion, url);
				await setDone();
				break;
			}
			case 'delicious': {
				await setDone();
				break;
			}
			default:
				break;
		}
		await answerCallbackQuery(robotToken, id);
	}

	return new Response('ok');
}
