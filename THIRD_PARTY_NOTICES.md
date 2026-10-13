# 第三者素材の表記

このフォークの本体コードは [Quantum Game 2](https://github.com/Quantum-Game/quantum-game-2) に由来します。
Copyright (c) 2019 Piotr Migdał。MITライセンス全文は [LICENSE](LICENSE) にあります。
公開用ファイルにも同じ全文を `public/LICENSE.txt` として含めます。
原著者、コンセプトアート、生成音楽、上流版の支援機関のクレジットは [README](README.md) を参照してください。
研究室による日本語版の開発・運営は、原著者や支援機関による公認・支援を意味しません。

## 百科事典

現在のアプリの学習画面は、このフォーク用に新しく書いた部品説明と独立した実験盤面を使います。
旧百科事典の文章・写真・盤面データはアプリから読み込んでいません。
以下の条件は、ソース内に残した上流百科事典データについての表記です。

[Quantum Game Encyclopedia](https://github.com/Quantum-Game/qg-encyclopedia) の文章は、
Chiara Decaroli、Piotr Migdał および他の貢献者によるCC BY作品です。
上流READMEに版番号・ライセンスURLがないため、版番号は確認中です。CC BY 4.0と断定しません。
宣言は原著者によるREADME追加コミットと公開READMEでも確認しました。
ただし、重ね合わせ・干渉の記事にWikipediaの過去版と近似する説明があり、第三者由来の条件は別途確認が必要です。
`src/assets/data/encyclopedia/elements.json` と `concepts.json` の文章にもこの出典を適用します。
翻訳時には、原著者・原文の出典・確認したライセンスURL・研究室による翻訳や編集の事実を公開画面に表示します。
画像は文章とは別の条件です。画像ごとの調査結果は [ライセンス調査](docs/license-review.md) にあります。

## 公開版の部品・素材

2026年10月13日の公開版では、旧百科事典の文章・写真・人物写真・推薦文、原作ロゴ、CQT/NUSロゴ、旧公開用画像・アイコンを配布しません。ゲーム中の原作の部品・盤面・キャラクターの図は本体のMITライセンスと原作者クレジットを保持して配布します。
色変換は出典条件が未確定のStack Overflow由来実装を削除し、BSD-3-Clauseのd3-color 2.0.0を使用します。旧Quantum Gameに由来する色表示の出典とMIT全文も配布通知に保持します。

## フォントとアイコン

- Font Awesome Free 5.15.1: アイコンはCC BY 4.0、フォントはSIL OFL 1.1、コードはMIT。
  [当該版のライセンス](https://github.com/FortAwesome/Font-Awesome/blob/5.15.1/LICENSE.txt) と埋め込みクレジットを保持します。
- Feather: Cole Bemis作のMITライセンスのアイコン。色等を変更したものを含みます。[v4.28.0のMIT全文](https://github.com/feathericons/feather/blob/v4.28.0/LICENSE)を配布通知に同梱します。
- 外部配信のMontserratは読み込まず、閲覧者の端末のシステムフォントを使います。Font AwesomeのフォントにはOFL 1.1全文と元のフォント内の著作権表示を保持します。

## 依存ライブラリ

初期の直接依存メタデータ調査は [一覧](docs/licenses/direct-dependencies.json) にあります。
実際のWeb配布物については `scripts/distribution-notices.cjs` がwebpackのモジュール一覧を検査し、
推移的依存を含む全パッケージのLICENSE・著作権表示・存在するNOTICEを集約します。
初回公開版は33パッケージバージョン（同じ名前の別バージョンを区別）です。
全文は公開サイトの `THIRD_PARTY_LICENSES.txt`、一覧と出典は `THIRD_PARTY_LICENSES.json` にあります。
ライセンスが見つからない新しい依存が入った場合には公開ビルドを失敗させます。

vueと@vue/sharedの全文は使用版v3.0.0の上流から補完しています。
bra-ket-vue 0.4.2はnpmとタグにMIT宣言がありますがタグに独立した全文がないため、上流のLICENSEを補完し、パッケージREADMEの原作者クレジットを保持しています。
quantum-tensors 0.4.13も使用版にMIT宣言があり、独立した全文がありません。READMEの著作者表記と標準のMIT許諾全文を掲載します。著作権年は推測していません。
補完ファイルの出典・説明とSHA-256は `docs/licenses/supplemental/sources.json` に記録しています。
