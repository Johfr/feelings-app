<script setup lang="ts">
import Pencil from '@/assets/svg/pencil.svg?component'
import Popin from '@/components/utils/Popin.vue'
import MonthGoalForm from '@/components/utils/MonthGoalForm.vue'
import { useGoalStore } from '@/stores/goalStore'
import { Goal } from '@/types/Goal'
import MonthGoalTagsForm from '@/components/utils/MonthGoalTagsForm.vue'
import { NSpace, NTag } from 'naive-ui'

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
const toggleShowPopin = ():void => {
  showPopin.value = !showPopin.value
}
const showTagsPopin = ref<boolean>(false)
const toggleShowTagsPopin = ():void => {
  showTagsPopin.value = !showTagsPopin.value
}

const createNewGoal = async (newGoalTitle: string) => {
  const resp = await goalStore.create(newGoalTitle, props.routeMonthNumber, props.routeYear, [])
    
  if (resp.status === 201) {
    toggleShowPopin()
    updateGoal()
  }
}

const updateGoalTitle = async (itemId: string, newTitle: string) => {
  const resp = await goalStore.update(itemId, newTitle, null) // null = on ne touche pas aux tags
  if (resp.status === 200) {
    toggleShowPopin()
    updateGoal()
  }
}

const updateGoalTags = async (itemId: string, newTags: string[]) => {
  const resp = await goalStore.update(itemId, null, newTags) // null = on ne touche pas au titre
  if (resp.status === 200) {
    toggleShowTagsPopin()
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
const removeGoalTags = async (itemId: string) => {
  const resp = await goalStore.delete(itemId, 'tags')
  if (resp.status === 200) {
    updateGoal()
    toggleShowTagsPopin()
  }
}

const createNewGoalTags = async (tags: string[]) => {  
  const resp = await goalStore.create('', props.routeMonthNumber, props.routeYear, tags)
    
  if (resp.status === 201) {
    toggleShowTagsPopin()
    updateGoal()
  }
}
</script>

<template>
  <section class="flex items-center flex-wrap mb-3">
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

  <section class="flex items-center flex-wrap mb-3">
    <h2 class="title-h3 mr-3">
      Aspects de ma personne :
    </h2>

    <n-space class="mr-3">
      <n-tag v-for="(tag, tagId) in monthGoal?.tags" :key="tagId" type="info" @click="toggleShowTagsPopin()" class="cursor-pointer">
        {{ tag }}
      </n-tag>
    </n-space>

    <Pencil class="svg" title="Modifier" @click="toggleShowTagsPopin()" />

    <Teleport to="body">
      <Transition name="slide-fade">
        <Popin v-if="showTagsPopin" v-model="showTagsPopin">
          <div class="popin-content">
            <MonthGoalTagsForm :id="monthGoal?.id" :goal="monthGoal?.goal" :tags="monthGoal?.tags || []" @update="updateGoalTags" @create="createNewGoalTags" @delete="removeGoalTags" />
          </div>
        </Popin>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
</style>