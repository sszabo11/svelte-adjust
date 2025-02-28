import { env } from '$env/dynamic/public';
import type { EditorElement } from '$lib/types.js';
import { generateHTML } from './generateHTML.js';
import { query_ad, type Body } from './query.js';

type Request = {
	ad_unit_id: number;
	ad_id: number;
	size_id: number;
	duration: number;
	height: number;
	width: number;
	data: Data;
	error: string | undefined;
};

type Data = {
	canvas: any;
	ad: any[];
};

export async function display(
	body: Body,
	borderRadius: number,
	priority: number
): Promise<{
	error: string | null;
	html: HTMLAnchorElement | undefined;
	ad_id?: number;
	size_id?: number;
	elements: EditorElement[] | undefined;
	response: Request | undefined;
	new: { width: number; height: number } | undefined;
}> {
	//console.log('Ad ratio: ', ratio);
	let error: null | string = null;

	console.log('ratio fweon', body.ratio);
	// Check if ratio exists
	if (isNaN(body.ratio) || !isFinite(body.ratio)) {
		error = 'Please specify width and height';
		return { error, html: undefined, response: undefined, new: undefined };
	}

	let api_key = env.PUBLIC_ADJUST_KEY;
	// Query ad with body
	const response: Request = await query_ad(body, api_key ?? undefined, priority);

	if (response.error) {
		console.log(response);
		return { error: response.error, html: undefined, response: undefined, new: undefined };
	}

	let data = response.data;
	if (!data) {
		return { error: 'Something went wrong', html: undefined, response: undefined, new: undefined };
	}

	let width = 0;
	let height = 0;

	let response_ratio = response.width / response.height;

	//console.log('Response ratio', response_ratio);

	if (body.fill === 'width') {
		height = body.width / response_ratio;
		width = body.width;
	} else if (body.fill === 'height') {
		width = body.height * response_ratio;
		height = body.height;
	} else {
		width = body.height * response_ratio;
		height = body.height / response_ratio;
	}

	//console.log('Canvas: ', data.canvas);
	//console.log('Ad: ', data.ad);

	//console.log('Response Width: ', response.width);
	//console.log('Response Height: ', response.height);

	let scaled = { width, height };

	//console.log('Scaled width: ', width);
	//console.log('Scaled height: ', height);

	let original = { width: response.width, height: response.height };
	let canvas = { ...original, fill: data.canvas.fill };

	const html = generateHTML(scaled, original, canvas, data.ad, borderRadius, true);

	return {
		error,
		html,
		response,
		elements: data.ad,
		new: { width, height },
		size_id: response.size_id,
		ad_id: response.ad_id
	};
}
