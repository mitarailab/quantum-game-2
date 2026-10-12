# Quantum Game 2

## Mitarai Lab 日本語版の開発

このフォークは [mitarailab/quantum-game-2](https://github.com/mitarailab/quantum-game-2) で開発します。
研究室HPのリポジトリとは独立して管理し、日本語化と公開準備を `japanese` ブランチで進めます。
上流は [Quantum-Game/quantum-game-2](https://github.com/Quantum-Game/quantum-game-2) の旧版です。

本体のMITライセンスと原著者のクレジットは維持します。百科事典・画像・フォント等には別の条件があります。
[ライセンス調査と公開前の確認事項](docs/license-review.md) および
[第三者素材の表記](THIRD_PARTY_NOTICES.md) を参照してください。素材の確認は未完了です。
公開時は日本語版の運営主体を研究室として明示し、原著者や支援機関がこの版を公認したと誤解される表記を避けます。

サブモジュールも取得する場合:

```bash
git clone --recurse-submodules https://github.com/mitarailab/quantum-game-2.git
cd quantum-game-2
git switch japanese
```

以下は上流の説明・クレジットです。

A puzzle game with photons, superposition and quantum measurement, right in your browser. With true quantum mechanics underneath!

![GitHub package.json version](https://img.shields.io/github/package-json/v/Quantum-Game/quantum-game-2)
![License](https://img.shields.io/github/license/Quantum-Game/quantum-game-2)
[![Build Status](https://travis-ci.com/Quantum-Game/quantum-game-2.svg?branch=master)](https://travis-ci.com/Quantum-Game/quantum-game-2)
[![Twitter @QuantumGameIO](https://img.shields.io/twitter/follow/QuantumGameIO)](https://twitter.com/quantumgameio)

Follow updates on Twitter [@QuantumGameIO](https://twitter.com/QuantumGameIO), [Faceboook](https://www.facebook.com/quantumgameio/) and read our blog posts on [Medium](https://medium.com/quantum-photons).

Quantum Game is currently being developed by dr [Piotr Migdał](https://p.migdal.pl/), [Klem Jankiewicz](http://jankiewiczstudio.com/), [Paweł Grabarz](https://github.com/frizi) and [Philippe Cochin](https://github.com/sneakyweasel). Concept art by [Chiara Decaroli](https://maperseguirvirtute.wordpress.com/) and generative music by [Pawel Janicki](https://www.paweljanicki.jp/) and others. [The full list of contributors](https://github.com/Quantum-Game/quantum-game-2/graphs/contributors).

This version of the game was funded by the [Center for Quantum Technologies of the National University of Singapore](https://www.quantumlah.org/) and now being developed by the **Quantum Flytrap**.

![Quantum Game 2 logo](public/img/qg2_logo.png)

The current version uses subcomponents:

* [Quantum Tensors](https://github.com/Quantum-Game/quantum-tensors) - a JavaScript / TypeScript package for sparse tensor operations on complex numbers. It is an NPM package we created for this game, but made it in a way it is reusable.
* [bra-ket-vue](https://github.com/Quantum-Game/bra-ket-vue) - quantum state and operator visualizer, in Vue.js.
* [Quantum Encyclopedia](https://github.com/Quantum-Game/qg-encyclopedia) - encyclopedia of elements and concepts in quantum physics.

You can play the old version (2014-2016) [here](http://play.quantumgame.io/); its source is at [stared/quantum-game](https://github.com/stared/quantum-game).

[![Centre for Quantum Technologies - National University of Singapore](https://img.shields.io/badge/Supported%20By-CQT,%20National%20University%20of%20Singapore-brightgreen.svg?style=for-the-badge)](https://www.quantumlah.org/)

## Installation

You need to have [yarn](https://yarnpkg.com/) installed. Then, after cloning install dependencies with:

```bash
yarn
```

And run it with:

```bash
yarn serve
```

![In-game screenshot from Quantum Game 2](public/img/qg2_social_media_screenshot.png)

## Contribution

It as an open-source project and we appreciate contributions.

## Issues

Please report all errors using [Issues](https://github.com/Quantum-Game/quantum-game-2/issues). Please be explicit what is wrong, and what is the desired behavior. Screenshots do help a lot.
