<script setup lang="ts">
import MonthGoalTagsForm from '@/components/utils/MonthGoalTagsForm.vue'
import Popin from '@/components/utils/Popin.vue'
import { useGoalStore } from '@/stores/goalStore'
import { Goal } from '@/types/Goal'
import { NSpace, NTag } from 'naive-ui'
import Pencil from '@/assets/svg/pencil.svg?component'

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

const showTagsPopin = ref<boolean>(false)
const toggleShowTagsPopin = ():void => {
  showTagsPopin.value = !showTagsPopin.value
}
const showMonthTags = defineModel<boolean>('showMonthTags', { default: false })

// Met à jour la goal quand le mois/année change ou après chargement
const updateGoal = async () => {
  const goalFound = await goalStore.findOne(props.routeMonthNumber, Number(props.routeYear))
  monthGoal.value = goalFound || null
}

const updateGoalTags = async (itemId: string, newTags: string[]) => {
  const resp = await goalStore.update(itemId, newTags)
  if (resp.status === 200) {
    toggleShowTagsPopin()
    updateGoal()
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

// Si le mois/année change dynamiquement
watch(
  () => [props.routeMonthNumber, props.routeYear, goalStore.items],
  updateGoal,
  { immediate: true }
)
</script>

<template>
  <Transition name="slide-up">
    <div v-show="showMonthTags">
      <section class="flex items-center flex-wrap mt-5">
        <h2 class="title-h3 mr-3">
          Personnalité du mois :
        </h2>

        <n-space class="mr-3">
          <n-tag v-for="(tag, tagId) in monthGoal?.tags" :key="tagId" type="info" @click="toggleShowTagsPopin()" class="cursor-pointer" title="Ajouter une description">
            {{ tag }}
          </n-tag>
        </n-space>
        
        <span title="Créer ou mettre à jour">
          <Pencil class="svg" @click="toggleShowTagsPopin()" />
        </span>

        <Teleport to="body">
          <Transition name="slide-fade">
            <Popin v-if="showTagsPopin" v-model="showTagsPopin">
              <div class="popin-content">
                <MonthGoalTagsForm
                  :id="monthGoal?.id"
                  :goal="monthGoal?.goal"
                  :tags="monthGoal?.tags || []"
                  v-model="showTagsPopin"
                  @update="updateGoalTags"
                  @create="createNewGoalTags"
                  @delete="removeGoalTags"
                />
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