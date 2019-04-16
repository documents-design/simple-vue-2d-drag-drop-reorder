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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ElementType } from './types';

import { DragGridPositionInterface } from './DragGrid.vue';

const GridItemProps = Vue.extend({
  props: {
    type: Number,
    dragged: Boolean,
    target: Boolean,
    index: Number,
    pos: Object,
  },
});
@Component
export default class GridItem extends GridItemProps {
  public types = ElementType;

  get style(): any {
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
</script>