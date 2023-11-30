import { appendBlock, createNotion } from './notionApi';

export default async function setNotion(request: Request, token: KVNamespace, ctx: ExecutionContext) {
	const notionToken = await token.get('notionToken');
	if (!notionToken) return new Response('notion token didnt be storaged');
	const notion = createNotion(notionToken);
	await appendBlock(notion);
	return new Response('ok');
}
