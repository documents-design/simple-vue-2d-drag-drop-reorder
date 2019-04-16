<template>
  <div class="drag-grid" @mousemove="move" @mouseup="drop" ref="grid">
    <grid-item
      :pos="pos"
      :index="index"
      v-for="(item, index) in copiedItems"
      :key="item.uuid + '-' + item.type"
      :target="isTarget(index)"
      :type="item.type"
      @mousedown="dragStart(index, $event)"
      :dragged="isDragged(index)"
    >
      <component :is="renderer" :item="item.contents"></component>
    </grid-item>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import GridItem from './GridItem.vue';
import { ElementType, ElementInterface } from './types';

const DragProps = Vue.extend({
  props: {
    items: Array,
    cloneFunction: Function,
    renderer: Function,
  },
  watch: {
    items() {
      this.copyItems();
    },
  },
  components: {
    GridItem,
  },
});
@Component
export default class DragGrid extends DragProps {

  get hasDragitem(): boolean {
    return this.draggedItem !== null;
  }
  public pos = {
    l: 0,
    t: 0,
    w: 0,
    h: 0,
    gl: 0,
    gt: 0,
  };
  private copiedItems: ElementInterface[] = [];
  private draggedItem: number? = null;
  private targetItem: number? = null;

  public move(e) {
    if (!this.hasDragitem) { return; }
    this.pos.l = e.pageX - this.pos.gl;
    this.pos.t = e.pageY - this.pos.gt;
    this.tryToMovePlaceholder();
  }

  public drop() {
    if (!this.hasDragitem) { return; }
    if (
      this.targetItem !== null &&
      this.draggedItem !== null &&
      this.targetItem !== this.draggedItem
    ) {
      this.performSwap(this.draggedItem, this.targetItem);
    } else {
      this.removeDragHolder();
    }
    this.cleanup();
  }

  public performSwap(dragged: number, target: number) {
    this.removeDragHolder();
    const realTarget = target > dragged ? target - 1 : target;
    const tmp = this.copiedItems[dragged];
    this.copiedItems[dragged] = this.copiedItems[realTarget];
    this.copiedItems[realTarget] = tmp;
    this.$emit('update', this.copiedItems.map(({uuid, contents}) => ({uuid, ...contents})));
  }

  public insertPlaceholderAt(index: number) {
    this.copiedItems.splice(index, 0, {
      uuid: this.copiedItems[index].uuid,
      contents: {},
      type: ElementType.Shadow,
    });
  }

  public dragStart(index: number, event: MouseEvent) {
    if (this.hasDragitem) { return; }
    this.insertPlaceholderAt(index);
    this.draggedItem = index;
    const el = event.target as HTMLElement;
    const { width, height } = el.getBoundingClientRect();
    this.pos.l = el.offsetLeft;
    this.pos.t = el.offsetTop;
    this.pos.w = width;
    this.pos.h = height;
  }

  public removeDragHolder() {
    this.copiedItems.splice(this.draggedItem as number, 1);
    this.draggedItem = null;
  }

  public tryToMovePlaceholder() {
    const el = document
      .elementsFromPoint(this.pos.l + this.pos.gl, this.pos.t + this.pos.gt)
      .find(
        (e) =>
          e.classList.contains('grid-item') && !e.classList.contains('dragged'),
      );
    if (el) {
      const candidate = el.getAttribute('data-index');
      if (candidate !== null) {
        const index = parseInt(candidate, 10);
        this.targetItem = index;
      }
    }
  }

  public cleanup() {
    (this.draggedItem = null),
      (this.targetItem = null),
      this.$set(this, 'pos', {
        l: 0,
        t: 0,
        w: 0,
        h: 0,
        gl: this.pos.gl,
        gt: this.pos.gt,
      });
  }

  public isDragged(index: number) {
    return this.draggedItem === index - 1;
  }

  public isTarget(index: number) {
    return this.targetItem === index;
  }

  public sizeGrid() {
    const { top, left } = (this.$refs.grid as Element).getBoundingClientRect();
    this.pos.gt = top;
    this.pos.gl = left;
  }

  public copyItems() {
    this.copiedItems = this.cloneFunction(this.items)
      .map(({uuid, ...rest}) => ({uuid, type: ElementType.Element, contents: rest }) );
  }

  public created() {
    this.copyItems();
  }

  public mounted() {
    this.sizeGrid();
    window.addEventListener('resize', this.sizeGrid);
  }

  public beforeDestroy() {
    window.removeEventListener('resize', this.sizeGrid);
  }
}
</script>

<style lang="scss">
.drag-grid {
  position: relative;
  margin: auto;
}

.drag-grid *[draggable] {
  cursor: pointer;
  box-sizing: border-box;
}

.drag-grid *::selection {
  background: transparent;
}
</style>
