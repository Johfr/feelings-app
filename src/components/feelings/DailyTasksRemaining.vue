<script setup lang="ts">
import { useCurrentDate, useCurrentMonth, useCurrentYear } from '@/composables/useDate'
import { useCurrentRoutineStore } from '@/stores/currentRoutineStore'
import { CurrentRoutine } from '@/types/CurrentRoutine'

const emit = defineEmits(['openpopin'])

const currentRoutinesStore = useCurrentRoutineStore()
currentRoutinesStore.loadRoutines()

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
    
    <p v-else class="text-indigo-400">
      {{ currentRoutineLeft.length }} tâches restantes pour aujourd'hui. Tu peux le faire 💪
    </p>
  </div>
</template>

<style scoped lang="scss">
</style>