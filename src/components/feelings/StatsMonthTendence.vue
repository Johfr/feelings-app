<script setup lang="ts">
import GraphBar from '@/components/graphs/GraphBar.vue'
import { useColorsStats } from '@/composables/useColorsStats'
import { useMonthNumber } from '@/composables/useDate'
import { useDayNoteStore } from '@/stores/dayNoteStore'
// import { useColorStore } from '@/stores/colorStore'
import { DayNote } from '@/types/DayNote'
// import { Colors } from '@/types/Colors'
// import Arrow from '@/assets/svg/arrow.svg?component'

// const colorStore = useColorStore()
// colorStore.loadColors()
// const colorsData = computed((): Colors[] => colorStore.colorItems)

const noteStore = useDayNoteStore()

const props = defineProps<{
  month: string,
  year: number,
}>()

const showMonthTrends = defineModel<boolean>('showMonthTrends', { default: false })

const data = computed((): DayNote[] => noteStore.dayNoteItems.filter((item: DayNote) => item.month === useMonthNumber(props.month) && item.year === props.year))

const { colorStats, totalPoints, totalColors } = useColorsStats(data)
const positiveSumCumulated = computed(() => totalPoints.value.positive + Math.abs(totalPoints.value.neutre - totalPoints.value.negative) )
const positiveMomentsInPercent = computed(() => totalColors.value === 0 ? '0' : (totalPoints.value.positive * 100 / totalColors.value).toFixed()) // evite de diviser /0 (NaN)
const negativeMomentsInPercent = computed(() => totalColors.value === 0 ? '0' : (totalPoints.value.negative * 100 / totalColors.value).toFixed()) // evite de diviser /0 (NaN
const neutreMomentsInPercent = computed(() => totalColors.value === 0 ? '0' : (totalPoints.value.neutre * 100 / totalColors.value).toFixed()) // evite de diviser /0 (NaN

const monthTendency = computed(() => {
  let difficulty = (totalColors.value * 0.05) // 5% : mois neutre
  
  if (positiveSumCumulated.value >= (totalColors.value / 2)) {
    return 'mois positif'
  } else if ((positiveSumCumulated.value >= (totalColors.value / 2) - difficulty && positiveSumCumulated.value <= (totalColors.value / 2) + difficulty )) {
    return 'mois neutre'
  } else {
    return 'mois négatif'
  }
})
console.log(totalColors.value);

// const showTendence = ref<boolean>(false)
// const tendenceButtonText = ref<string>('Tendance du mois')

// const toggleTendence = (): boolean => showTendence.value = !showTendence.value
// const toggleTendenceText = (): string => showTendence.value ? tendenceButtonText.value = 'Masquer' : tendenceButtonText.value = 'Tendance du mois'
// const toggleShowTendence = (): void => {
//   toggleTendence()
//   toggleTendenceText()
// }
</script>

<template>
  <!-- <div class="flex items-center">
    <button @click="toggleShowTendence" class="flex items-center mt-1">
      <span>
        {{ tendenceButtonText }}
      </span>
      <Arrow class="color-meaning_icon w-2 h-2 ml-2 transition duration-300 fill-(--tail-btn-color)" :class="{'rotate-180' : showTendence}"/>
    </button>
    <slot></slot>
  </div> -->

  <Transition name="fade">
    <div v-if="showMonthTrends">
      <p class="border-l-5 border-l-solid border-l p-2 inline-block mt-1" :class="monthTendency ? 'text-green-500 ' : 'text-red-500 '">
        {{ monthTendency }} ({{ positiveSumCumulated }}/{{ totalColors }})
      </p>
      <small>
        <span>
          {{ totalPoints.positive }} moments positifs
        </span>
        <span class="font-bold text-green-500">
          ({{ positiveMomentsInPercent }}%)
        </span>
        <span>
          +
        </span>
      </small>
      <small>
        <span>
          ({{ totalPoints.negative }} moments négatifs
        </span>
        <span class="font-bold text-red-500">
          ({{ negativeMomentsInPercent }}%)
        </span>
        <span>
          -
        </span>
      </small>
      <small>
        <span>
          {{ totalPoints.neutre }} moments neutres
        </span>
        <span class="font-medium text-black-500">
          ({{ neutreMomentsInPercent }}%)
        </span>
      </small>
      <GraphBar v-if="colorStats.length" :colorStats="colorStats" />
    </div>
  </Transition>
</template>

<style scoped lang="scss">
</style>