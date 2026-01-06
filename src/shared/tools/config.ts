import { Autumn, Spring, Summer, Winter } from '@/shared/assets/images/home'

export const SEASON_COLORS = {
  winter: '#A7CFFF',
  spring: '#7BC96F',
  summer: '#FFD966',
  autumn: '#F4A261',
} as const

export const SEASON_NAMES = {
  winter: 'ЗИМА',
  spring: 'ВЕСНА',
  summer: 'ЛЕТО',
  autumn: 'ОСЕНЬ',
} as const

export const SEASON_IMAGES = {
  winter: Winter,
  spring: Spring,
  summer: Summer,
  autumn: Autumn,
} as const

export const SEASON_ORDER = ['winter', 'spring', 'summer', 'autumn'] as const

export const STAGE_TIMERS: Array<{ stage: AnimationStage; delayMs: number }> = [
  { stage: 'earth-descending', delayMs: 1000 },
  { stage: 'earth-orbiting', delayMs: 2400 },
  { stage: 'earth-zooming', delayMs: 5200 },
  { stage: 'seasons', delayMs: 6700 },
] as const

export const SEASON_STEP_MS = 1500
export const MONTH_ORDER = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const
export const MONTH_CELL_DELAY_MS = 150
export const MONTH_CELLS_EXTRA_DELAY_MS = 500
export const MONTH_NAME_DURATION_MS = 1300
export const MONTH_NAME_VISIBLE_MS = 1100
export const ORBIT_RADIUS = 150
export const ORBIT_RADIUS_ZOOMED = 280

export type Season = (typeof SEASON_ORDER)[number]

export type AnimationStage =
  | 'sun'
  | 'earth-descending'
  | 'earth-orbiting'
  | 'earth-zooming'
  | 'seasons'
  | 'months-cells'
  | 'months-names'
  | 'complete'
