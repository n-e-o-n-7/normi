export default function webhook(request: Request, robot: KVNamespace, ctx: ExecutionContext) {
	return new Response('Hello World!');
}
