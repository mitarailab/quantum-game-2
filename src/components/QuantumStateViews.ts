/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneVNode, VNode } from 'vue'
import { KetViewer as OriginalKetViewer, MatrixViewer as OriginalMatrixViewer } from 'bra-ket-vue'
import { gameText } from '@/i18n/game'

// bra-ket-vue 0.4.2 has no locale prop. Adapt its render output rather than changing
// dimension names, basis identifiers, emitted options, or the library's source.
function displayText(text: string): string {
  const trimmed = text.trim()
  const translated = gameText(trimmed)
  return translated === trimmed ? text : text.replace(trimmed, translated)
}

function translateNode(node: any): any {
  if (typeof node === 'string') return displayText(node)
  if (!node || !node.__v_isVNode) return node
  const copy: VNode = cloneVNode(node)
  // Static English labels must also update when the selected locale changes.
  copy.patchFlag = 0
  copy.dynamicChildren = null
  if (typeof copy.children === 'string') copy.children = displayText(copy.children)
  else if (Array.isArray(copy.children)) copy.children = copy.children.map(translateNode)
  return copy
}

const adapted = new WeakMap<Record<string, any>, any>()
function localizeComponent(component: any): any {
  if (adapted.has(component)) return adapted.get(component)
  const copy = { ...component }
  adapted.set(component, copy)
  if (component.components) {
    copy.components = Object.fromEntries(
      Object.entries(component.components).map(([name, child]) => [name, localizeComponent(child)])
    )
  }
  if (component.render) {
    copy.render = function (this: any, ...args: any[]) {
      return translateNode(component.render.apply(this, args))
    }
  }
  return copy
}

export const KetViewer = localizeComponent(OriginalKetViewer) as typeof OriginalKetViewer
export const MatrixViewer = localizeComponent(OriginalMatrixViewer) as typeof OriginalMatrixViewer
