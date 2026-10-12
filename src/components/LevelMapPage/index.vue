<template>
  <AppLayout>
    <template #main>
      <article class="main">
        <p class="progress-note">{{ $gameText('Clear status is saved in this browser.') }}</p>
        <div class="container">
          <div class="groups">
            <router-link class="levelLink" :to="`/lab`">{{ $gameText('VIRTUAL LAB') }}</router-link>
          </div>
          <div v-for="(group, i) in groups" :key="'group' + i" class="groups">
            <router-link
              v-for="(level, j) in group"
              :key="'level' + j"
              class="levelLink"
              :class="{ completed: completedLevels.includes(level.id) }"
              :to="`/level/${level.id}`"
            >
              {{ level.id }} - {{ $gameText(level.name) }}
              <span v-if="completedLevels.includes(level.id)" class="completed-badge">
                ✓ {{ $gameText('Completed') }}
              </span>
            </router-link>
          </div>
        </div>
      </article>
    </template>
  </AppLayout>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import AppLayout from '@/components/AppLayout.vue'
import { levels } from '@/assets/data/levels/index'
import { defineComponent } from 'vue'
import { storeNamespace } from '@/store'

export default defineComponent({
  components: {
    AppLayout,
  },
  setup() {
    return {
      groups: groupBy(levels, (level) => level.group),
      completedLevels: storeNamespace('game').useState('completedLevels'),
    }
  },
})
</script>

<style lang="scss" scoped>
.main {
  .progress-note {
    font-size: 0.9rem;
    line-height: 1.6;
  }
  .container {
    column-count: 1;
    padding: 5em;
    @media screen and (max-width: 800px) {
      column-count: 1;
      padding: 0;
    }
  }
  text-align: center;
  .groups {
    display: block;
    padding: 20px;
    border-bottom: 1px solid white;
    flex-direction: column;
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: uppercase;
    @media screen and (max-width: 800px) {
      margin: 20px 30px 0px 30px;
    }
  }
  .levelLink {
    display: block;
    font-weight: 900;
    margin: 5px;
  }
  .completed {
    color: #b6f2cb;
  }
  .completed-badge {
    display: inline-block;
    margin-left: 8px;
    padding: 2px 8px;
    border: 1px solid currentColor;
    border-radius: 4px;
    font-size: 0.75em;
  }
}
</style>
