<template>
  <div class="drag-grid" @mousemove="move" @mouseup="drop" ref="grid">
    <grid-item
      :pos="pos"
      :index="index"
      :zi="copiedItems.length - index"
      v-for="(item, index) in copiedItems"
      :key="item.uuid + '-' + item.type"
      :target="isTarget(index)"
      :type="item.type"
      @mousedown="dragStart(index, $event)"
      :dragged="isDragged(index)"
    >
      <slot :item="item.contents" :index="index" :type="item.type"></slot>
    </grid-item>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import GridItem from './GridItem.vue';
import { DragGridInterface, ElementInterface } from './types';
import funcs from './funcs';

@Component({
    components: {
        GridItem,
    },
})
export default class DragGrid extends Vue implements DragGridInterface {
  @Prop({ type: Array, required: true }) public items: ElementInterface[];

  public pos = {
    l: 0,
    t: 0,
    w: 0,
    h: 0,
  };
  public copiedItems = [];
  public draggedItem = null;
  public targetItem = null;

  @Watch('items')
  public onItemsChange() {
      this.copyItems();
  }

  public copyItems() {
    funcs.copyItems(this);
  }

  public move(e: MouseEvent) {
    funcs.move(this, e);
  }

  public dragStart(index: number, event: MouseEvent) {
    funcs.dragStart(this, index, event);
  }
  public drop() {
    funcs.drop(this);
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
}
</script>

<style lang="scss">
.drag-grid {
  position: relative;
  margin: auto;
}

.drag-grid *::selection {
  background: transparent;
}
</style>
