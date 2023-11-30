import { Client } from '@notionhq/client';

export function createNotion(notionToken: string) {
	return new Client({
		auth: notionToken,
	});
}

export async function appendBlock(notion: Client) {
	const catPageId = 'eec3305af072485ab0af32843d2310ea';
	const response = await notion.blocks.children.append({
		block_id: catPageId,
		children: [
			{
				heading_2: {
					rich_text: [
						{
							text: {
								content: 'Lacinato kale',
							},
						},
					],
				},
			},
		],
	});
	console.log(response);
}
