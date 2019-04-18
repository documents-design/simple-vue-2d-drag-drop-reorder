<template>
  <div>{{ item.text }}</div>
</template>

<script lang="ts">
export default {
  name: 'ItemRenderer',
  props: {
    item: Object
  }
}
</script>
