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

<script>
  import GridItem from './GridItem.vue';
  import f from './funcs';

  export default {
    components: {
      GridItem,
    },
    data() {
      return {
        pos: {
          l: 0,
          t: 0,
          w: 0,
          h: 0,
        },
        copiedItems: [],
        draggedItem: null,
        targetItem: null,
      };
    },
    props: {
      items: Array,
      cloneFunction: Function,
    },
    methods: {
      copyItems() {
        f.copyItems(this);
      },
      move(e) {
        f.move(this, e);
      },
      dragStart(index, event) {
        f.dragStart(this, index, event);
      },
      drop() {
        f.drop(this);
      },
      isDragged(index) {
        return f.isDragged(this, index);
      },
      isTarget(index) {
        return f.isTarget(this, index);
      },
    },
    watch: {
      items() {
        this.copyItems();
      }
    },
    created() {
      this.copyItems();
    }
  }
</script>

<style>
  .drag-grid {
    margin: auto;
  }

  .drag-grid .grid-item.dragged {
    /* z-index: 9999; */
  }

  .drag-grid *[draggable] {
    cursor: pointer;
    box-sizing: border-box;
  }

  .drag-grid *::selection {
    background: transparent;
  }
</style>
