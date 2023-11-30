import { InlineKeyboardMarkup } from './types';

export function setWebhook(workerURL: string, robotToken: string, webhookToken: string): Promise<any> {
	return fetch(`https://api.telegram.org/bot${robotToken}/setWebhook`, {
		method: 'POST',
		body: JSON.stringify({
			url: workerURL,
			secret_token: webhookToken,
		}),
		headers: {
			'content-type': 'application/json',
		},
	}).then((res) => res.json());
}

export function deleteWebhook(robotToken: string): Promise<any> {
	return fetch(`https://api.telegram.org/bot${robotToken}/deleteWebhook`, {
		method: 'POST',
		body: JSON.stringify({
			drop_pending_updates: 'true',
		}),
		headers: {
			'content-type': 'application/json',
		},
	}).then((res) => res.json());
}

export function sendMessage(robotToken: string, chat_id: number, msg: string): Promise<any> {
	return fetch(`https://api.telegram.org/bot${robotToken}/sendMessage`, {
		method: 'POST',
		body: JSON.stringify({
			chat_id,
			text: msg,
			parse_mode: 'Markdown',
		}),
		headers: {
			'content-type': 'application/json',
		},
	}).then((res) => res.json());
}

export function sendPhoto(robotToken: string, chat_id: number, photo: string, reply_markup?: InlineKeyboardMarkup): Promise<any> {
	return fetch(`https://api.telegram.org/bot${robotToken}/sendPhoto`, {
		method: 'POST',
		body: JSON.stringify({
			chat_id,
			photo,
			reply_markup,
		}),
		headers: {
			'content-type': 'application/json',
		},
	}).then((res) => res.json());
}

export function editMessageReplyMarkup(
	robotToken: string,
	chat_id?: number,
	message_id?: string,
	inline_message_id?: string,
	reply_markup?: InlineKeyboardMarkup
): Promise<any> {
	return fetch(`https://api.telegram.org/bot${robotToken}/editMessageReplyMarkup`, {
		method: 'POST',
		body: JSON.stringify({
			chat_id,
			message_id,
			inline_message_id,
			reply_markup,
		}),
		headers: {
			'content-type': 'application/json',
		},
	}).then((res) => res.json());
}

export function answerCallbackQuery(robotToken: string, callback_query_id: string) {
	return fetch(`https://api.telegram.org/bot${robotToken}/answerCallbackQuery`, {
		method: 'POST',
		body: JSON.stringify({
			callback_query_id,
		}),
		headers: {
			'content-type': 'application/json',
		},
	}).then((res) => res.json());
}
