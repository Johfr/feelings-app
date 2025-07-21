<script setup lang="ts">
import { useCurrentDate, useCurrentMonth, useMonthName, useCurrentYear } from '@/composables/useDate'
import { useCurrentRoutineStore } from '@/stores/currentRoutineStore'
import { CurrentRoutine } from '@/types/CurrentRoutine'

const props = defineProps<{
  actifMonth: string,
  actifMonthNumber: number,
  actifYear: number
}>()

const emit = defineEmits(['openpopin'])

const currentRoutinesStore = useCurrentRoutineStore()
currentRoutinesStore.loadRoutines()

const totalMonthlyRoutines = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(routine => {
  return routine.month === props.actifMonthNumber && routine.year === props.actifYear
}))

const totalMonthlyRoutinesDone = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(routine => {
  return routine.month === props.actifMonthNumber && routine.year === props.actifYear && routine.done
}))

const currentRoutineLeft = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(routine => {
  if (routine.date === useCurrentDate && routine.month === useCurrentMonth && routine.year === useCurrentYear) {
    return !routine.done
  }
})
)

const route = useRoute()
const routeYear = computed(() => route.params.year as string)
const routeYearNumber = computed(() => Number(routeYear.value))

const currentDailyRoutineTotal = computed((): number =>
  currentRoutinesStore.items
  .filter(routine => 
    routine.date === useCurrentDate && routine.month === useCurrentMonth && routine.year === routeYearNumber.value).length
)

const openPopin = ():void => {
  emit('openpopin', useCurrentDate, useCurrentMonth, useCurrentYear)
}
</script>

<template>
  <!-- Tâches restantes  -->
  <div class="mt-3 ml-2 cursor-pointer inline-block" v-if="currentDailyRoutineTotal && currentDailyRoutineTotal > 0" @click="openPopin">
    <p v-if="currentRoutineLeft.length === 0" class="text-indigo-400">
      Félicitation ! Tu as réalisé toutes tes tâches de ta journée. Tu peux être fier de toi !
    </p>

    <p v-else class="text-xs md:text-sm text-indigo-400">
      {{ currentRoutineLeft.length }} tâches restantes pour aujourd'hui ( {{ useCurrentDate }} {{ useMonthName(useCurrentMonth) }} {{ useCurrentYear }} ). Tu peux le faire 💪
    </p>
    
    <p class="text-xs md:text-sm">
      <span class="font-bold">{{ totalMonthlyRoutinesDone.length }}</span>/{{ totalMonthlyRoutines.length }} tâches réalisées ce mois-ci ({{ actifMonth }})
    </p>

  </div>
</template>

<style scoped lang="scss">
</style>