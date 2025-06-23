<script setup lang="ts">
import { useTodoStore } from '@/stores/todoStore'
import { monthNumber } from '@/composables/UseDate'
import { Todo } from '@/types/Todo'
import GraphBar from '@/components/graphs/GraphBar.vue'
import { useColorsStats } from '@/composables/useColorsStats'
import Arrow from '@/assets/svg/arrow.svg?component'
import { useColorStore } from '@/stores/colorStore'
import { Colors } from '@/types/Colors'

const colorStore = useColorStore()
colorStore.loadColors()
const colorsData = computed((): Colors[] => colorStore.colorItems)

const store = useTodoStore()

const props = defineProps<{
  month: string,
  year: string,
}>()

const data = computed((): Todo[] => store.todoItems.filter(item => item.month === monthNumber(props.month) && item.year === parseInt(props.year)))

const { colorStats, totalPoints, totalColors } = useColorsStats(colorsData, data)
const monthTendency = computed(() => totalPoints.value >= (totalColors.value / 2))
const showTendence = ref<boolean>(false)
const tendenceButtonText = ref<string>('Tendance du mois')

const toggleTendence = (): boolean => showTendence.value = !showTendence.value
const showTendenceFn = (): void => {
  toggleTendence()
  if (showTendence.value) {
    tendenceButtonText.value = 'Masquer'
  } else {
    tendenceButtonText.value = 'Tendance du mois'
  }
}
</script>

<template>
  <button @click="showTendenceFn" class="flex items-center mt-1">
    <span>
      {{ tendenceButtonText }}
    </span>
    <Arrow class="color-meaning_icon w-2 h-2 ml-2 transition duration-300 fill-(--tail-btn-color)" :class="{'rotate-180' : showTendence}"/>
  </button>
  
  <Transition name="fade">
    <div v-if="showTendence">
      <p class="border-l-5 border-l-solid border-l p-2 inline-block mt-1" :class="monthTendency ? 'text-green-500 ' : 'text-red-500 '">
        {{ monthTendency ? 'Mois positif' : 'Mois négatif' }} ({{ totalPoints }}/{{ totalColors }})
      </p>
      <GraphBar v-if="colorStats.length" :colorStats="colorStats" />
    </div>
  </Transition>
</template>

<style scoped lang="scss">
</style>