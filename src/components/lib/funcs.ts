import { DragGridInterface, ElementType } from './types';

export const hasDragitem = (c: DragGridInterface): boolean => {
  return c.draggedItem !== null;
};

export const move = (c: DragGridInterface, e: MouseEvent) => {
  if (!hasDragitem(c)) { return; }
  c.pos.l = e.pageX - c.pos.gl;
  c.pos.t = e.pageY - c.pos.gt;
  tryToMovePlaceholder(c);
};

export const drop = (c: DragGridInterface) => {
  if (!hasDragitem(c)) { return; }
  if (
    c.targetItem !== null &&
    c.draggedItem !== null &&
    c.targetItem !== c.draggedItem
  ) {
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
    .map(({ uuid, contents }: { uuid: any, contents: any }) => ({ uuid, ...contents })));
};

export const insertPlaceholderAt = (c: DragGridInterface, index: number) => {
  c.copiedItems.splice(index, 0, {
    uuid: c.copiedItems[index].uuid,
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
  c.pos.l = el.offsetLeft;
  c.pos.t = el.offsetTop;
  c.pos.w = width;
  c.pos.h = height;
};

export const removeDragHolder = (c: DragGridInterface) => {
  c.copiedItems.splice(c.draggedItem as number, 1);
  c.draggedItem = null;
};

export const tryToMovePlaceholder = (c: DragGridInterface) => {
  const el = document
    .elementsFromPoint(c.pos.l + c.pos.gl, c.pos.t + c.pos.gt)
    .find(
      (e) =>
        e.classList.contains('grid-item') && !e.classList.contains('dragged'),
    );
  if (el) {
    const candidate = el.getAttribute('data-index');
    if (candidate !== null) {
      const index = parseInt(candidate, 10);
      c.targetItem = index;
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
      gl: c.pos.gl,
      gt: c.pos.gt,
    });
};

export const isDragged = (c: DragGridInterface, index: number) => {
  return c.draggedItem === index - 1;
};

export const isTarget = (c: DragGridInterface, index: number) => {
  return c.targetItem === index;
};

export const sizeGrid = (c: DragGridInterface) => {
  const { top, left } = (c.$refs.grid as Element).getBoundingClientRect();
  c.pos.gt = top;
  c.pos.gl = left;
};

export const copyItems = (c: DragGridInterface) => {
  c.copiedItems = JSON.parse(JSON.stringify(c.$props.items))
    .map(({ uuid, ...rest }: { uuid: any, contents: any }) =>
      ({ uuid, type: ElementType.Element, contents: rest }));
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
  sizeGrid,
  copyItems,
};
