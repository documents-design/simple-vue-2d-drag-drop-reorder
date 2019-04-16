export enum ElementType {
  Element,
  Shadow,
}

export interface ElementInterface {
  uuid: number;
  type: ElementType;
  contents: any;
}
