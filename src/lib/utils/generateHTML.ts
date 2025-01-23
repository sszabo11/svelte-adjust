import 'animate.css';
import { animations } from './animations.js';

type Dimensions = {
	width: number;
	height: number;
};
export function generateHTML(
	scaled: Dimensions,
	original: Dimensions,
	canvas: any,
	elements: any[],
	link: boolean = false
) {
	let root: HTMLElement;
	if (link) {
		root = document.createElement('a');
	} else {
		root = document.createElement('div');
	}

	let rootWidth = scaled.width;
	let rootHeight = scaled.height;
	//console.log('Ad width: ', rootWidth);
	//console.log('Ad height: ', rootHeight);
	root.style.width = px(rootWidth);
	root.style.display = 'block';
	root.style.overflow = 'hidden';
	root.style.height = px(rootHeight);
	root.setAttribute('target', '_blank');
	root.style.position = 'relative';
	root.style.backgroundColor = canvas.fill;
	root.style.borderRadius = px(canvas.borderRadius || 10);
	root.classList.add('animate__fadeIn');
	root.style.animationDuration = '400ms';

	for (let i = 0; i < elements.length; i++) {
		let element = elements[i];
		let e: HTMLElement;
		if (element.type === 'vector') {
			e = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		} else {
			e = document.createElement(tag[element.type]);
		}

		if (element.type === 'text') {
			e.innerText = element.text;
			e.style.fontFamily = element.font.family;
			let font_ratio = original.width / element.font.size;
			let line_height_ratio = original.width / 20;
			e.style.fontSize = ratio(font_ratio, rootWidth);
			e.style.fontWeight = String(element.font.weight);
			//if (element.effects.bg) {
			//e.style.textShadow = element.effects.bg.
			//}
			e.style.fontStyle = element.font.italic ? 'italic' : 'normal';
			e.style.wordWrap = 'break-word';
			e.style.lineHeight = '100%';
			e.style.color = element.fill;

			if (element.effects?.bg && element.effects?.bg.type !== 'none') {
				let styles = effect_mapping[element.effects.bg.type](element.effects.bg);
				if (styles) {
					Object.keys(styles).forEach((style) => {
						e.style[style] = styles[style];
					});
				}
			}
		} else if (element.type === 'image') {
			let el = e as HTMLImageElement;

			el.src = element.src;

			if (element.background) {
				e.style.display = 'block';
				let offset_x_ratio = original.width / element.offsetX!;
				let offset_y_ratio = original.height / element.offsetY!;
				let offsetX = ratio(offset_x_ratio, rootWidth);
				let offsetY = ratio(offset_y_ratio, rootHeight);

				console.log(offsetX, offsetY);

				e.style.transform = `translate(calc(${offsetX} - 50%), calc(${offsetY} - 50%))`;
			}
		} else if (element.type === 'vector') {
			let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			let d = `M ${element.points[0].x} ${element.points[0].y} ${element.points
				.map((p) => `${p.x} ${p.y}`)
				.join(' ')} `;

			path.setAttributeNS(null, 'd', d);
			path.style.stroke = element.stroke.color || '#000000';
			path.style.fill = element.fill;
			path.style.strokeWidth = px(element.stroke.width || 1);
			e.appendChild(path);
		} else {
			e.style.backgroundColor = element.fill;
		}

		e.style.position = 'absolute';

		if (element.type === 'image') {
			let width = percant(element.width, original.width);
			e.style.width = width;
		} else {
			e.style.width = percant(element.width, original.width);
			e.style.height = percant(element.height, original.height);
		}

		if (!element?.background) {
			e.style.left = percant(element.x, original.width);
			e.style.top = percant(element.y, original.height);
		}

		if (element.stroke.width && element.type !== 'vector') {
			let stroke_ratio = original.width / element.stroke.width;
			e.style.borderWidth = ratio(stroke_ratio, rootWidth);
			e.style.borderColor = element.stroke.color || 'none';
			e.style.borderStyle = 'solid';
		}

		if (element.animations && element.animations.length > 0) {
			element.animations.forEach((animation) => {
				let class_name = animations[animation.type.toLowerCase()](animation);
				console.log(class_name);
				e.style.animationDuration = `${animation.duration}ms`;
				e.classList.add(class_name);
			});
		}

		root.appendChild(e);
	}
	//console.log(root);

	return root;
}

const tag = {
	rect: 'div',
	text: 'span',
	image: 'img',
	vector: 'svg'
};

function px(value: number) {
	return `${value}px`;
}

function percant(value: number, parent: number) {
	return `${(value / parent) * 100}%`;
}

function ratio(ratio: number, value: number) {
	return `${value / ratio}px`;
}

const effect_mapping: {
	[key: string]: (options: Effect) => Partial<CSSStyleDeclaration> | undefined;
} = {
	shadow: (options: Effect) => {
		if (!options.direction || !options.offset) return;

		let position = options.direction / 18;
		//return `
		//  text-shadow: ${position}px ${position}px ${options.color || '#ffffff'}${options.transparency ?? ''}
		//`;

		return {
			textShadow: `${position}px ${position}px ${options.color || '#ffffff'}${options.transparency ?? ''}`
		};
	},
	lift: (options: Effect) => {
		if (!options.intensity) return;

		return {
			textShadow: `0px 0px ${options.intensity}px #000000`
		};
	},
	hollow: (options: Effect) => {
		if (!options.thickness) return;

		//return `
		//    - webkit - text - stroke: ${options.thickness} px;
		//-webkit - text - fill - color: transparent;
		//paint - order: stroke fill;
		//text - stroke: ${options.thickness} px;

		//`;

		return {
			webkitTextStroke: px(options.thickness),
			webkitTextFillColor: 'transparent',
			paintOrder: 'stroke fill'
		};
	}
};
