import { MONTH_NAME_DURATION_MS, ORBIT_RADIUS, ORBIT_RADIUS_ZOOMED } from './config'

import type { AnimationStage } from './config'

export const getStageFlags = (stage: AnimationStage) => ({
  isEarthVisible: stage !== 'sun',
  isEarthOrbiting: stage === 'earth-orbiting',
  isEarthZoomed: ['earth-zooming', 'seasons', 'months-cells', 'months-names', 'complete'].includes(stage),
  showSeasons: ['seasons', 'months-cells', 'months-names', 'complete'].includes(stage),
  showMonthCells: ['months-cells', 'months-names', 'complete'].includes(stage),
})

export const getMonthPosition = (monthNumber: number, isEarthZoomed: boolean) => {
  const angle = (monthNumber - 3) * 30
  const radius = isEarthZoomed ? ORBIT_RADIUS_ZOOMED : ORBIT_RADIUS
  const x = Math.cos((angle * Math.PI) / 180) * radius
  const y = Math.sin((angle * Math.PI) / 180) * radius

  return { x, y }
}

export const getMonthCompletion = (
  stage: AnimationStage,
  animatingMonth: number | null,
  monthNumber: number,
) => stage === 'complete' || (stage === 'months-names' && (animatingMonth || 0) > monthNumber)

export const getMonthAnimationWindow = (index: number) => ({
  start: index * MONTH_NAME_DURATION_MS,
  end: index * MONTH_NAME_DURATION_MS + (MONTH_NAME_DURATION_MS - 200),
})
