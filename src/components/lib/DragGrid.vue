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
import { ElementType, ElementInterface, DragGridDataInterface, DragGridPositionInterface } from './types';
import funcs from './funcs';


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
  data(): DragGridDataInterface {
    return {
      pos: {
        l: 0,
        t: 0,
        w: 0,
        h: 0,
        gl: 0,
        gt: 0,
      },
      copiedItems: [],
      draggedItem: null,
      targetItem: null,
    };
  },
  components: {
    GridItem,
  },
  methods: {
    copyItems() {
      funcs.copyItems(this as DragGrid);
    },
  },
});
@Component
export default class DragGrid extends DragProps {
  get hasDragitem() {
    return funcs.hasDragitem(this);
  }

  public move(e: MouseEvent) {
    funcs.move(this, e);
  }
  public cleanup() {
    funcs.cleanup(this);
  }
  public dragStart(index: number, event: MouseEvent) {
    funcs.dragStart(this, index, event);
  }
  public drop() {
    funcs.drop(this);
  }
  public insertPlaceholderAt(index: number) {
    funcs.insertPlaceholderAt(this, index);
  }
  public performSwap(dragged: number, target: number) {
    funcs.performSwap(this, dragged, target);
  }
  public removeDragHolder() {
    funcs.removeDragHolder(this);
  }
  public sizeGrid() {
    funcs.sizeGrid(this);
  }
  public tryToMovePlaceholder() {
    funcs.tryToMovePlaceholder(this);
  }

  public isDragged(index: number) {
    return funcs.isDragged(this, index);
  }
  public isTarget(index: number) {
    return funcs.isTarget(this, index);
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
