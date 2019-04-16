export enum ElementType {
  Element,
  Shadow,
}

export interface ElementInterface {
  uuid: number;
  type: ElementType;
  contents: any;
}

export interface DragGridPositionInterface {
  l: number;
  t: number;
  w: number;
  h: number;
  gl: number;
  gt: number;
}

export interface DragGridDataInterface {
  pos: DragGridPositionInterface;
  copiedItems: ElementInterface[];
  draggedItem: number | null;
  targetItem: number | null;
}
