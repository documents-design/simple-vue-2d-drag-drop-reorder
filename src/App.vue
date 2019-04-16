<template>
  <div id="app">
    <aside class="data-pane"></aside>
    <main>
      <p style="text-align: center;">Lyrics by Vulfpeck</p>
      <div class="grid-4">
        <pre>&lt;drag-grid
    :items="items"
    @update="updateItems"
    :clone-function="a => JSON.parse(JSON.stringify(a))"
    :renderer="$options.components.ItemRenderer"
    &gt;&lt;/drag-grid&gt;</pre>
        <drag-grid
          :items="items"
          @update="updateItems"
          :clone-function="a => JSON.parse(JSON.stringify(a))"
          :renderer="$options.components.ItemRenderer"
        ></drag-grid>
      </div>
      <div class="grid-8">
        <drag-grid
          :items="items"
          @update="updateItems"
          :clone-function="a => JSON.parse(JSON.stringify(a))"
          :renderer="$options.components.ItemRenderer"
        ></drag-grid>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import DragGrid from './components/lib/DragGrid.vue';
import ItemRenderer from './components/user/ItemRenderer.vue';

let id: number = 1;

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

interface LyricInterface {
  uuid: number;
  text: string;
}

import Vue from 'vue';
export default Vue.extend({
  components: {
    DragGrid,
    ItemRenderer,
  },
  data() {
    return {
      items: lyrics.map((val) => ({ uuid: ++id, text: val })),
    };
  },
  methods: {
    updateItems(items: LyricInterface[]) {
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
  .drag-grid {
    width: 860px;
    display: flex;
    flex-wrap: wrap;
    font-size: 9px;
    font-family: monospace;
  }
  .drag-grid *[draggable]:hover {
    box-shadow: 2px 2px 0px 0px blue;
  }

  .grid-item {
    padding: 1em;
    flex: 0 0 calc(25% - 1em);
    background: lightblue;
    margin: 0.5em;
  }

  .grid-item.dragged {
    transform: scale(1.1) translate(-50%, -50%);
  }

  .grid-item.shadow {
    background: slategray;
  }

  .grid-item.target {
    box-shadow: 0 0 0 red;
  }
}

.grid-8 {
  width: 100%;

  .drag-grid {
    display: flex;
    flex-wrap: wrap;
    width: 960px;
    margin: 2em auto;
  }

  .grid-item {
    flex: 0 0 calc(12.5% - 32px);
    padding: 8px;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
    font-size: 11px;
    background: whitesmoke;
    margin: 16px;
  }

  .grid-item.dragged {
    transform: translate(-50%, -50%);
  }

  .grid-item.shadow {
    background: darkslateblue;
  }
}
</style>
