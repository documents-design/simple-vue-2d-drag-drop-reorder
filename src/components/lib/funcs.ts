import { DragGridInterface, ElementType } from './types';

export const hasDragitem = (c: DragGridInterface): boolean => {
  return c.draggedItem !== null;
};

export const move = (c: DragGridInterface, e: MouseEvent) => {
  if (!hasDragitem(c)) { return; }
  c.pos.l = e.clientX;
  c.pos.t = e.clientY;
  tryToMovePlaceholder(c);
};

export const drop = (c: DragGridInterface) => {
  if (!hasDragitem(c)) { return; }
  if (
      c.targetItem !== null &&
      c.draggedItem !== null &&
      c.targetItem !== c.draggedItem
  ) {
    c.$emit('swap', [c.draggedItem, c.targetItem]);
    performSwap(c, c.draggedItem, c.targetItem);
  } else {
    removeDragHolder(c);
  }
  cleanup(c);
};

export const performSwap = (c: DragGridInterface, dragged: number, target: number) => {
  removeDragHolder(c);
  const realTarget = target > dragged ? target - 1 : target;
  const tmp = c.copiedItems[dragged];
  c.copiedItems[dragged] = c.copiedItems[realTarget];
  c.copiedItems[realTarget] = tmp;
  c.$emit('update', c.copiedItems
      .map(({ contents }: { contents: any }) => contents));
};

export const insertPlaceholderAt = (c: DragGridInterface, index: number) => {
  c.copiedItems.splice(index, 0, {
    _dguuid: c.copiedItems[index]._dguuid,
    contents: {},
    type: ElementType.Shadow,
  });
};

const findDraggableItem = (el: HTMLElement): HTMLElement => {
  if (el.classList.contains('grid-item')) { return el; }
  if (el.parentElement !== null) { return findDraggableItem(el.parentElement); }
  return el;
};

export const dragStart = (c: DragGridInterface, index: number, event: MouseEvent) => {
  if (hasDragitem(c)) { return; }
  insertPlaceholderAt(c, index);
  c.draggedItem = index;
  const el = event.target as HTMLElement;
  const { width, height } = findDraggableItem(el).getBoundingClientRect();
  c.pos.l = event.clientX;
  c.pos.t = event.clientY;
  c.pos.w = width;
  c.pos.h = height;
};

export const removeDragHolder = (c: DragGridInterface) => {
  c.copiedItems.splice(c.draggedItem as number, 1);
  c.draggedItem = null;
};

export const tryToMovePlaceholder = (c: DragGridInterface) => {
  const el = document
      .elementsFromPoint(c.pos.l, c.pos.t)
      .find(
          (e) =>
              e.classList.contains('grid-item') && !e.classList.contains('dragged'),
      );
  if (el) {
    const candidate = el.getAttribute('data-index');
    if (candidate !== null) {
      c.targetItem = parseInt(candidate, 10);
    }
  }
};

export const cleanup = (c: DragGridInterface) => {
  (c.draggedItem = null),
      (c.targetItem = null),
      c.$set(c, 'pos', {
        l: 0,
        t: 0,
        w: 0,
        h: 0,
      });
};

export const isDragged = (c: DragGridInterface, index: number) => {
  return c.draggedItem === index - 1;
};

export const isTarget = (c: DragGridInterface, index: number) => {
  return c.targetItem === index;
};

/* Serialize/Deserialize */
const serde = (a: any): any => JSON.parse(JSON.stringify(a));

export const copyItems = (c: DragGridInterface) => {
  c.copiedItems = (c.$props.cloneFunction || serde)(c.$props.items)
      .map(({ ...rest }, index) =>
          ({ _dguuid: `u-${index}`, type: ElementType.Element, contents: rest }));
};

export default {
  hasDragitem,
  move,
  drop,
  performSwap,
  insertPlaceholderAt,
  dragStart,
  removeDragHolder,
  tryToMovePlaceholder,
  cleanup,
  isDragged,
  isTarget,
  copyItems,
};
