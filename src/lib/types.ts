export type ElementType = 'text' | 'rect' | 'image' | 'vector';

export interface BaseEditorElement {
  id: number;
  type: ElementType;
  width: number;
  height: number;
  x: number;
  y: number;
  fill: string;
  stroke: StrokeStyle;
  animations: Animation[];
  effects: {
    bg?: Effect;
    style?: Effect;
  };
}

export type EffectBehaviours = 'offset' | 'direction' | 'transparency' | 'intensity' | 'thickness';
export type EffectTypes = 'shadow' | 'lift' | 'hollow' | 'none';

export type Effect = {
  type: EffectTypes;
  offset?: number;
  direction?: number;
  blur?: number;
  transparency?: number;
  intensity?: number;
  thickness?: number;
  color?: string;
};

export interface TextElement extends BaseEditorElement {
  type: 'text';
  text: string;
  edit: boolean;
  font: FontStyle;
}

export type Point = {
  x: number;
  y: number;
};

export interface VectorElement extends BaseEditorElement {
  type: 'vector';
  edit: boolean;
  points: Point[];
}

export interface ShapeElement extends BaseEditorElement {
  type: 'rect';
  borderRadius: number;
}

export interface ImageElement extends BaseEditorElement {
  type: 'image';
  src: string;
  borderRadius: number;
}

export type EditorElement = TextElement | ShapeElement | ImageElement | VectorElement;

export interface FontStyle {
  family: string;
  size: number;
  italic: boolean;
  weight: number;
  align: string;
}

export interface StrokeStyle {
  width: number | null;
  color: string | null;
  style: string | null;
}

export interface Canvas {
  left: number;
  top: number;
  width: number;
  height: number;
  fill: string;
  stroke: StrokeStyle;
  borderRadius?: number;
}
