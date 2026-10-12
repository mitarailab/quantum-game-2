<template>
  <div class="interactive">
    <EncyclopediaBoard :grid="boardMZ" :maxSteps="24" class="grid" />
  </div>
  <p>
    部品の向きを変えて、光の経路と検出確率を確かめましょう。
    <router-link to="/info">部品とシミュレーターを見る</router-link>
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue'
import { getEntry } from '@/components/EncyclopediaPage/loadData'

export default defineComponent({
  components: {
    EncyclopediaBoard,
  },
  setup() {
    const boardMZ = getEntry('mach-zehnder-interferometer').grids[0]
    return { boardMZ }
  },
})
</script>

<style lang="scss" scoped>
.interactive {
  background: #2e006a;
  padding: 30px;
}
</style>
