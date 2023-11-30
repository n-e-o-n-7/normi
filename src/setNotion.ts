import { catAppendImage, createNotion } from './notionApi';

export default async function setNotion(request: Request, token: KVNamespace, ctx: ExecutionContext) {
	const notionToken = await token.get('notionToken');
	if (!notionToken) return new Response('notion token didnt be storaged');
	const notion = createNotion(notionToken);
	await catAppendImage(
		notion,
		'https://images.unsplash.com/photo-1697192715136-23666b08fe04?q=70&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
	);
	return new Response('ok');
}
