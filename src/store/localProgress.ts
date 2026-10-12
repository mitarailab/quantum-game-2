import { levels } from '@/assets/data/levels'

export const PROGRESS_STORAGE_KEY = 'quantum-game-2:progress:v1'
type ProgressStorage = Pick<Storage, 'getItem' | 'setItem'>
const levelIds = new Set(levels.map((level) => level.id))

function browserStorage(): ProgressStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch (_) {
    return null
  }
}

function normalize(ids: unknown[]): number[] {
  return Array.from(
    new Set(ids.filter((id): id is number => typeof id === 'number' && levelIds.has(id)))
  ).sort((a, b) => a - b)
}

export function readCompletedLevels(storage = browserStorage()): number[] {
  try {
    const raw = storage?.getItem(PROGRESS_STORAGE_KEY)
    if (raw == null) return []
    const data = JSON.parse(raw)
    if (data?.version !== 1 || !Array.isArray(data.completedLevels)) return []
    return normalize(data.completedLevels)
  } catch (_) {
    return []
  }
}

export function recordCompletedLevel(
  current: number[],
  id: number,
  storage = browserStorage()
): number[] {
  if (!levelIds.has(id)) return current
  // Merge other tabs' progress rather than overwriting it with this tab's older state.
  const persisted = readCompletedLevels(storage)
  const completedLevels = normalize([...current, ...persisted, id])
  try {
    if (storage != null && JSON.stringify(persisted) !== JSON.stringify(completedLevels)) {
      storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ version: 1, completedLevels }))
    }
  } catch (_) {
    // Keep the session playable even if browser settings or quota prevent persistence.
  }
  return completedLevels
}
