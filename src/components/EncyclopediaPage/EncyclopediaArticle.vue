<template>
  <div v-if="entry" layout="column u4">
    <!-- TITLE -->
    <h1 class="title">{{ entry.title }}</h1>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <h2 class="short" v-html="entry.short" />
    <!-- GRIDS -->
    <div class="grids">
      <div layout="row wrap start u5">
        <EncyclopediaBoard
          v-for="(iGrid, i) in entry.grids"
          :key="i"
          :grid="iGrid"
          :maxSteps="24"
        />
      </div>
    </div>

    <p>
      {{ $gameText('Only the game model is shown here; real equipment may behave differently.') }}
    </p>

    <!-- SECTIONS -->
    <EncyclopediaArticleSection
      v-for="section in entry.sections"
      :key="section.title"
      :section="section"
    />

    <!-- EQUATION GRID -->
    <EncyclopediaTransition
      v-if="showMatrix"
      :key="`transition-${entry.elementName}`"
      :elementName="entry.elementName"
      :defaultRotation="entry.defaultRotation"
      step="3"
    />
  </div>
</template>

<script lang="ts">
import { conceptNameList, elementNameList, getEntry, hasEntry } from './loadData'
import EncyclopediaArticleSection from '@/components/EncyclopediaPage/EncyclopediaArticleSection.vue'
import EncyclopediaBoard from '@/components/EncyclopediaPage/EncyclopediaBoard.vue'
import EncyclopediaTransition from '@/components/EncyclopediaPage/EncyclopediaTransition.vue'
import { useRoute, useRouter } from 'vue-router'
import { Elem, importElem } from '@/engine/model'
import { computed, defineComponent, watchEffect } from 'vue'

export default defineComponent({
  components: {
    EncyclopediaArticleSection,
    EncyclopediaBoard,
    EncyclopediaTransition,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const entryURL = computed(() => {
      return route.params.entry as string
    })

    const entry = computed(() => {
      if (entryURL.value && hasEntry(entryURL.value)) {
        const entry = getEntry(entryURL.value)
        return entry
      }
      return null
    })

    watchEffect(() => {
      // Leaving the article clears the entry parameter before this component unmounts.
      // Only redirect when the destination actually specifies an unknown article.
      if (entryURL.value && !entry.value?.title) {
        router.push({ name: '404' })
      }
    })

    const showMatrix = computed(() => {
      const elem = entry.value?.elementName ? importElem(entry.value.elementName) : null
      const dontShowMatrix = [Elem.Laser]
      return elem != null && dontShowMatrix.indexOf(elem) < 0
    })

    return {
      elementNameList,
      conceptNameList,
      entry,
      showMatrix,
    }
  },
})
</script>

<style lang="scss" scoped>
.title {
  text-transform: uppercase;
  font-size: 2em;
}

.short {
  font-size: 1rem;
  padding-bottom: 20px;
  font-weight: 300;
  line-height: 1.5rem;
  letter-spacing: 0.5px;
}
</style>
