import { hsl } from 'd3-color'

export const TAU = 2 * Math.PI

/**
 * Pick a random index of an array according to weights.
 * @param weights An array of weights. By default they should sum up to 1.
 * @param normalize If to normalize array.
 * @returns A number [0, ..., weights.length -1].
 */
export function weightedRandomInt(weights: number[], normalize = true): number {
  let r = Math.random()
  if (normalize) {
    r *= weights.reduce((a, b): number => a + b, 0)
  }
  let cumSum = 0
  for (let i = 0; i < weights.length; i += 1) {
    cumSum += weights[i]
    if (cumSum > r) {
      return i
    }
  }
  return -1
}

/**
 * Convert a string in camelCase to dash-case
 * @param str string to convert
 */
export function camelCaseToDash(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([0-9])([^0-9])/g, '$1-$2')
    .replace(/([^0-9])([0-9])/g, '$1-$2')
    .replace(/-+/g, '-')
    .toLowerCase()
}

/** Convert degrees and percentage HSL values using BSD-licensed d3-color. */
export function hslToHex(h: number, s: number, l: number): string {
  return hsl(h, s / 100, l / 100).formatHex()
}

/**
 * Generate HSL color from complex number
 * https://github.com/stared/quantum-game/blob/master/js/transition_heatmap.js
 */
export function colorComplex(re: number, im: number): string {
  const angleInDegrees = ((Math.atan2(im, re) * 360) / TAU + 360) % 360
  const r = Math.sqrt(re * re + im * im) // for pure color it should be always 1
  return hslToHex(angleInDegrees, 100, 100 - 50 * r)
}
