export function setWebhook(workerURL: string, robotToken: string, webhookToken: string): Promise<any> {
	return fetch(`https://api.telegram.org/bot${robotToken}/setWebhook`, {
		method: 'POST',
		body: JSON.stringify({
			url: workerURL + '/webhook',
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

export function sendMessage(robotToken: string, chatid: number, msg: string): Promise<any> {
	return fetch(`https://api.telegram.org/bot${robotToken}/sendMessage`, {
		method: 'POST',
		body: JSON.stringify({
			chat_id: chatid,
			text: msg,
			parse_mode: 'Markdown',
		}),
		headers: {
			'content-type': 'application/json',
		},
	}).then((res) => res.json());
}

export function sendPhoto(robotToken: string, chatid: number, photo: string): Promise<any> {
	return fetch(`https://api.telegram.org/bot${robotToken}/sendMessage`, {
		method: 'POST',
		body: JSON.stringify({
			chat_id: chatid,
			photo,
		}),
		headers: {
			'content-type': 'application/json',
		},
	}).then((res) => res.json());
}
