export default async function getImage(request: Request, imgs: R2Bucket, ctx: ExecutionContext) {
	const { searchParams } = new URL(request.url);
	const key = searchParams.get('key');
	if (!key) return new Response('no key');

	const object = await imgs.get(key);
	console.log(object);
	if (object === null) {
		return new Response('Object Not Found', { status: 404 });
	}

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set('etag', object.httpEtag);

	return new Response(object.body, {
		headers,
	});
}
