// useColorsStats.ts
import { computed } from 'vue'
// import { colorsMeaning } from '@/composables/useColorsMeaning'
import { Colors } from '@/types/Colors'
import { DayNote } from '@/types/DayNote'

// Helper pour obtenir le "point" d'une couleur
const getColorPoint = (colors: ComputedRef<Colors[]>, color: string): number => {
  return colors.value.find(c => c.color === color)?.point ?? 0
}

export const useColorsStats = (colors: ComputedRef<Colors[]>, dataRef: ComputedRef<DayNote[]>) => {
  const allColors = computed(() =>
    dataRef.value.flatMap(day =>
      day.moments.map(moment => moment.color).filter(color => color)
    )
  )

  // Compte les occurrences pour chaque couleur
  const colorStats = computed(() =>
    Object.entries(
      allColors.value.reduce((acc, color) => {
        acc[color] = (acc[color] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).map(([color, qty]) => ({ color, qty }))
  )

  // Calcul du total de points
  const totalPoints = computed(() =>
    allColors.value.reduce((sum, color) => sum + getColorPoint(colors, color), 0)
  )

  // Nombre total de couleurs utilisées (utile pour un ratio)
  const totalColors = computed(() => allColors.value.length)

  return {
    colorStats,
    totalPoints,
    totalColors,
  }
}
