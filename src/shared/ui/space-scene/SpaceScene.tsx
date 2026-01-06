'use client'

import React from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

import { Earth, Sun } from '@/shared/assets/images/home'
import { jsonData } from '@/shared/utils/const'

import {
  MONTH_CELL_DELAY_MS,
  MONTH_CELLS_EXTRA_DELAY_MS,
  MONTH_NAME_DURATION_MS,
  MONTH_ORDER,
  SEASON_COLORS,
  SEASON_IMAGES,
  SEASON_NAMES,
  SEASON_ORDER,
  SEASON_STEP_MS,
  STAGE_TIMERS,
  type AnimationStage,
  type Season,
} from '../../tools/config'
import { getMonthAnimationWindow, getMonthCompletion, getMonthPosition, getStageFlags } from '../../tools/functions'

import styles from './SpaceScene.module.css'

export const SpaceScene = () => {
  const [stage, setStage] = React.useState<AnimationStage>('sun')
  const [currentSeasonIndex, setCurrentSeasonIndex] = React.useState(0)
  const [visibleMonthCells, setVisibleMonthCells] = React.useState<number[]>([])
  const [animatingMonth, setAnimatingMonth] = React.useState<number | null>(null)

  React.useEffect(() => {
    const timers = STAGE_TIMERS.map(({ stage: nextStage, delayMs }) => setTimeout(() => setStage(nextStage), delayMs))

    return () => timers.forEach(clearTimeout)
  }, [])

  React.useEffect(() => {
    if (stage !== 'seasons') return

    const timers: Array<ReturnType<typeof setTimeout>> = []

    SEASON_ORDER.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setCurrentSeasonIndex(index)
        }, index * SEASON_STEP_MS),
      )
    })

    timers.push(
      setTimeout(() => {
        setStage('months-cells')
      }, SEASON_ORDER.length * SEASON_STEP_MS),
    )

    return () => timers.forEach(clearTimeout)
  }, [stage])

  React.useEffect(() => {
    if (stage !== 'months-cells') return

    const timers: Array<ReturnType<typeof setTimeout>> = []

    MONTH_ORDER.forEach((monthNum, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleMonthCells((prev) => [...prev, monthNum])
        }, index * MONTH_CELL_DELAY_MS),
      )
    })

    timers.push(
      setTimeout(() => {
        setStage('months-names')
      }, MONTH_ORDER.length * MONTH_CELL_DELAY_MS + MONTH_CELLS_EXTRA_DELAY_MS),
    )

    return () => timers.forEach(clearTimeout)
  }, [stage])

  React.useEffect(() => {
    if (stage !== 'months-names') return

    const timers: Array<ReturnType<typeof setTimeout>> = []

    jsonData.question.forEach((month, index) => {
      const { start, end } = getMonthAnimationWindow(index)

      timers.push(
        setTimeout(() => {
          setAnimatingMonth(month.Number)
        }, start),
      )

      timers.push(
        setTimeout(() => {
          setAnimatingMonth(null)
        }, end),
      )
    })

    timers.push(
      setTimeout(() => {
        setStage('complete')
      }, jsonData.question.length * MONTH_NAME_DURATION_MS),
    )

    return () => timers.forEach(clearTimeout)
  }, [stage])

  const { isEarthVisible, isEarthOrbiting, isEarthZoomed, showSeasons, showMonthCells } = getStageFlags(stage)

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.sunWrapper}
        initial={{ scale: 1, opacity: 1 }}
        animate={{
          scale: isEarthZoomed ? 0.4 : 1,
          opacity: isEarthZoomed ? 0.6 : 1,
          x: isEarthZoomed ? '-30vw' : 0,
          y: isEarthZoomed ? '-20vh' : 0,
        }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <Image src={Sun} alt="Sun" className={styles.sun} priority />
      </motion.div>

      <AnimatePresence>
        {isEarthVisible && (
          <motion.div
            className={styles.earthWrapper}
            initial={{ y: '-100vh', scale: 0.3, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: isEarthZoomed ? 2.5 : isEarthOrbiting ? 0.5 : 0.3,
              x: isEarthOrbiting && !isEarthZoomed ? '20vw' : 0,
              rotate: isEarthOrbiting && !isEarthZoomed ? 45 : 0,
            }}
            transition={{
              y: { duration: 1.4, ease: 'easeOut' },
              opacity: { duration: 1.4 },
              scale: { duration: isEarthZoomed ? 1.5 : 2.8, ease: isEarthZoomed ? [0.4, 0, 0.2, 1] : 'easeInOut' },
              x: { duration: 2.8, ease: 'easeInOut' },
              rotate: { duration: 2.8, ease: 'easeInOut' },
            }}
          >
            <div className={styles.earthContainer}>
              <Image src={Earth} alt="Earth" className={styles.earth} priority />

              {showSeasons && (
                <>
                  {SEASON_ORDER.map((season, index) => {
                    const isVisible = index <= currentSeasonIndex

                    return (
                      <motion.div
                        key={season}
                        className={`${styles.seasonOverlay} ${styles[`season-${season}`]}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: isVisible ? 1 : 0,
                          scale: isVisible ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <Image
                          src={SEASON_IMAGES[season]}
                          alt={season}
                          className={styles.seasonImage}
                          fill
                        />
                      </motion.div>
                    )
                  })}
                </>
              )}
            </div>

            <AnimatePresence mode="wait">
              {showSeasons && stage === 'seasons' && (
                <motion.div
                  key={SEASON_ORDER[currentSeasonIndex]}
                  className={styles.seasonName}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {SEASON_NAMES[SEASON_ORDER[currentSeasonIndex]]}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {showMonthCells && (
        <div className={styles.monthsCircle}>
          {jsonData.question.map((month) => {
            const { x, y } = getMonthPosition(month.Number, isEarthZoomed)
            const isVisible = visibleMonthCells.includes(month.Number)
            const isAnimating = animatingMonth === month.Number
            const hasCompleted = getMonthCompletion(stage, animatingMonth, month.Number)

            return (
              <motion.div
                key={month.Number}
                className={styles.monthCell}
                style={{
                  '--border-color': SEASON_COLORS[month.Season as Season],
                } as React.CSSProperties}
                initial={{ scale: 0, opacity: 0, x, y, rotate: -5 }}
                animate={{
                  scale: isVisible ? 1 : 0,
                  opacity: isVisible ? 1 : 0,
                  rotate: isVisible ? 0 : -5,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'backOut',
                }}
              >
                <AnimatePresence mode="wait">
                  {!isAnimating && !hasCompleted && (
                    <motion.div
                      className={styles.monthNumber}
                      initial={{ scale: 1, color: '#1a1a2e' }}
                      exit={{
                        scale: 1.5,
                        color: '#ffffff',
                        y: -30,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {month.Number}
                    </motion.div>
                  )}

                  {isAnimating && (
                    <motion.div
                      className={styles.monthNameAnimating}
                      initial={{ y: -60, opacity: 0, scale: 1.5 }}
                      animate={{ y: 0, opacity: 1, scale: 0.7 }}
                      transition={{ duration: 0.8 }}
                    >
                      {month.Text}
                    </motion.div>
                  )}

                  {hasCompleted && (
                    <motion.div
                      className={styles.monthNameFinal}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 0.7 }}
                      transition={{ duration: 0.4 }}
                    >
                      {month.Text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      {isEarthOrbiting && !isEarthZoomed && (
        <motion.div
          className={styles.orbit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
        />
      )}
    </div>
  )
}
