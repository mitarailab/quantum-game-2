import { IEntry } from '@/engine/interfaces'
import { Elem } from '@/engine/model/elem'
import {
  componentIds,
  componentGrid,
  interferometerGrid,
  pieceDescription,
  pieceName,
} from '@/learning/components'
import { i18n } from '@/i18n'
import { gameText } from '@/i18n/game'

// Learning content is authored for this fork. qg-encyclopedia text/images/grids are not loaded.
export const elementNameList = Object.keys(componentIds)
export const conceptNameList = ['superposition', 'interference', 'mach-zehnder-interferometer']

const concepts: Record<string, { title: string; text: [string, string] }> = {
  superposition: {
    title: 'Superposition',
    text: [
      'ゲームでは、1個の光子の状態を経路ごとの複素振幅で表します。ビームスプリッターで複数の経路に状態が広がっても、光子が増えたわけではありません。',
      'One photon is described by complex amplitudes for different paths. Splitting the state across paths does not create additional photons.',
    ],
  },
  interference: {
    title: 'Interference',
    text: [
      '同じ出力状態へ到達する経路の振幅を足し合わせ、その絶対値の2乗から検出確率を求めます。位相の違いによって、振幅が強め合ったり打ち消し合ったりします。',
      'Amplitudes arriving at the same output state are added before their squared magnitude gives its detection probability. Relative phase determines whether they reinforce or cancel.',
    ],
  },
  'mach-zehnder-interferometer': {
    title: 'Mach–Zehnder interferometer',
    text: [
      '2つのビームスプリッターと鏡で、分けた経路をもう一度重ねる例です。鏡やビームスプリッターの向きを変えて、出力先と検出確率の変化を観察しましょう。',
      'Two beam splitters and mirrors separate and recombine paths. Rotate the components and observe the output probabilities.',
    ],
  },
}

export function hasEntry(name: string): boolean {
  return (
    Object.prototype.hasOwnProperty.call(componentIds, name) ||
    Object.prototype.hasOwnProperty.call(concepts, name)
  )
}

export function getEntry(name: string): IEntry & { defaultRotation?: number } {
  if (Object.prototype.hasOwnProperty.call(componentIds, name)) {
    const type = componentIds[name]
    return {
      title: pieceName(type),
      elementName: Elem[type],
      short: pieceDescription(type),
      grids: [componentGrid(type)],
      sections: [
        {
          title: gameText('How to explore'),
          content: gameText(
            'The simulation repeats automatically. Click rotatable components to change their orientation and observe the light paths.'
          ),
        },
      ],
      defaultRotation: [Elem.Mirror, Elem.BeamSplitter, Elem.CoatedBeamSplitter].includes(type)
        ? 45
        : 0,
    }
  }
  if (Object.prototype.hasOwnProperty.call(concepts, name)) {
    const concept = concepts[name]
    return {
      title: gameText(concept.title),
      elementName: '',
      short: concept.text[i18n.global.locale.value === 'ja' ? 0 : 1],
      grids: name === 'superposition' ? [componentGrid(Elem.BeamSplitter)] : [interferometerGrid],
      sections: [
        {
          title: gameText('How to explore'),
          content: gameText(
            'The simulation repeats automatically. Click rotatable components to change their orientation and observe the light paths.'
          ),
        },
      ],
    }
  }
  throw new Error(`Unknown learning entry: ${name}`)
}
