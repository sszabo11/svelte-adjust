import type { Canvas, EditorElement } from '$lib/types.js';
import { generateHTML } from './generateHTML.js';
import { query_ad, type Body } from './query.js';

type Request = {
	ad_id: number;
	size_id: number;
	duration: number;
	height: number;
	width: number;
	data: Data;
	error: string | undefined;
};

type Data = {
	canvas: Canvas;
	ad: EditorElement[];
};

export async function display(
	ratio: number,
	body: Body,
	rect: DOMRect
): Promise<{
	error: string | null;
	html: HTMLDivElement | undefined;
	ad_id?: number;
	size_id?: number;
	response: Request | undefined;
	new: { width: number; height: number } | undefined;
}> {
	//console.log('Ad ratio: ', ratio);
	let error: null | string = null;

	// Check if ratio exists
	if (isNaN(ratio) || !isFinite(ratio)) {
		error = 'Please specify width and height';
		return { error, html: undefined, response: undefined, new: undefined };
	}

	// Query ad with body
	const response: Request = await query_ad(body);

	if (response.error) {
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
		height = rect.width / response_ratio;
		width = rect.width;
	} else if (body.fill === 'height') {
		width = rect.height * response_ratio;
		height = rect.height;
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

	const html = generateHTML(scaled, original, canvas, data.ad);

	return {
		error,
		html,
		response,
		new: { width, height },
		size_id: response.size_id,
		ad_id: response.ad_id
	};
}
