import { dev } from '$app/environment';
import { server_url } from './server.js';

const SERVER_URL = server_url({ prod: '/ad', dev: '/fetch_ad/ad' });

//const SERVER_URL = 'https://y731tx3an4.execute-api.ap-southeast-2.amazonaws.com/Prod/ad';

export type Body = {
	tags: string[];
	category: string;
	region: string;
	language: string;
	gender: string;
	ratio: number;
	fill: string;
	width: number;
	height: number;
};

export async function query_ad(body: Body, api_key: string | undefined) {
	//console.log('Querying ad...');
	const json_body = JSON.stringify(body);

	let headers: Record<string, string> = { 'X-Api-Key': api_key ?? '' };

	dev && (headers['X-Forwarded-For'] = '116.91.213.179, 3.172.16.106');

	console.log(headers);
	//headers: { 'X-Forwarded-For': '116.91.213.179, 3.172.16.106' },
	const res = await fetch(SERVER_URL, {
		method: 'POST',
		headers,
		body: json_body
	});

	//console.log(res);
	const data = await res.json();

	console.log(data);
	return data;
}
