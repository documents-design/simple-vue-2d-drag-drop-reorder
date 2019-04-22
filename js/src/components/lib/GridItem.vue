<template>
    <div
            :class="[
      'grid-item',
      type === types.Shadow ? 'shadow' : 'element',
      dragged ? 'dragged' : '',
      target ? 'target' : '',
    ]"
            :style="style"
            :data-index="index"
    >
        <div style="position:relative; z-index: 1">
            <slot></slot>
        </div>
        <div class="drag-overlay" @mousedown="$emit('mousedown', $event)"></div>
    </div>
</template>

<script>
    import {ElementType} from './types';

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
            zi: Number,
        },
        computed: {
            style() {
                if (!this.dragged) {
                    return {
                        position: 'relative',
                        zIndex: this.zi,
                    };
                }
                return {
                    position: 'fixed',
                    left: `${this.pos.l}px`,
                    top: `${this.pos.t}px`,
                    width: `${this.pos.w}px`,
                    height: `${this.pos.h}px`,
                };
            },
        },
    };
</script>
