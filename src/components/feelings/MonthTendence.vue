<script setup lang="ts">
import { useDayNoteStore } from '@/stores/dayNoteStore'
import { useMonthNumber } from '@/composables/useDate'
import { DayNote } from '@/types/DayNote'
import GraphBar from '@/components/graphs/GraphBar.vue'
import { useColorsStats } from '@/composables/useColorsStats'
import Arrow from '@/assets/svg/arrow.svg?component'
import { useColorStore } from '@/stores/colorStore'
import { Colors } from '@/types/Colors'

const colorStore = useColorStore()
colorStore.loadColors()
const colorsData = computed((): Colors[] => colorStore.colorItems)

const store = useDayNoteStore()

const props = defineProps<{
  month: string,
  year: number,
}>()

const data = computed((): DayNote[] => store.dayNoteItems.filter((item: DayNote) => item.month === useMonthNumber(props.month) && item.year === props.year))

const { colorStats, totalPoints, totalColors } = useColorsStats(colorsData, data)

const monthTendency = computed(() => {
  let difficulty = (totalColors.value * 0.05) // 5% : mois neutre
  
  if (totalPoints.value >= (totalColors.value / 2)) {
    return 'mois positif'
  } else if ((totalPoints.value >= (totalColors.value / 2) - difficulty && totalPoints.value <= (totalColors.value / 2) + difficulty )) {
    return 'mois neutre'
  } else {
    return 'mois négatif'
  }
})

const showTendence = ref<boolean>(false)
const tendenceButtonText = ref<string>('Tendance du mois')

const toggleTendence = (): boolean => showTendence.value = !showTendence.value
const toggleTendenceText = (): string => showTendence.value ? tendenceButtonText.value = 'Masquer' : tendenceButtonText.value = 'Tendance du mois'
const showTendenceFn = (): void => {
  toggleTendence()
  toggleTendenceText()
}
</script>

<template>
  <!-- <div class="flex items-center"> -->
    <button @click="showTendenceFn" class="flex items-center mt-1">
      <span>
        {{ tendenceButtonText }}
      </span>
      <Arrow class="color-meaning_icon w-2 h-2 ml-2 transition duration-300 fill-(--tail-btn-color)" :class="{'rotate-180' : showTendence}"/>
    </button>
    <!-- <slot></slot>
  </div> -->

  <Transition name="fade">
    <div v-if="showTendence">
      <p class="border-l-5 border-l-solid border-l p-2 inline-block mt-1" :class="monthTendency ? 'text-green-500 ' : 'text-red-500 '">
        {{ monthTendency }} ({{ totalPoints }}/{{ totalColors }})
      </p>
      <GraphBar v-if="colorStats.length" :colorStats="colorStats" />
    </div>
  </Transition>
</template>

<style scoped lang="scss">
</style>