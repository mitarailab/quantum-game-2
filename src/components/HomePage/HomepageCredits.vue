<template>
  <section class="credits" aria-labelledby="credits-title">
    <h2 id="credits-title">日本語版と原作者について</h2>
    <p>
      このページは
      <a href="https://github.com/Quantum-Game/quantum-game-2" target="_blank" rel="noopener">
        Quantum Game 2
      </a>
      の日本語化版です。 原作者による公式の日本語版ではありません。
    </p>
    <p>
      原作者は Piotr Migdał、Klem Jankiewicz ほか、Quantum Flytrap の開発チームです。
      原作者・協力者の詳しいクレジットは、以下の原文をご覧ください。
    </p>
    <p>
      ゲーム本体のソースコードは
      <a :href="`${publicPath}LICENSE.txt`" target="_blank" rel="noopener">MITライセンス</a>
      です。Copyright (c) 2019 Piotr Migdał。
      使用するライブラリ・フォント等には、それぞれのライセンスが適用されます。
      <a :href="`${publicPath}THIRD_PARTY_NOTICES.txt`" target="_blank" rel="noopener"
        >第三者素材・ライブラリの表記</a
      >もご覧ください。
      <a :href="`${publicPath}THIRD_PARTY_LICENSES.txt`" target="_blank" rel="noopener"
        >配布ライブラリのライセンス全文</a
      >も掲載しています。
    </p>

    <div class="original-credits">
      <h3>元ゲームのトップページから（原文）</h3>
      <p class="source-note">
        以下の英文は、元ゲームのトップページに掲載されていたクレジットや支援機関等の説明を、
        そのまま掲載したものです（ロゴ画像を除く）。内容は元ゲームの開発当時の情報です。
      </p>
      <HomepageAuthors />
      <HomepageHistory />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HomepageAuthors from './HomepageAuthors.vue'
import HomepageHistory from './HomepageHistory.vue'

export default defineComponent({
  components: { HomepageAuthors, HomepageHistory },
  setup() {
    return { publicPath: process.env.BASE_URL || '/' }
  },
})
</script>

<style lang="scss" scoped>
.credits {
  width: calc(100% - 40px);
  max-width: 760px;
  margin: 24px auto;
  padding: 28px;
  text-align: left;
  line-height: 1.8;
  background: rgba(33, 2, 53, 0.45);
  border-radius: 8px;
}

h2,
h3 {
  margin: 0 0 16px;
  line-height: 1.5;
}

h2 {
  font-size: 1.3rem;
}

h3 {
  font-size: 1.1rem;
}

p {
  margin: 0 0 16px;
}

a {
  color: #eab5ff;
  text-decoration: underline;
}

.original-credits {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
}

.source-note {
  font-size: 0.95rem;
}

@media screen and (max-width: 560px) {
  .credits {
    padding: 20px;
  }
}
</style>
