# Quantum Game 2 日本語版のライセンス調査

2026年10月12日時点。開発先は `mitarailab/quantum-game-2`、開発ブランチは `japanese`。
本体はMITライセンスで改変・配布が許可されていますが、百科事典の文章・画像等には別の条件があります。
現状は素材確認が未完了で、公開条件をすべて満たした状態ではありません。

調査対象は本体コミット `dbeebfa51a4bc3e6be27784992cc24fb0450c503` と
百科事典サブモジュール `826ee7a8d39f93ff3523f0b12db90dd7e6ba66d7`。
以下の確認事項は研究室版のWeb公開に向けたものです。

## 本体と文章

| 対象 | 根拠と条件 | 公開前の対応 |
| --- | --- | --- |
| 本体コード | [上流LICENSE](https://github.com/Quantum-Game/quantum-game-2/blob/dbeebfa51a4bc3e6be27784992cc24fb0450c503/LICENSE) はMIT。著作権表示と許諾全文の保持が必要 | ルートLICENSEを維持。`public/LICENSE.txt` を配布し、公開画面から案内する |
| 百科事典文章と生成JSON | [上流README](https://github.com/Quantum-Game/qg-encyclopedia/blob/826ee7a8d39f93ff3523f0b12db90dd7e6ba66d7/README.md) はCC BY。原著者はChiara Decaroli、Piotr Migdał、他の貢献者。版番号は未記載 | 版番号とURLを確定。原著者・原文へのリンク・翻訳や編集の事実を表示する。根拠なくMITやCC BY 4.0へ変更しない |
| `src/engine/Helpers.ts` の `hslToHex` | [Stack Overflowの投稿](https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex) 由来とのコメント。対応する投稿・改訂の条件を個別確認する必要がある。[投稿のライセンス方針](https://stackoverflow.com/help/licensing) は時期によりCC BY-SA 2.5、3.0、4.0 | 採用した回答と改訂を特定して条件を満たすか、由来が明確なライブラリ等へ置き換える。MITだけで扱えると断定しない |

CC BYの条件は版番号によって詳細が異なります。[CC BY 4.0の説明](https://creativecommons.org/licenses/by/4.0/) は参考であり、百科事典の版番号を示す根拠ではありません。

## 画像

生成済み百科事典JSONで使用される画像URLは11件です。
[素材一覧](licenses/media-inventory.json) に使用箇所と、ローカル素材108件の確認区分を記録しています。
一覧は使用・配布の許諾を証明するものではなく、未使用素材も含みます。Markdown原稿には追加の画像があります。

Wikimedia Commonsの次の5件は、ファイル説明ページで条件と著作者を確認しました。
公開画面へのクレジット実装と、実際に使用する版の照合は未完了です。

| 素材 | 著作者 | 確認した条件と出典 |
| --- | --- | --- |
| 金属反射率 `Image-Metal-reflectance.png` | Bob Mellish / DrBob | [CC BY-SA 3.0 または GFDL](https://commons.wikimedia.org/wiki/File:Image-Metal-reflectance.png)。採用する条件を明示し、免責表記も確認する |
| ワイヤー偏光子 `Wire-grid-polarizer.svg` | Bob Mellish | [CC BY-SA 3.0 または GFDL、免責表記あり](https://commons.wikimedia.org/wiki/File:Wire-grid-polarizer.svg) |
| `CircularPolarizer.jpg` | PiccoloNamek | [CC BY-SA 3.0 または GFDL](https://commons.wikimedia.org/wiki/File:CircularPolarizer.jpg) |
| 日焼け止め写真 | Andrew Steele、被写体HYanWong | [CC0 1.0](https://commons.wikimedia.org/wiki/File:Sunscreen_on_back_under_normal_and_UV_light.jpg)。原稿の画像altにある「CC BY」と説明ページの条件が異なる |
| 円偏光と波長板の図 | Dave3457 | [Public domain](https://commons.wikimedia.org/wiki/File:Circular.Polarization.Circularly.Polarized.Light_Circular.Polarizer_Creating.Left.Handed.Helix.View.svg) |

CC BY-SA画像を翻訳・改変する場合は、画像の改変物に適用される継承条件を確認します。
画像の条件を本体コードのMITと混同しません。

次の素材は権利条件が未解決です。公開前に条件と証拠を記録するか、自作図などへ置き換えるか、配布物と表示から除外します。

- 百科事典の実験写真4件: `beam_splitter.jpg`、`mirror3a.jpg`、`pbs.jpg`、`polarizer.jpg`。上流READMEは画像を個別条件とし、該当写真の条件は未特定。
- 糖溶液の図: ixquick経由のQuora CDN画像。原著作者・再利用条件は未特定。
- 検出器の写真: Phys.org関連のSuper-Kamiokande写真。出典リンクだけでは再利用許諾にならない。
- `src/assets/faces` の人物写真3件と `HomepageTestimonials.vue` の推薦コメント。研究室版への転載条件と、公認と誤解されない表示を確認する。
- `QG_logo.svg`、公開用アイコン、CQT/NUSのロゴ等。コードのライセンスとは別に、名称・ロゴの利用と支援・公認を示唆する表現を確認する。

画像は外部URLから読み込む方式でも確認対象です。`updateEntries.ts` は上流の `master` の画像URLを生成するため、公開時は確認した素材の版を固定します。

## 音楽とフォント

`src/mixins/soundtrack/synth.ts` はTone.jsによる生成音楽です。
ローカル素材一覧にはMP3・WAV・OGGはなく、この実装では外部録音の読み込みも確認されませんでした。
上流READMEのPawel Janickiのクレジットを保持し、録音や追加音源を採用した場合は別途調査します。

Font Awesome Free 5.15.1は、アイコンCC BY 4.0、フォントSIL OFL 1.1、コードMITです。
[当該版LICENSE](https://github.com/FortAwesome/Font-Awesome/blob/5.15.1/LICENSE.txt) と埋め込み通知を保持します。
ブランドアイコンは、そのブランドを指す用途で使い、公認を示す表示にしません。

Montserratは `public/index.html` でGoogle Fontsを外部読み込みしています。
[上流OFL](https://github.com/JulietaUla/Montserrat/blob/master/OFL.txt) を確認しましたが、外部配信の実ファイル版は固定されていません。
自前配信時には使用版のOFL全文と著作権表示を同梱します。日本語フォントを追加する場合も同様に調査します。

## 依存ライブラリと配布物

`yarn.lock` の固定バージョンについて、直接依存22件と開発依存31件のnpmメタデータを確認しました。
[依存一覧](licenses/direct-dependencies.json) に取得元、バージョン、宣言ライセンス、配布URL、integrityを記録しています。
宣言はMIT 45件、BSD 4件、Apache 2.0 2件、ISC 1件、Font Awesomeの複合条件1件です。
この結果はメタデータの調査で、パッケージに含まれる個別素材や推移的依存の調査を代替しません。

公開ビルドができた段階で、配布するJavaScript・CSS・フォント等に含まれる全依存を確定し、
実パッケージのLICENSE・著作権表示とApache系のNOTICE等を回収します。
圧縮で必要なコメントが消えた場合にも表記を配布できるよう、全文通知を公開ディレクトリへ同梱します。

## 公開前の完了条件

- [x] Organizationの独立フォークを作成し、開発用originを切り替える。
- [x] 本体MITの原文を保持し、公開用ディレクトリにも全文を追加する。
- [x] 文章・画像・音楽・フォント・直接依存の初期調査と出典を記録する。
- [ ] 百科事典のCC BY版番号を確定するか、未確定の文章を公開対象から外す。
- [ ] 未解決の写真・図・推薦文・転載コードについて、許諾条件を確定するか、置き換え・除外を完了する。
- [ ] 日本語版の運営主体、原著作者、翻訳や改変の事実を表示し、クレジット画面を実装する。
- [ ] 推移的依存を含む配布物の全通知を作成する。
- [ ] 実際の公開ビルドにLICENSE・通知・必要な素材クレジットが含まれることを検証する。

ライセンス確認はDNS設定やサイト公開の前に完了させます。現時点ではサイト公開・DNS変更は行っていません。
