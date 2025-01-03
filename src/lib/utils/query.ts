const SERVER_URL = 'http://127.0.0.1:9000/lambda-url/fetch_ad/ad';
//const SERVER_URL = 'https://y731tx3an4.execute-api.ap-southeast-2.amazonaws.com/Prod/ad';

export type Body = {
	tags: string[];
	category: string;
	region: string;
	language: string;
	gender: string;
	ratio: number;
	fill: string;
};

export async function query_ad(body: Body) {
	//console.log('Querying ad...');
	const json_body = JSON.stringify(body);

	const res = await fetch(SERVER_URL, {
		method: 'POST',
		body: json_body
	});

	//console.log(res);
	const data = await res.json();

	//console.log(data);
	return data;
}
