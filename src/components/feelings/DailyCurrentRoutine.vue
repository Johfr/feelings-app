<script setup lang="ts">
import RoutineForm from '@/components/utils/RoutineForm.vue'
import { CurrentRoutine } from '@/types/CurrentRoutine'
import ConfirmBox from '@/components/utils/ConfirmBox.vue'
import CalendarIcon from '@/assets/svg/calendar.svg?component'
import Pencil from '@/assets/svg/pencil.svg?component'
import TrashIcon from '@/assets/svg/trash.svg?component'
import CheckIcon from '@/assets/svg/check.svg?component'
import ArrowIcon from '@/assets/svg/arrow.svg?component'
import { usePreviousNextDate, useMonthName } from '@/composables/useDate'

const props = defineProps<{
  routines: CurrentRoutine[],
  title?: string,
  asCheckBox?: boolean
}>()

const emit = defineEmits(['create', 'update', 'confirm', 'confirm-multiple'])

// trier par 
const sortedRoutines = computed(() => {
  return [...props.routines].sort((a, b) => Number(a.done) - Number(b.done))
})

const showRoutineForm = ref<boolean>(false)
const showRoutineConfirm = ref<boolean>(false)
const showMultipleRoutineConfirm = ref<boolean>(false)
const routineSelected = ref<CurrentRoutine>()
const specificDate = ref<{date : number, month : number, year : number}>({date: null, month: null, year: null})
const openedDropdownId = ref<string | null>(null)
const routinesSelected = ref<CurrentRoutine[]>([])

const showRoutineFormFn = (value: boolean = true): void => {
  showRoutineForm.value = value
}

const showRoutineConfirmFn = (): void => {
  showRoutineConfirm.value = !showRoutineConfirm.value
}

const showMultipleRoutineConfirmFn = (): void => {
  showMultipleRoutineConfirm.value = !showMultipleRoutineConfirm.value
}

const crudRoutine = (routine: CurrentRoutine, type: string = ''): void => {
  type === 'delete' ? showRoutineConfirmFn() : showRoutineFormFn()
  routineSelected.value = routine
}

const crudMultipleRoutine = (): void => {
  showMultipleRoutineConfirmFn()
}

const toggleDone = (routine: CurrentRoutine) => {
  routine.done = !routine.done
  updateRoutine(routine)
}

const selectMultipleRoutine = (routine: CurrentRoutine): CurrentRoutine[] => {
  const alreadyExist = routinesSelected.value.filter(item => item.id === routine.id)

  if (alreadyExist.length > 0) {
    const index = routinesSelected.value.findIndex((item): Boolean => item.id === routine.id)
    routinesSelected.value.splice(index, 1) 
  } else {
    routinesSelected.value.push(routine)
  }
  
  return routinesSelected.value
}

const toggleDropdown = () => {
  openedDropdownId.value = null
}

const resetDateForm = () => {
  specificDate.value.date = null
  specificDate.value.month = null
  specificDate.value.year = null
}

const formatDate = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (!target?.value) return
  const inputDateSplitted = target.value.split('-')
  specificDate.value.date = Number(inputDateSplitted[2])
  specificDate.value.month = Number(inputDateSplitted[1])
  specificDate.value.year = Number(inputDateSplitted[0])
}

const updateRoutineDate = (routine: CurrentRoutine, direction: string) => {
  const updatedDate = usePreviousNextDate(routine.date, routine.month, routine.year, 'next')
  const updatedDateTwice = usePreviousNextDate(updatedDate.date, updatedDate.month, updatedDate.year, 'next')

  if (direction === 'nextDay') {
    routine.date = updatedDate.date
    routine.month = updatedDate.month
    routine.year = updatedDate.year
  } else if (direction === 'twoNextDay') {
    routine.date = updatedDateTwice.date
    routine.month = updatedDateTwice.month
    routine.year = updatedDateTwice.year
  } else if (direction === 'specificDate') {
    routine.date = specificDate.value.date
    routine.month = specificDate.value.month - 1
    routine.year = specificDate.value.year
  }
  
  updateRoutine(routine)
}

const openDropdown = (id: string) => {
  openedDropdownId.value = (openedDropdownId.value === id) ? null : id
}

// CRUD RECURRENT STORE
const createNewRoutine = async (newRoutine: string) => {
  emit('create', {...routineSelected.value, title: newRoutine})
}

const updateRoutine = async (routine: CurrentRoutine) => {
  emit('update', routine)
  toggleDropdown()
  resetDateForm()
}

const deleteRoutine = async () => {
  emit('confirm', routineSelected.value)
  showRoutineConfirmFn()
}

const deletMultipleRoutine = async () => {  
  emit('confirm-multiple', routinesSelected.value)
  routinesSelected.value = []
  showMultipleRoutineConfirmFn()
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

    <button v-show="routinesSelected.length > 0" type="button" @click="crudMultipleRoutine">
      Supprimer {{ routinesSelected.length }} tâches
      <TrashIcon class="svg mr-3" @click="" title="supprimer"/>
    </button>

    <Transition name="slide-fade">
      <ol class="list-decimal" v-if="sortedRoutines.length > 0">
        <li
          :for="routine.id" v-for="(routine, routineId) in sortedRoutines"
          :key="routine.id"
          class="routine-list flex flex-wrap justify-between flex-col py-3 cursor-context-menu relative"
        >
          <div class="flex items-baseline">
            <input
              v-if="asCheckBox"
              :id="routine.id"
              type="checkbox"
              class="routine-checkbox min-w-4 min-h-4 mr-3"
              :class="{ '--show-checkbox' : routinesSelected.length > 0}"
              @input="selectMultipleRoutine(routine)"
            >

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

          <div class="cta-container flex items-center justify-end md:opacity-0">
            <CheckIcon class="svg mr-3" :class="{ 'fill-indigo-600': routine.done }" @click="toggleDone(routine)" title="Done"/>
            <Pencil class="svg mr-3" @click="crudRoutine(routine)" title="modifier"/>
            <TrashIcon class="svg mr-3" @click="crudRoutine(routine, 'delete')" title="supprimer"/>
            <CalendarIcon class="svg" title="reprogrammer" @click="openDropdown(routine.id)"/>
          </div>
          
          <div v-show="openedDropdownId === routine.id" class="dropdown-overlay" @click="openedDropdownId = null"></div>
          <div v-show="openedDropdownId === routine.id" class="dropdown">
            <h3 class="border-b-1 border-b-gray-300 border-b-solid mb-2">Date d'échéance</h3>
            <button type="button" class="w-[100%] text-left my-1" @click="updateRoutineDate(routine, 'nextDay')">Demain</button>
            <button type="button" class="w-[100%] text-left my-1" @click="updateRoutineDate(routine, 'twoNextDay')">Après demain</button>

            <form>
              <label for="date-picker" class="button block w-[100%] relative">
                <span>
                  Une date spécifique
                  <ArrowIcon class="svg"/>
                </span>

                <input id="date-picker" type="date" @change="formatDate">
              </label>
            </form>

            <form v-show="specificDate?.date" class="date-form border-t-1 border-t-gray-300 border-solid text-center mt-3 pt-2 pb-5">
              <p class="title-h2">Déplacer au :</p>
              <span>
                {{ specificDate.date }} {{ useMonthName(specificDate.month - 1) }} {{ specificDate.year }}
              </span>
              <button type="button" class="submit w-[100%] mt-3" @click="updateRoutineDate(routine, 'specificDate')">Valider</button>
              <button type="button" class="w-[100%]" @click="resetDateForm">Annuler</button>
            </form>
          </div>
        </li>
      </ol>
    </Transition>

    <Transition name="slide-fade">
      <RoutineForm v-if="showRoutineForm" v-model="showRoutineForm" title="Mettre à jour une tâche" :routineSelected="routineSelected" @create="createNewRoutine" @update="updateRoutine" />
    </Transition>

    <Transition name="slide-fade">
      <ConfirmBox v-if="showRoutineConfirm" v-model="showRoutineConfirm" @confirm="deleteRoutine" />
    </Transition>

    <Transition name="slide-fade">
      <ConfirmBox v-if="showMultipleRoutineConfirm" v-model="showMultipleRoutineConfirm" @confirm="deletMultipleRoutine" />
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

.routine-list {
  .cta-container {
    position: relative;
    transition: .4s ease;
    z-index: 4;
  }
  &:hover .cta-container, &:hover .routine-checkbox {
    opacity: 1;
  }
}
.routine-checkbox {
  opacity: 0;
  transition: .4s;

  &.--show-checkbox {
    opacity: 1;
  }
}

.dropdown {
  width: 200px;
  min-height: 10px;
  padding: 5px;
  background-color: #fff;
  border: 1px solid #ccc;
  position: absolute;
  top: 100%;
  right: 0;
  border-radius: 5px;
  z-index: 5;
}

button[type='button'].submit {
  color: #fff;
}
button[type='button'], label {
  padding: 0;
  color: #000;
  border-radius: 5px;
  padding: 5px;

  &:hover {
    background-color: #f1f1f1;
  }
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 195, 255, 0.05);
  z-index: 4;
}

input[type='date']::-webkit-calendar-picker-indicator {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 4;
}
input[type='date'] {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  opacity: 0;
  cursor: pointer;
  box-sizing: border-box;
}

</style>