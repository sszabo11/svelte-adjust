import type { Canvas, EditorElement } from '$lib/types.js';

type Dimensions = {
  width: number;
  height: number;
};
export function generateHTML(
  scaled: Dimensions,
  original: Dimensions,
  canvas: Canvas,
  elements: EditorElement[]
) {
  let root = document.createElement('div');

  let rootWidth = scaled.width;
  let rootHeight = scaled.height;
  //console.log('Ad width: ', rootWidth);
  //console.log('Ad height: ', rootHeight);
  root.style.width = px(rootWidth);
  root.style.height = px(rootHeight);
  root.style.position = 'relative';
  root.style.backgroundColor = canvas.fill;
  root.style.borderRadius = px(canvas.borderRadius || 10);

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
    } else if (element.type === 'image') {
      let el = e as HTMLImageElement;

      el.src = element.src;
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
    e.style.left = percant(element.x, original.width);
    e.style.top = percant(element.y, original.height);

    if (element.stroke.width && element.type !== 'vector') {
      let stroke_ratio = original.width / element.stroke.width;
      e.style.borderWidth = ratio(stroke_ratio, rootWidth);
      e.style.borderColor = element.stroke.color || 'none';
      e.style.borderStyle = 'solid';
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
