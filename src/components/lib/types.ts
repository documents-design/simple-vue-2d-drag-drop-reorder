import { Vue } from 'vue-property-decorator';

export enum ElementType {
  Element,
  Shadow,
}

export interface UuidableInterface {
  _dguuid: string;
}

export interface ElementInterface extends UuidableInterface {
  type: ElementType;
  contents: any;
}

export interface DragGridPositionInterface {
  l: number;
  t: number;
  w: number;
  h: number;
}

export interface DragGridInterface extends Vue {
  pos: DragGridPositionInterface;
  copiedItems: ElementInterface[];
  draggedItem: number | null;
  targetItem: number | null;
  items: ElementInterface[];
  cloneFunction: <T>(a: T) => T;
}
