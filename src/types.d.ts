interface Update {
	update_id: number;
	message?: Message;
	callback_query?: CallbackQuery;
}

interface Message {
	message_id: number;
	from?: User;
	sender_chat?: Chat;
	date: number;
	chat: Chat;

	text?: string;
	audio?: Audio;
	photo?: PhotoSize[];
	document?: Document;
	video?: Video;
	voice?: Voice;
}

interface User {
	id: number;
	is_bot: boolean;
	first_name: string;
}

interface Chat {
	id: number;
	type: 'private' | 'group' | 'supergroup' | 'channel';
}

interface PhotoSize {
	file_id: string;
	file_unique_id: string;
	width: number;
	height: number;
	file_size: number;
}

interface InlineKeyboardButton {
	text: string;
	url?: string;
	callback_data?: string;
}

interface InlineKeyboardMarkup {
	inline_keyboard: InlineKeyboardButton[][];
}

interface CallbackQuery {
	id: string;
	from: User;
	message?: Message;
	inline_message_id?: string;
	chat_instance?: string;
	data?: string;
	game_short_name?: string;
}

interface File {
	file_id: string;
	file_unique_id: string;
	file_size: number;
	file_path: string;
}
