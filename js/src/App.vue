<template>
  <div id="app">
    <aside class="data-pane"></aside>
    <main>
      <p style="text-align: center;">Lyrics by Vulfpeck</p>
      <div class="grid-4">
        <pre>&lt;drag-grid
    :items="items"
    @update="updateItems"
    &gt;&lt;/drag-grid&gt;</pre>
        <drag-grid
          :items="items"
          @update="updateItems"
        >
          <template v-slot="{ item }">
            <item-renderer :item="item"/>
          </template>
        </drag-grid>
      </div>
    </main>
  </div>
</template>

<script>
import DragGrid from './components/lib/DragGrid.vue';
import ItemRenderer from './components/user/ItemRenderer.vue';

let id = 1;

const lyrics = [
  /* Vulfpeck's albums are great */
  `Anytime, you think about love`,
  `The feeling's that's, she's thinking about you, about you, about you`,
  `Anytime, you see her in the street`,
  `Trust us that, she's gotta see you, after you're through`,
  `Oh whoa`,
  `Oh I got to believe it baby`,
  `That you're thinking about me maybe`,
  `I don't know what you're thinking about any other day`,
  `When you keep on running away`,
  `Running away`,
  `Running away`,
  `Running away`,
  `I try not to expect much anymore`,
  `It's over now, but what was it all for`,
  `Was it, all for, hey yeah`,
  `I always cared about you baby`,
  `The feelings they, grew too long, to say`,
  `It's gone`,
  `It's gone`,
];

import Vue from 'vue';
export default Vue.extend({
  components: {
    DragGrid,
    ItemRenderer,
  },
  data() {
    return {
      items: lyrics.map((val) => ({ uuid: 'uuid-' + id++, text: val })),
    };
  },
  methods: {
    updateItems(items) {
      this.items = items;
    },
  },
});
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

#app {
  background: #ddd;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

main {
  flex: 1;
  overflow-y: scroll;
}

/* Userland styles
.drag-grid {}
.drag-grid *[draggable]:hover {}
.grid-item {}
.grid-item.dragged {
  transform: translate(-50%, -50%);
}
.grid-item.shadow {}
.grid-item.target {}
.grid-item.element {}
*/

/* Samples */
.grid-4 {
  width: 100%;
  pre {
    width: 860px;
    margin: 2em auto;
  }
  * {
    box-sizing: border-box;
  }
  .drag-grid {
    display: flex;
    flex-wrap: wrap;
    width: 860px;
    margin: auto;
    position: relative;
    .drag-overlay {
      opacity: 0;
      cursor: pointer;
      transition: opacity .2s;
      background: rgba(121, 170, 255, 0.8);
      position: absolute;
      &::after {
        content: "Cliquez pour déplacer";
      }
      color: black;
      top: 0;
      height: 100%;
      left: 0;
      z-index: 2;
      width: 100%;
      padding: 2em;
      font-size: 11px;
    }
    .grid-item {
      &:hover {
        .drag-overlay {
          opacity: 1;
        }
      }
      position: relative;
      flex: 0 0 calc(33% - 16px);
      background: whitesmoke;
      padding: 1.5em;
      &.dragged {
        transform: translate(-50%, -50%);
        z-index: 99;
      }
      &.shadow {
        background: lightgray;
        box-shadow: 0 0 10px black;
        .drag-overlay {
          display: none;
        }
      }
      margin: 8px;
    }
  }
}
</style>
