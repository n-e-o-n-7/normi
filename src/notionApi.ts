import { Client } from '@notionhq/client';

export function createNotion(notionToken: string) {
	return new Client({
		auth: notionToken,
	});
}

export async function catAppendImage(notion: Client, url: string) {
	console.log(url);
	const cat = 'eec3305af072485ab0af32843d2310ea';
	const action = 'c0139ab2-b056-40f0-866c-348fe6449838';
	const blocks = await notion.blocks.children.list({
		block_id: cat,
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
				block_id: cat,
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
			block_id: cat,
			children: [
				{
					object: 'block',
					type: 'callout',
					callout: {
						rich_text: [
							{
								type: 'mention',
								mention: {
									type: 'date',
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
								plain_text: date,
								href: null,
							},
						],
						icon: {
							type: 'emoji',
							emoji: '😼',
						},
						color: 'yellow_background',
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
			after: action,
		});
	}
}

function findFirstIndex<T>(init: number, array: T[], condition: (e: T) => boolean) {
	for (let i = init; i < array.length; i++) {
		if (condition(array[i])) return i;
	}
	return -1;
}
