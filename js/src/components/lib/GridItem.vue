<template>
  <div
    :class="[
      'grid-item',
      type === types.Shadow ? 'shadow' : 'element',
      dragged ? 'dragged' : '',
      target ? 'target' : '',
    ]"
    @mousedown="$emit('mousedown', $event)"
    :style="style"
    draggable="true"
    :data-index="index"
  >
  <slot></slot>
  </div>
</template>

<script>
import { ElementType } from './types';

export default {
  name: 'GridItem',
  data() {
    return {
      types: ElementType,
    };
  },
  props: {
    type: Number,
    dragged: Boolean,
    target: Boolean,
    index: Number,
    pos: Object,
  },
  computed: {
    style() {
      if (!this.dragged) { return {}; }
      return {
        position: 'absolute',
        left: this.pos.l + 'px',
        top: this.pos.t + 'px',
        width: this.pos.w + 'px',
        height: this.pos.h + 'px',
      };
    }
  }
}
</script>
