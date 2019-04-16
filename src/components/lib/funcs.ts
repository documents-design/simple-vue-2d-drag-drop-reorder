import { ElementType } from './types';
import DragGrid from './DragGrid.vue';

export const hasDragitem = (c: DragGrid): boolean => {
  return c.$data.draggedItem !== null;
};

export const move = (c: DragGrid, e: MouseEvent) => {
  if (!hasDragitem(c)) { return; }
  c.$data.pos.l = e.pageX - c.$data.pos.gl;
  c.$data.pos.t = e.pageY - c.$data.pos.gt;
  tryToMovePlaceholder(c);
};

export const drop = (c: DragGrid) => {
  if (!hasDragitem(c)) { return; }
  if (
    c.$data.targetItem !== null &&
    c.$data.draggedItem !== null &&
    c.$data.targetItem !== c.$data.draggedItem
  ) {
    performSwap(c, c.$data.draggedItem, c.$data.targetItem);
  } else {
    removeDragHolder(c);
  }
  cleanup(c);
};

export const performSwap = (c: DragGrid, dragged: number, target: number) => {
  removeDragHolder(c);
  const realTarget = target > dragged ? target - 1 : target;
  const tmp = c.$data.copiedItems[dragged];
  c.$data.copiedItems[dragged] = c.$data.copiedItems[realTarget];
  c.$data.copiedItems[realTarget] = tmp;
  c.$emit('update', c.$data.copiedItems
    .map(({ uuid, contents }: { uuid: any, contents: any }) => ({ uuid, ...contents })));
};

export const insertPlaceholderAt = (c: DragGrid, index: number) => {
  c.$data.copiedItems.splice(index, 0, {
    uuid: c.$data.copiedItems[index].uuid,
    contents: {},
    type: ElementType.Shadow,
  });
};

export const dragStart = (c: DragGrid, index: number, event: MouseEvent) => {
  if (hasDragitem(c)) { return; }
  insertPlaceholderAt(c, index);
  c.$data.draggedItem = index;
  const el = event.target as HTMLElement;
  const { width, height } = el.getBoundingClientRect();
  c.$data.pos.l = el.offsetLeft;
  c.$data.pos.t = el.offsetTop;
  c.$data.pos.w = width;
  c.$data.pos.h = height;
};

export const removeDragHolder = (c: DragGrid) => {
  c.$data.copiedItems.splice(c.$data.draggedItem as number, 1);
  c.$data.draggedItem = null;
};

export const tryToMovePlaceholder = (c: DragGrid) => {
  const el = document
    .elementsFromPoint(c.$data.pos.l + c.$data.pos.gl, c.$data.pos.t + c.$data.pos.gt)
    .find(
      (e) =>
        e.classList.contains('grid-item') && !e.classList.contains('dragged'),
    );
  if (el) {
    const candidate = el.getAttribute('data-index');
    if (candidate !== null) {
      const index = parseInt(candidate, 10);
      c.$data.targetItem = index;
    }
  }
};

export const cleanup = (c: DragGrid) => {
  (c.$data.draggedItem = null),
    (c.$data.targetItem = null),
    c.$set(c, 'pos', {
      l: 0,
      t: 0,
      w: 0,
      h: 0,
      gl: c.$data.pos.gl,
      gt: c.$data.pos.gt,
    });
};

export const isDragged = (c: DragGrid, index: number) => {
  return c.$data.draggedItem === index - 1;
};

export const isTarget = (c: DragGrid, index: number) => {
  return c.$data.targetItem === index;
};

export const sizeGrid = (c: DragGrid) => {
  const { top, left } = (c.$refs.grid as Element).getBoundingClientRect();
  c.$data.pos.gt = top;
  c.$data.pos.gl = left;
};

export const copyItems = (c: DragGrid) => {
  c.$data.copiedItems = c.$props.cloneFunction(c.$props.items)
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
