<template>
  <div class="home-page-wrapper" layout="column center">
    <div class="row-full">
      <img src="@/assets/graphics/QG_logo.svg" alt="QuantumGame" />
    </div>
    <div layout="row wrap middle u5">
      <router-link to="/level/1">
        <AppButton class="button" type="big">{{ $gameText('PLAY GAME') }}</AppButton>
      </router-link>
      <router-link to="/lab">
        <AppButton class="button" type="big">{{ $gameText('VIRTUAL LAB') }}</AppButton>
      </router-link>
    </div>
    <div class="hello" layout="column u10">
      <h1>{{ i18n.t('homepage.main') }}</h1>
      <p class="main-description">{{ i18n.t('homepage.desc') }}</p>
      <HomepageInteractive />
    </div>
    <div class="gameVersion">
      <p>
        日本語版 {{ version }}（開発中）／
        <template v-if="commitHash">
          <a
            :href="`https://github.com/mitarailab/quantum-game-2/commit/${commitHash}`"
            target="_blank"
            >{{ commitDate }}</a
          >
          の更新。
        </template>
        <template v-else>{{ commitDate }}時点。</template>
        <br />
        PCのブラウザでの操作を推奨します。
      </p>
    </div>
    <HomepageCredits />
    <svg viewBox="0 0 64 64" width="200" height="200">
      <AppCell :piece="piece" class="rock" />
    </svg>
  </div>
</template>

<script lang="ts">
import AppButton from '@/components/AppButton.vue'
import HomepageCredits from '@/components/HomePage/HomepageCredits.vue'
import HomepageInteractive from '@/components/HomePage/HomepageInteractive.vue'
import AppCell from '@/components/Board/AppCell.vue'
import { Elem, defaultPiece } from '@/engine/model'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    AppButton,
    HomepageCredits,
    HomepageInteractive,
    AppCell,
  },
  setup() {
    return {
      i18n: useI18n(),
      version: process.env.VUE_APP_VERSION || 'unknown',
      commitHash: process.env.VUE_APP_GIT_HASH,
      commitDate: new Date(+(process.env.VUE_APP_GIT_DATE || 0) * 1000).toUTCString(),
      piece: defaultPiece(Elem.Rock),
    }
  },
})
</script>

<style lang="scss" scoped>
.home-page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(#5c00d3, #f05, #5c00d3, #210235);
  width: 100%;
  & a {
    & img {
      max-width: 250px;
    }
  }
}
.gameVersion {
  font-size: 0.8rem;
  margin: 20px 10px;
  @include media('<large') {
    font-size: 1rem;
    width: 80%;
  }
}
h1 {
  color: white;
  font-size: 1.4rem;
  font-weight: 900;
  line-height: 150%;
  margin-top: 50px;
}
p {
  color: white;
  line-height: 150%;
}
.main-description {
  font-size: 1.4rem;
}
.hello {
  width: 35%;
  display: flex;
  position: center;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 1259px) {
    width: 60%;
  }
  @media screen and (max-width: 560px) {
    width: 80%;
  }
}

.row-full {
  width: 100vw;
  min-width: 1300px;
  position: center;
  height: 100px;
  margin-bottom: 8rem;
  align-items: center;
  @include media('<large') {
    margin-bottom: 6rem;
  }
}

a {
  color: #eab5ff;
  text-decoration: none;
}
a:hover {
  color: white;
}

* {
  transition: all 0.6s;
}

.rock {
  cursor: default !important;
}

::placeholder {
  color: white;
}
</style>
