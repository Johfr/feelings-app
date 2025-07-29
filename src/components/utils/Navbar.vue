<script setup lang="ts">
import { useCurrentDate, useCurrentMonth, useMonthName, useCurrentYear } from '@/composables/useDate'
import { useCurrentRoutineStore } from '@/stores/currentRoutineStore'
// import { useGoalStore } from '@/stores/goalStore'
import { CurrentRoutine } from '@/types/CurrentRoutine'
import { TargetArrow24Regular, DataArea24Filled, DataArea20Regular, DataTrending16Regular, ArrowSyncCircle20Regular } from '@vicons/fluent'
import { UserAvatarFilledAlt, TaskSettings } from '@vicons/carbon'
import { NBadge, NFloatButton, NIcon } from 'naive-ui'


const currentRoutinesStore = useCurrentRoutineStore()
currentRoutinesStore.loadRoutines()

const currentRunningTaskExists = ref<CurrentRoutine[] | null>(null)
const hasCurrentRunningTask = ref()

watchEffect(async () => {
  const runningTasks = await currentRoutinesStore.findCurrentRunningTask(
    useCurrentDate,
    useCurrentMonth,
    useCurrentYear
  )

  currentRunningTaskExists.value = runningTasks
  
  hasCurrentRunningTask.value = runningTasks?.length > 0  
})


const currentRoutineLeft = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(routine => {
  if (routine.date === useCurrentDate && routine.month === useCurrentMonth && routine.year === useCurrentYear) {
    return !routine.done
  }
}))

const emit = defineEmits(['showMonthTags', 'showMonthTarget', 'showMonthTasks', 'showMonthTrends'])

const toggleMonthTags = ():void => {
  emit('showMonthTags')
}
const toggleMonthTarget = ():void => {
  emit('showMonthTarget')
}
const toggleMonthTasks = ():void => {
  emit('showMonthTasks')
}
const toggleMonthTrends = ():void => {
  emit('showMonthTrends')
}
</script>

<template>
  <div class="flex gap-5 mt-5">
    <n-float-button position="relative" title="Mes tags" @click="toggleMonthTags">
      <n-badge :value="0" :offset="[8, -8]">
        <n-icon>
          <UserAvatarFilledAlt />
        </n-icon>
      </n-badge>
    </n-float-button>

    <n-float-button position="relative" title="Objectif du mois" @click="toggleMonthTarget">
      <n-badge :value="0" :offset="[8, -8]">
        <n-icon>
          <TargetArrow24Regular />
        </n-icon>
      </n-badge>
    </n-float-button>

    <n-float-button position="relative" title="Objectif du mois" @click="toggleMonthTrends">
      <n-badge :value="0" :offset="[8, -8]">
        <n-icon>
          <DataTrending16Regular />
        </n-icon>
      </n-badge>
    </n-float-button>
      
    <n-float-button v-if="hasCurrentRunningTask" position="relative" title="tâche en cours" @click="toggleMonthTasks">
      <n-badge processing :offset="[8, -8]" color="transparent">
        
        <n-icon>
          <TaskSettings />
        </n-icon>

        <template #value>
           <!-- v-if="true" class="text-blue-500 animate-spin" -->
          <n-icon color="blue" size="20" class=" animate-spin">
            <ArrowSyncCircle20Regular />
          </n-icon>
        
        </template>
      </n-badge>
    </n-float-button>

    <n-float-button v-else position="relative" title="tâche en cours" @click="toggleMonthTasks">
      <n-badge :value="currentRoutineLeft.length" :offset="[8, -8]">
        <n-icon>
          <TaskSettings />
        </n-icon>
      </n-badge>
    </n-float-button>
  </div>
</template>