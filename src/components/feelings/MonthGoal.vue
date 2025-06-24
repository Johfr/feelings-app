<script setup lang="ts">
import Pencil from '@/assets/svg/pencil.svg?component'
import Popin from '@/components/utils/Popin.vue'
import MonthGoalForm from '@/components/utils/MonthGoalForm.vue'
import { useGoalStore } from '@/stores/goalStore'
import { Goal } from '@/types/Goal'

const props = defineProps<{
  routeMonthNumber: number,
  routeYear: number
}>()

const goalStore = useGoalStore()
const monthGoal = ref<Goal | null>(null)

// Charge les goals au mount
onMounted(() => {
  goalStore.loadGoal().then(() => {
    updateGoal()
  })
})

// Met à jour la goal quand le mois/année change ou après chargement
const updateGoal = async () => {
  const goalFound = await goalStore.findOne(props.routeMonthNumber, Number(props.routeYear))
  monthGoal.value = goalFound || null
}

// Si le mois/année change dynamiquement
watch(
  () => [props.routeMonthNumber, props.routeYear, goalStore.items],
  updateGoal,
  { immediate: true }
)

const showPopin = ref<boolean>(false)

const showPopinFn = ():void => {
  showPopin.value = !showPopin.value
}

const updateGoalTitle = async (itemId: string, goalTitleUpdated: string) => {  
  const resp = await goalStore.update(itemId, goalTitleUpdated)
  
  if (resp.status === 200) {
    showPopinFn()
  }
}

const createNewGoal = async (newGoalTitle: string) => {
  const resp = await goalStore.create(newGoalTitle, props.routeMonthNumber, props.routeYear)
    
  if (resp.status === 201) {
    showPopinFn()
    updateGoal()
  }
}

const deleteGoal = async (itemId: string, goalTitle: string) => {
  const resp = await goalStore.delete(itemId)
  
  if (resp.status === 200) {
    updateGoal()
    showPopinFn()
  }
}

</script>

<template>
  <div class="flex items-center flex-wrap mb-3">
    <h1 class="title-h2 mr-3">
      Objectif du mois :
    </h1>

    <p class="underline mr-3">
      {{ monthGoal?.goal }}
    </p>

    <Pencil class="svg" title="Modifier" @click="showPopinFn" />
  
    <Teleport to="body">
      <Transition name="slide-fade">
        <Popin v-if="showPopin" v-model="showPopin">
          <div class="popin-content">
            <MonthGoalForm :id="monthGoal?.id" :goal="monthGoal?.goal" v-model="showPopin" @update="updateGoalTitle" @create="createNewGoal" @delete="deleteGoal" />
          </div>
        </Popin>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* .popin-content {
 display: flex;
 align-items: flex-start;
} */
</style>