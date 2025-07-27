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
const monthGoal = ref<Goal | null>()

// Charge les goals au mount
onMounted(() => {
  goalStore.loadGoal().then(() => {
    updateGoal()
  })
})

const showPopin = ref<boolean>(false)
const toggleShowPopin = ():void => {
  showPopin.value = !showPopin.value
}

const showMonthTarget = defineModel<boolean>('showMonthTarget', { default: false })

// Met à jour la goal quand le mois/année change ou après chargement
const updateGoal = async () => {
  const goalFound = await goalStore.findOne(props.routeMonthNumber, Number(props.routeYear))
  monthGoal.value = goalFound || null
}

const createNewGoal = async (newGoalTitle: string) => {
  const resp = await goalStore.create(newGoalTitle, props.routeMonthNumber, props.routeYear)
    
  if (resp.status === 201) {
    toggleShowPopin()
    updateGoal()
  }
}

const updateGoalTitle = async (itemId: string, newTitle: string) => {
  const resp = await goalStore.update(itemId, newTitle)
  if (resp.status === 200) {
    toggleShowPopin()
    updateGoal()
  }
}

const removeGoalTitle = async (itemId: string) => {
  const resp = await goalStore.delete(itemId, 'goal')
  if (resp.status === 200) {
    updateGoal()
    toggleShowPopin()
  }
}
// Si le mois/année change dynamiquement
watch(
  () => [props.routeMonthNumber, props.routeYear, goalStore.items],
  updateGoal,
  { immediate: true }
)
</script>

<template>
  <Transition name="slide-up">
    <div v-show="showMonthTarget">
      <section class="flex items-center flex-wrap mt-5">
        <h2 class="title-h3 mr-3">
          Objectif du mois :
        </h2>

        <pre class="whitespace-pre-line text-xs md:text-sm font-[inherit] md:max-w-[80%] mr-3">
          {{ monthGoal?.goal }}
        </pre>

        <Pencil class="svg" title="Modifier" @click="toggleShowPopin()" />
        
        <Teleport to="body">
          <Transition name="slide-fade">
            <Popin v-if="showPopin" v-model="showPopin">
              <div class="popin-content">
                <MonthGoalForm :id="monthGoal?.id" :goal="monthGoal?.goal" v-model="showPopin" @update="updateGoalTitle" @create="createNewGoal" @delete="removeGoalTitle" />
              </div>
            </Popin>
          </Transition>
        </Teleport>
      </section>
    </div>
  </Transition>
</template>

<style scoped>
</style>