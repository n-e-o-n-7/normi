import { Client } from '@notionhq/client';

export function createNotion(notionToken: string) {
	return new Client({
		auth: notionToken,
	});
}

export async function pageAppendImage(notion: Client, page: string, after: string, url: string, mentionProps: object) {
	const blocks = await notion.blocks.children.list({
		block_id: page,
		page_size: 10,
	});

	const index = findFirstIndex(0, blocks.results, (e: any) => {
		return e.type && e.type === 'callout';
	});

	const callout = blocks.results[index] as any;
	const time = new Date(callout.callout['rich_text'][0]['plain_text']);
	if (time.toDateString() === new Date().toDateString()) {
		const last =
			findFirstIndex(index + 1, blocks.results, (e: any) => {
				return e.type && e.type != 'column_list';
			}) - 1;

		const columns = await notion.blocks.children.list({
			block_id: blocks.results[last].id,
			page_size: 4,
		});

		const insert = findFirstIndex(1, columns.results, (e: any) => {
			return !e['has_children'];
		});

		if (insert === -1) {
			await notion.blocks.children.append({
				block_id: page,
				children: [
					{
						object: 'block',
						type: 'column_list',
						column_list: {
							children: [
								{
									column: {
										children: [
											{
												image: {
													type: 'external',
													external: {
														url,
													},
												},
											},
										],
									},
								},
								{
									column: {
										children: [],
									},
								},
								{
									column: {
										children: [],
									},
								},
							],
						},
					},
				],
				after: blocks.results[last].id,
			});
		} else {
			await notion.blocks.children.append({
				block_id: columns.results[insert].id,
				children: [
					{
						image: {
							type: 'external',
							external: {
								url,
							},
						},
					},
				],
			});
		}
	} else {
		const date = new Date().toISOString();
		await notion.blocks.children.append({
			block_id: page,
			children: [
				{
					object: 'block',
					type: 'callout',
					callout: {
						rich_text: [
							{
								type: 'mention',
								mention: {
									date: {
										start: date,
										end: null,
										time_zone: null,
									},
								},
								annotations: {
									bold: false,
									italic: false,
									strikethrough: false,
									underline: false,
									code: false,
									color: 'default',
								},
							},
						],
						...mentionProps,
					},
				},
				{
					object: 'block',
					type: 'column_list',
					column_list: {
						children: [
							{
								column: {
									children: [
										{
											image: {
												type: 'external',
												external: {
													url,
												},
											},
										},
									],
								},
							},
							{
								column: {
									children: [],
								},
							},
							{
								column: {
									children: [],
								},
							},
						],
					},
				},
			],
			after,
		});
	}
}

export async function deliciousAppendImage(notion: Client, url: string) {
	const delicious = '2b236a1f25914959ac287615f99f579d';
	const action = '3af57349-7049-4b39-a765-b3af727d0795';
	await pageAppendImage(notion, delicious, action, url, {
		icon: {
			type: 'emoji',
			emoji: '🥦',
		},
		color: 'green_background',
	});
}

export async function catAppendImage(notion: Client, url: string) {
	const cat = 'eec3305af072485ab0af32843d2310ea';
	const action = 'c0139ab2-b056-40f0-866c-348fe6449838';
	await pageAppendImage(notion, cat, action, url, {
		icon: {
			type: 'emoji',
			emoji: '😼',
		},
		color: 'yellow_background',
	});
}

function findFirstIndex<T>(init: number, array: T[], condition: (e: T) => boolean) {
	for (let i = init; i < array.length; i++) {
		if (condition(array[i])) return i;
	}
	return -1;
}
