import { dev } from '$app/environment';

let dev_url = 'http://127.0.0.1:9000/lambda-url';
let prod_url = 'https://y731tx3an4.execute-api.ap-southeast-2.amazonaws.com/Prod';

export function server_url({ prod, dev: devEnv }: { prod: string; dev: string }) {
	const base_url = dev ? dev_url : prod_url;

	const endpoint = `${base_url}${!dev ? prod : devEnv}`;
	return endpoint;
}
