<template>
  <div>{{ item.text }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

interface TextItemInterface {
  text: string;
}

@Component({
  props: {
    item: Object,
  },
})
export default class ItemRenderer extends Vue {}
</script>