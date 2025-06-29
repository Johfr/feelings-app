<script setup lang="ts">
import RoutineForm from '@/components/utils/RoutineForm.vue'
import { CurrentRoutine } from '@/types/CurrentRoutine'
import ConfirmBox from '@/components/utils/ConfirmBox.vue'

const props = defineProps<{
  routines: CurrentRoutine[],
  title?: string,
  asCheckBox?: boolean
}>()

// trier par 
// const localRoutines = ref<CurrentRoutine[]>(props.routines)
const sortedRoutines = computed(() => {
  return [...props.routines].sort((a, b) => Number(a.done) - Number(b.done))
})

const showRoutineForm = ref<boolean>(false)
const showRoutineConfirm = ref<boolean>(false)
const routineSelected = ref<CurrentRoutine>()

const showRoutineFormFn = (value: boolean = true): void => {
  showRoutineForm.value = value
}

const showRoutineConfirmFn = (): void => {
  showRoutineConfirm.value = !showRoutineConfirm.value
}

const crudRoutine = (routine: CurrentRoutine, type: string = ''): void => {
  type === 'delete' ? showRoutineConfirmFn() : showRoutineFormFn()
  routineSelected.value = routine
}

// const sortByDone = () => {
//   localRoutines.value.sort((a: CurrentRoutine, b: CurrentRoutine) => {
//     // false < true : les non faites (false) restent en haut
//     return Number(a.done) - Number(b.done)
//   }) 
// }

const toggleDone = (routine: CurrentRoutine) => {
  routine.done = !routine.done
  updateRoutine(routine)
}

const emit = defineEmits(['create', 'update', 'confirm'])
// CRUD RECURRENT STORE
const createNewRoutine = async (newRoutine: string) => {
  emit('create', {...routineSelected.value, title: newRoutine})
}

const updateRoutine = async (routine: CurrentRoutine) => {
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
    
    <slot name="cta"></slot>
    <button type="button" @click="crudRoutine({ id: null, date: null, month: null, year: null, title: null, done: null, type: null })">
      Ajouter une tâche
    </button>

    <label :for="routine.id" v-for="(routine) in sortedRoutines" :key="routine.id" class="flex flex-wrap items-center">
      <!-- <input v-if="asCheckBox" :id="routine.id" type="checkbox" class="w-4 h-4 mr-3" v-model="routine.done" @input="toggleDone(routine)"> -->
      <div v-if="asCheckBox" class="rounded-[50%] w-2 h-2 mr-3 border-1 border-solid border-blue-500" :class="{'bg-blue-500': routine.done}"></div>
      <p :class="{'done': routine.done}" @click="toggleDone(routine)">
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