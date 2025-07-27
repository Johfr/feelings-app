<script setup lang="ts">
import { useCurrentDate, useCurrentMonth, useMonthName, useCurrentYear } from '@/composables/useDate'
import { useCurrentRoutineStore } from '@/stores/currentRoutineStore'
import { CurrentRoutine } from '@/types/CurrentRoutine'

// const route = useRoute()
// const routeYear = computed(() => route.params.year as string)
// const routeYearNumber = computed(() => Number(routeYear.value))

const props = defineProps<{
  actifMonth: string,
  actifMonthNumber: number,
  actifYear: number
}>()

// const emit = defineEmits(['openpopin'])

const currentRoutinesStore = useCurrentRoutineStore()
currentRoutinesStore.loadRoutines()

const totalMonthlyRoutines = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(routine => {
  return routine.month === props.actifMonthNumber && routine.year === props.actifYear
}))

const totalMonthlyRoutinesDone = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(routine => {
  return routine.month === props.actifMonthNumber && routine.year === props.actifYear && routine.done
}))

// const currentRoutineLeft = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(routine => {
//   if (routine.date === useCurrentDate && routine.month === useCurrentMonth && routine.year === useCurrentYear) {
//     return !routine.done
//   }
// }))

// const currentDailyRoutineTotal = computed((): number =>
//   currentRoutinesStore.items
//   .filter(routine => 
//     routine.date === useCurrentDate && routine.month === useCurrentMonth && routine.year === routeYearNumber.value).length
// )

// const openPopin = ():void => {
//   // emit('openpopin', useCurrentDate, useCurrentMonth, useCurrentYear)
//   emit('openpopin')
// }
</script>

<template>  
  <!-- Tâches restantes  -->
   <!--  @click="openPopin" -->
  <!-- <div class="mt-3 ml-2 cursor-pointer" v-if="currentDailyRoutineTotal && currentDailyRoutineTotal > 0">
    <p v-if="currentRoutineLeft.length === 0" class="text-xs md:text-sm text-indigo-400">
      Félicitation ! Tu as réalisé toutes tes tâches de ta journée. Tu peux être fier de toi 💪 !
    </p>

    <p v-else class="text-xs md:text-sm text-black-500">
       pour aujourd'hui ( {{ useCurrentDate }} {{ useMonthName(useCurrentMonth) }} {{ useCurrentYear }} )
      {{ currentRoutineLeft.length }} tâches restantes. Tu peux le faire 💪
    </p>

  </div> -->
    
  <p class="text-xs md:text-sm">
    <span class="font-bold">{{ totalMonthlyRoutinesDone.length }}</span>/{{ totalMonthlyRoutines.length }} tâches réalisées ce mois-ci ({{ actifMonth }})
  </p>
</template>

<style scoped lang="scss">
</style>