// useColorsStats.ts
import { computed, type ComputedRef } from 'vue'
import type { DayNote } from '@/types/DayNote'

export const useColorsStats = (dataRef: ComputedRef<DayNote[]>) => {
  // Toutes les couleurs utilisées
  const allColors = computed(() =>
    dataRef.value.flatMap(day =>
      day.moments.map(moment => moment.color).filter(Boolean)
    )
  )

  // Statistiques de couleurs : nb d'occurrences de chaque couleur
  const colorStats = computed(() =>
    Object.entries(
      allColors.value.reduce((acc, color) => {
        acc[color] = (acc[color] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).map(([color, qty]) => ({ color, qty }))
  )

  // Calcul des points cumulés par catégorie
  const totalPoints = computed(() => {
    const total = { positive: 0, negative: 0, neutre: 0 }

    dataRef.value.forEach(day => {
      day.moments.forEach(moment => {
        if (typeof moment.colorPoint === 'number') {
          if (moment.colorPoint > 0) total.positive += moment.colorPoint
          else if (moment.colorPoint < 0) total.negative += Math.abs(moment.colorPoint)
          else total.neutre += 1 // tu peux aussi faire += moment.colorPoint si 0 a un poids
        }
      })
    })

    return total
  })

  const totalColors = computed(() => allColors.value.length)

  return {
    colorStats,
    totalPoints,
    totalColors
  }
}
