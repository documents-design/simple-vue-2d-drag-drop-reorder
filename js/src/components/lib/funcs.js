import {ElementType} from "./types";

export const hasDragitem = (c) => {
  return c.draggedItem !== null;
};

export const move = (c, e) => {
  if (!hasDragitem(c)) { return; }
  c.pos.l = e.clientX;
  c.pos.t = e.clientY;
  tryToMovePlaceholder(c);
};

export const drop = (c) => {
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

export const performSwap = (c, dragged, target) => {
  removeDragHolder(c);
  const realTarget = target > dragged ? target - 1 : target;
  const tmp = c.copiedItems[dragged];
  c.copiedItems[dragged] = c.copiedItems[realTarget];
  c.copiedItems[realTarget] = tmp;
  c.$emit('update', c.copiedItems
      .map(({ uuid, contents }) => ({ uuid, ...contents })));
};

export const insertPlaceholderAt = (c, index) => {
  c.copiedItems.splice(index, 0, {
    uuid: c.copiedItems[index].uuid,
    contents: {},
    type: ElementType.Shadow,
  });
};

const findDraggableItem = (el) => {
  if (el.classList.contains('grid-item')) { return el; }
  if (el.parentElement !== null) { return findDraggableItem(el.parentElement); }
  return el;
};

export const dragStart = (c, index, event) => {
  if (hasDragitem(c)) { return; }
  insertPlaceholderAt(c, index);
  c.draggedItem = index;
  const el = event.target;
  const { width, height } = findDraggableItem(el).getBoundingClientRect();
  c.pos.l = event.clientX;
  c.pos.t = event.clientY;
  c.pos.w = width;
  c.pos.h = height;
};

export const removeDragHolder = (c) => {
  c.copiedItems.splice(c.draggedItem, 1);
  c.draggedItem = null;
};



export const cleanup = (c) => {
  (c.draggedItem = null),
      (c.targetItem = null),
      c.$set(c, 'pos', {
        l: 0,
        t: 0,
        w: 0,
        h: 0,
      });
};

export const isDragged = (c, index) => {
  return c.draggedItem === index - 1;
};

export const isTarget = (c, index) => {
  return c.targetItem === index;
};

export const tryToMovePlaceholder = (c) => {
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

/* Serialize / deserialize */
const serde = a => JSON.parse(JSON.stringify(a));

export const copyItems = (c) => {
  c.copiedItems = (c.$props.cloneFunction || serde)(c.$props.items)
      .map(({ uuid, ...rest }) =>
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
  copyItems,
};
