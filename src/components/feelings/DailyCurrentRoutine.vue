<script setup lang="ts">
import RoutineForm from '@/components/utils/RoutineForm.vue'
import { CurrentRoutine } from '@/types/CurrentRoutine'
import ConfirmBox from '@/components/utils/ConfirmBox.vue'
import CalendarIcon from '@/assets/svg/calendar.svg?component'
import Pencil from '@/assets/svg/pencil.svg?component'
import Trash from '@/assets/svg/trash.svg?component'

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

const showNewCalendar = ref<boolean>(false)
const toggleShowNewCalendar = () => {
  showNewCalendar.value = !showNewCalendar.value
}
const openNewCalendar = () => {
  toggleShowNewCalendar()
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

    <!--  border-b border-gray-100 pb-3 -->
    <ol class="list-decimal">
      <li
        :for="routine.id" v-for="(routine, routineId) in sortedRoutines"
        :key="routine.id"
        class="routine-list flex flex-wrap justify-between items-center py-3 cursor-context-menu"
      >
        <!-- <input v-if="asCheckBox" :id="routine.id" type="checkbox" class="w-4 h-4 mr-3" v-model="routine.done" @input="toggleDone(routine)"> -->
        <div class="flex items-center">
          <!-- pastille  bleue -->
          <div
            v-if="asCheckBox"
            class="rounded-[50%] min-w-2 w-2 h-2 mr-3 border-1 border-solid border-blue-500"
            :class="{'bg-blue-500': routine.done}"
          />

          <p
            :class="{'done': routine.done}"
            @click="toggleDone(routine)"
            title="cliquer pour valider"
          >
            {{ routine.title }}
          </p>
        </div>

        <div class="cta-container flex items-center opacity-0">
          <!-- <button type="button" class="" @click="crudRoutine(routine)">Modifier</button> -->
          <Pencil class="svg mr-3" @click="crudRoutine(routine)" title="modifier"/>
          <!-- <button type="button" class="delete-button" @click="crudRoutine(routine, 'delete')">Supprimer</button> -->
          <Trash class="svg mr-3" @click="crudRoutine(routine, 'delete')" title="supprimer"/>
          <CalendarIcon class="svg" title="reprogrammer" @click="openNewCalendar"/>
        </div>
      </li>
    </ol>

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
  // opacity: .6;
  // text-decoration: line-through;
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

.routine-list {
  .cta-container {
    transition: .4s ease;
  }
  &:hover .cta-container {
    opacity: 1;
  }
}

</style>