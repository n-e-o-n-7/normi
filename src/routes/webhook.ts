import { catAppendImage, createNotion, deliciousAppendImage } from '../utils/notionApi';
import { answerCallbackQuery, editMessageReplyMarkup, getFile, sendPhoto } from '../utils/tgApi';

export default async function webhook(request: Request, token: KVNamespace, imgs: R2Bucket, ctx: ExecutionContext) {
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
				const path = await saveFile(message!, robotToken, imgs);
				const notion = await createNotion(notionToken);
				await catAppendImage(notion, `https://r2.kokyuu.workers.dev/${path}`);
				await setDone();
				break;
			}
			case 'delicious': {
				const path = await saveFile(message!, robotToken, imgs);
				const notion = await createNotion(notionToken);
				await deliciousAppendImage(notion, `https://r2.kokyuu.workers.dev/${path}`);
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

async function saveFile(message: Message, robotToken: string, imgs: R2Bucket) {
	const file_id = message.photo?.pop()?.file_id;
	const file = await getFile(robotToken, file_id!);
	const buffer = await fetch(`https://api.telegram.org/file/bot${robotToken}/${file.file_path}`).then((res) => res.arrayBuffer());
	const key = crypto.randomUUID();
	const name = file.file_path.split('/').pop();
	await imgs.put(key + name, buffer);
	return key + name;
}
