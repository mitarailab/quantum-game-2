# 第三者素材の表記

このフォークの本体コードは [Quantum Game 2](https://github.com/Quantum-Game/quantum-game-2) に由来します。
Copyright (c) 2019 Piotr Migdał。MITライセンス全文は [LICENSE](LICENSE) にあります。
公開用ファイルにも同じ全文を `public/LICENSE.txt` として含めます。
原著者、コンセプトアート、生成音楽、上流版の支援機関のクレジットは [README](README.md) を参照してください。
研究室による日本語版の開発・運営は、原著者や支援機関による公認・支援を意味しません。

## 百科事典

[Quantum Game Encyclopedia](https://github.com/Quantum-Game/qg-encyclopedia) の文章は、
Chiara Decaroli、Piotr Migdał および他の貢献者によるCC BY作品です。
上流READMEに版番号・ライセンスURLがないため、版番号は確認中です。CC BY 4.0と断定しません。
宣言は原著者によるREADME追加コミットと公開READMEでも確認しました。
ただし、重ね合わせ・干渉の記事にWikipediaの過去版と近似する説明があり、第三者由来の条件は別途確認が必要です。
`src/assets/data/encyclopedia/elements.json` と `concepts.json` の文章にもこの出典を適用します。
翻訳時には、原著者・原文の出典・確認したライセンスURL・研究室による翻訳や編集の事実を公開画面に表示します。
画像は文章とは別の条件です。画像ごとの調査結果は [ライセンス調査](docs/license-review.md) にあります。

## フォントとアイコン

- Font Awesome Free 5.15.1: アイコンはCC BY 4.0、フォントはSIL OFL 1.1、コードはMIT。
  [当該版のライセンス](https://github.com/FortAwesome/Font-Awesome/blob/5.15.1/LICENSE.txt) と埋め込みクレジットを保持します。
- Montserrat: 現在はGoogle Fontsから外部読み込みしています。
  [上流のSIL OFL 1.1](https://github.com/JulietaUla/Montserrat/blob/master/OFL.txt) を参照し、
  自前配信へ変更する場合は実際に使うフォント版の著作権表示・ライセンス全文を同梱します。

## 依存ライブラリ

固定バージョンの直接依存53件について、公開npmメタデータのライセンス宣言を
[一覧](docs/licenses/direct-dependencies.json) に記録しています。
MIT、BSD、Apache 2.0、ISC等の個別条件が適用されます。
この表記は配布物の全依存ライセンス通知を代替しません。
公開前に推移的依存と実際の配布物を確認し、各パッケージの著作権表示・ライセンス全文・必要なNOTICEを同梱してください。
