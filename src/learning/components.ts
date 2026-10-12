import { Elem, elemName } from '@/engine/model/elem'
import { IGrid } from '@/engine/interfaces'
import { i18n } from '@/i18n'
import { gameText } from '@/i18n/game'

// Original explanations of this game's implementation, not translations of qg-encyclopedia.
const descriptions: Record<Elem, [string, string]> = {
  [Elem.Wall]: [
    '光を通さない固定の障害物です。光子の状態はここで吸収されます。',
    'A fixed obstacle that absorbs the incoming photon state.',
  ],
  [Elem.Gate]: [
    'この版のシミュレーションでは、光を吸収する障害物として扱われます。',
    'In this version, a gate acts as an absorbing obstacle.',
  ],
  [Elem.Laser]: [
    '矢印の向きへ、指定した偏光の光子を送り出します。',
    'Emits a photon in the arrow direction with the selected polarization.',
  ],
  [Elem.NonLinearCrystal]: [
    'この版では光の状態をそのまま通します。光子対の生成は実装されていません。',
    'Passes the state through unchanged in this version; photon-pair generation is not implemented.',
  ],
  [Elem.Mirror]: [
    '入ってきた光の進行方向を、鏡の向きに応じて変えます。クリックして向きを変え、反射先を確かめましょう。',
    'Changes the propagation direction according to its orientation. Rotate it to explore reflection.',
  ],
  [Elem.BeamSplitter]: [
    '入力した光の状態を透過と反射の経路へ分けます。標準設定では、それぞれの経路で検出される確率は半分です。光子が2個になるわけではありません。',
    'Splits the state into transmitted and reflected paths. At the default setting each path has half the detection probability, without creating a second photon.',
  ],
  [Elem.CoatedBeamSplitter]: [
    'この版では通常のビームスプリッターと同じ作用です。透過と反射の経路に状態を分けます。',
    'Uses the same operator as the ordinary beam splitter in this version.',
  ],
  [Elem.PolarizingBeamSplitter]: [
    '偏光によって進む経路を変えます。部品の向きと入力偏光を変え、透過・反射する成分を比べましょう。',
    'Routes polarization components into different paths. Compare the output while changing its orientation and the input polarization.',
  ],
  [Elem.CornerCube]: [
    '光を入ってきた方向へ折り返します。',
    'Sends light back toward the direction it came from.',
  ],
  [Elem.Detector]: [
    '光子を検出して確率を表示します。この版の計算では向きによる選別はなく、全方向検出器と同じ吸収作用です。',
    'Detects photons and displays their probability. This version uses the same absorbing operator as the omnidirectional detector.',
  ],
  [Elem.DetectorFour]: [
    'どの方向から来た光子も検出します。複数の経路から届いた結果を、この検出器で確かめられます。',
    'Detects photons arriving from any direction.',
  ],
  [Elem.Rock]: [
    '光子を吸収します。ここへ届いた成分は、その後の経路には進みません。',
    'Absorbs the photon state, removing that component from subsequent propagation.',
  ],
  [Elem.Mine]: [
    '光子を吸収すると失敗につながる部品です。地雷での検出確率を抑えながら、目標の検出器へ導きましょう。',
    'An absorbing hazard. Keep its absorption probability low while guiding the photon to the goal.',
  ],
  [Elem.Absorber]: [
    '通過する光の振幅を弱めます。標準設定では、通過後に残る確率は半分です。',
    'Attenuates the passing state. At the default setting half the probability remains.',
  ],
  [Elem.Polarizer]: [
    '部品の透過軸に沿った偏光成分だけを通します。入力偏光と軸の角度によって、通過後の確率が変わります。',
    'Transmits the polarization component along its axis. The surviving probability depends on the input polarization.',
  ],
  [Elem.QuarterWavePlate]: [
    '2つの直交する偏光成分の間に、¼周期の位相差を与えます。入力と部品の向きによって、直線偏光と円偏光の変換を試せます。',
    'Introduces a quarter-cycle relative phase between orthogonal polarization components, allowing linear and circular polarization conversion.',
  ],
  [Elem.HalfWavePlate]: [
    '2つの直交する偏光成分の間に、½周期の位相差を与えます。向きを変えて、出力の偏光がどう変わるか確かめましょう。',
    'Introduces a half-cycle relative phase between orthogonal polarization components.',
  ],
  [Elem.SugarSolution]: [
    '偏光の向きを回転させます。ゲームの標準設定では45°回転させます。',
    'Rotates polarization by 45 degrees at the default setting.',
  ],
  [Elem.FaradayRotator]: [
    '偏光を回転させる部品です。往復する光に対する作用を糖溶液と比べてみましょう。',
    'Rotates polarization. Compare its effect on returning light with that of sugar solution.',
  ],
  [Elem.Glass]: [
    '光の状態に¼周期の位相変化を与えます。単独の経路の確率ではなく、経路を重ねたときの干渉に注目しましょう。',
    'Applies a quarter-cycle phase shift. Observe its effect when paths recombine.',
  ],
  [Elem.VacuumJar]: [
    'ガラス板とは逆向きの¼周期の位相変化を与えます。経路を重ねたときの干渉を変えられます。',
    'Applies the opposite quarter-cycle phase shift to the glass slab.',
  ],
}

export function pieceDescription(type: Elem): string {
  return descriptions[type][i18n.global.locale.value === 'ja' ? 0 : 1]
}

export function pieceName(type: Elem): string {
  return gameText(elemName(type))
}

// Stable route identifiers are independent of translated display names.
export const componentIds: Record<string, Elem> = {
  laser: Elem.Laser,
  detector: Elem.Detector,
  'detector-four': Elem.DetectorFour,
  rock: Elem.Rock,
  mine: Elem.Mine,
  mirror: Elem.Mirror,
  'corner-cube': Elem.CornerCube,
  'beam-splitter': Elem.BeamSplitter,
  'coated-beam-splitter': Elem.CoatedBeamSplitter,
  'polarizing-beam-splitter': Elem.PolarizingBeamSplitter,
  'sugar-solution': Elem.SugarSolution,
  'faraday-rotator': Elem.FaradayRotator,
  polarizer: Elem.Polarizer,
  'quarter-wave-plate': Elem.QuarterWavePlate,
  'half-wave-plate': Elem.HalfWavePlate,
  glass: Elem.Glass,
  'vacuum-jar': Elem.VacuumJar,
  absorber: Elem.Absorber,
  wall: Elem.Wall,
  gate: Elem.Gate,
  'non-linear-crystal': Elem.NonLinearCrystal,
}

export function componentId(type: Elem): string {
  return Object.keys(componentIds).find((id) => componentIds[id] === type) as string
}

// Independently authored demonstration board; no encyclopedia grid data is imported.
export function componentGrid(type: Elem): IGrid {
  const rotation = [Elem.Mirror, Elem.BeamSplitter, Elem.CoatedBeamSplitter].includes(type) ? 45 : 0
  return {
    cols: 5,
    rows: 5,
    cells: [
      ...(type === Elem.Laser
        ? []
        : [
            { coord: { x: 0, y: 2 }, element: 'Laser', frozen: true, rotation: 0, polarization: 0 },
          ]),
      { coord: { x: 2, y: 2 }, element: Elem[type], frozen: false, rotation, polarization: 0 },
      { coord: { x: 4, y: 2 }, element: 'DetectorFour', frozen: true },
      { coord: { x: 2, y: 0 }, element: 'DetectorFour', frozen: true },
      { coord: { x: 2, y: 4 }, element: 'DetectorFour', frozen: true },
    ],
  }
}

export const interferometerGrid: IGrid = {
  cols: 7,
  rows: 5,
  cells: [
    { coord: { x: 0, y: 3 }, element: 'Laser', frozen: true, rotation: 0, polarization: 0 },
    { coord: { x: 1, y: 3 }, element: 'BeamSplitter', frozen: false, rotation: 45 },
    { coord: { x: 1, y: 1 }, element: 'Mirror', frozen: false, rotation: 45 },
    { coord: { x: 5, y: 3 }, element: 'Mirror', frozen: false, rotation: 45 },
    { coord: { x: 5, y: 1 }, element: 'BeamSplitter', frozen: false, rotation: 45 },
    { coord: { x: 6, y: 1 }, element: 'DetectorFour', frozen: true },
    { coord: { x: 5, y: 0 }, element: 'DetectorFour', frozen: true },
  ],
}
