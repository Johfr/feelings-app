<script setup lang="ts">
import RoutineForm from '@/components/utils/RoutineForm.vue'
import { RecurrentRoutine } from '@/types/RecurrentRoutine'
import ConfirmBox from '@/components/utils/ConfirmBox.vue'

defineProps<{
  routines: RecurrentRoutine[],
  title: string,
  asCheckBox?: boolean
}>()


const showRoutineForm = ref<boolean>(false)
const showRoutineConfirm = ref<boolean>(false)
const routineSelected = ref<RecurrentRoutine>()

const showRoutineFormFn = (value: boolean = true): void => {
  showRoutineForm.value = value
}

const showRoutineConfirmFn = (): void => {
  showRoutineConfirm.value = !showRoutineConfirm.value
}

const crudRoutine = (routine: RecurrentRoutine, type: string = ''): void => {
  type === 'delete' ? showRoutineConfirmFn() : showRoutineFormFn()
  routineSelected.value = routine
}

const emit = defineEmits(['create', 'update', 'confirm'])
// CRUD RECURRENT STORE
const createNewRoutine = async (newRoutine: string) => {
  emit('create', {...routineSelected.value, title: newRoutine})
}

const updateRoutine = async (routine: RecurrentRoutine) => {
  emit('update', routine)
}

const deleteRoutine = async () => {
  emit('confirm', routineSelected.value)
  showRoutineConfirmFn()
}

</script>

<template>
  <section class="daily-routine">
    <h2 class="title-h2">{{ title }}</h2>
    <slot name="title"></slot>

    <button type="button" @click="crudRoutine({ id: null, title: null, done: null, type: null })">
      Ajouter une tâche
    </button>

    <label :for="routine.id" v-for="(routine, routineId) in routines" :key="routineId" class="flex flex-wrap items-center">
      <!-- <input v-if="asCheckBox" :id="routine.id" type="checkbox" v-model="routine.done" @change="updateRoutine(routine)"> -->
      <div v-if="asCheckBox" class="rounded-[50%] w-2 h-2 mr-3 border-1 border-solid border-blue-500" :class="{'bg-blue-500': routine.done}"></div>
      <p :class="{'done': routine.done}">
        {{ routine.title }}
      </p>
      <button type="button" class="" @click="crudRoutine(routine)">Modifier</button>
      <button type="button" class="delete-button" @click="crudRoutine(routine, 'delete')">Supprimer</button>
    </label>

    <Transition name="slide-fade">
      <RoutineForm v-if="showRoutineForm" v-model="showRoutineForm" :routineSelected="routineSelected" @create="createNewRoutine" @update="updateRoutine" />
    </Transition>

    <Transition name="slide-fade">
      <ConfirmBox v-if="showRoutineConfirm" v-model="showRoutineConfirm" @confirm="deleteRoutine" />
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.daily-routine {
  padding: var(--padding);
}
.done {
  position: relative;
  &::before {
    content: "";
    width: 0;
    height: 1px;
    position: absolute;
    top: 50%;
    left: 0;
    background-color: #000;
    animation: linethrough .6s forwards;
  }
}
@keyframes linethrough {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>