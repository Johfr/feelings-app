<script setup lang="ts">
import Pencil from '@/assets/svg/pencil.svg?component'
import Sunrise from '@/assets/svg/sunrise.svg?component'
import Moon from '@/assets/svg/moon.svg?component'
import Sun from '@/assets/svg/sun.svg?component'
import Drawner from '@/components/utils/Drawer.vue'
import DailyCurrentRoutine from '@/components/feelings/DailyCurrentRoutine.vue'
import Form from '@/components/utils/Form.vue'
import { days, dayNumber, months, monthNumber, currentDay, currentMonth } from '@/composables/UseDate'
import { useColorStore } from '@/stores/colorStore'
import { useTodoStore } from '@/stores/todoStore'
import { useCurrentRoutineStore } from '@/stores/currentRoutineStore'
import { useRecurrentRoutineStore } from '@/stores/recurrentRoutineStore'
import { Colors } from '@/types/Colors'
import { Day } from '@/types/Day'
import { Todo } from '@/types/Todo'
import { CurrentRoutine } from '@/types/CurrentRoutine'
import { RecurrentRoutine } from '@/types/RecurrentRoutine'
import DayDate from './DayDate.vue'

const currentRoutinesStore = useCurrentRoutineStore()
currentRoutinesStore.loadRoutines()

const recurrentRoutinesStore = useRecurrentRoutineStore()
recurrentRoutinesStore.loadRoutines()

// const colorsTranscription = [
//   {
//     color: 'blue',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'orange',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'yellow',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'pink',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'red',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'brown',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'violet',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'green',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'black',
//     hexadecimal : '#ffc0cb'
//   },
//   {
//     color: 'white',
//     hexadecimal : '#ffc0cb'
//   },
// ]

const props = defineProps<{
  daySelected: Day
}>()

const day = ref<Todo>()

const findTodo = async (daySelected: Day) => await useTodoStore().findOne(daySelected).then((todoFind: Todo) => {
  if (todoFind) {
    day.value = todoFind
  }
  else {
    day.value =  {
      id: daySelected.id,
      day: daySelected.dayNumber,
      month: daySelected.monthNumber,
      year: daySelected.year,
      moments: [
        {
          moment: "morning",
          color: "",
          content: ""
        },
        {
          moment: "afternoon",
          color: "",
          content: ""
        },
        {
          moment: "night",
          color: "",
          content: ""
        }
      ]
    }
  }
})

onMounted(() => findTodo(props.daySelected))

const currentRoutines = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(item => item.day === day.value.day && item.month === day.value.month && item.year === day.value.year ))
const recurrentRoutines = computed((): RecurrentRoutine[] => recurrentRoutinesStore.items)

const store = useColorStore()
store.loadColors()
const colorsData = computed((): Colors[] => store.colorItems)

const dateSelected = ref<Day>(props.daySelected)

const updateDate = async (dateUpdated: { date: number, month: number, year: number }) => {
  dateSelected.value = {
    id: null,
    dayNumber: dateUpdated.date,
    monthNumber: dateUpdated.month,
    year: dateUpdated.year
  }

  await findTodo({ id: null, dayNumber: dateUpdated.date, monthNumber: day.value.month, year: day.value.year })  
}

// mets à jour le contenu de la popin après un create
const updateData = () => {
  findTodo(dateSelected.value)
}

const formSection = ref<string>('')
const showForm = ref<boolean>(false)

const showFormFn = (section: string) => {
  showForm.value = true
  formSection.value = section
}

const showDrawer = ref<boolean>(false)
const showDrawerFn = () => {
  showDrawer.value = !showDrawer.value
}

// CRUD CURRENT STORE
const createNewRoutine = async (routine: CurrentRoutine) => {
  routine.day = day.value.day
  routine.month = day.value.month
  routine.year = Number(day.value.year)
  routine.type = routine.type ?? 'current'
  // routine.type = routine.type === 'recurrent' ? 'recurrent' : 'current'
  
  const resp = await currentRoutinesStore.create(routine)

  // if (resp.status === 201) {
  //   toaster('ok')
  // }
}

const updateRoutine = async (routine: CurrentRoutine) => {
  const resp = await currentRoutinesStore.update(routine.id, routine.title, routine.done)

  // if (resp.status === 200) {
  //   toaster('ok')
  // }
}

const deleteRoutine = async (routineSelected: CurrentRoutine) => {
  const resp = await currentRoutinesStore.delete(routineSelected.id)

  // if (resp.status === 200) {
  //   toaster('ok')
  // }
}

const pourRecurrentRoutines = async () => {
  // push dans la bdd
  const createPromises = recurrentRoutines.value.map(createNewRoutine)
  const results = await Promise.all(createPromises)
}
</script>

<template>
  <section class="content-section" v-if="day">
    <!-- Titre -->
    <div class="flex items-center justify-between">
      <!-- <h1 class="title-h2">
        {{ day.day }} {{ months[day.month]}} {{ day.year }}
        <span>></span>
      </h1> -->
      <DayDate :day="day" @update="updateDate"/>

      <button @click="showDrawerFn" class="">
        Mes Todos
      </button>
    </div>


    <!-- Moments de la journée: morning, afternoon, night -->
    <div class="mt-10" v-for="(moment, momentIndex) in day.moments" :key="momentIndex">
      <section class="flex items-center cursor-pointer" @click="showFormFn(moment.moment)" title="Modifier">
        <Sunrise v-if="moment.moment === 'morning'" class="moment-svg border-1 border-solid border-[moment.color]" :style="{borderColor: moment.color}" />
        <Sun v-if="moment.moment === 'afternoon'" class="moment-svg border-1 border-solid" :style="{borderColor: moment.color}" />
        <Moon v-if="moment.moment === 'night'" class="moment-svg border-1 border-solid" :style="{borderColor: moment.color}" />

        <!-- Block couleur et signification -->
        <div class="flex items-start flex-col ml-3">
          <h2 class="title-h2">
            {{ moment.moment }}
            <span title="Modifier">
              <Pencil class="svg" />
            </span>
          </h2>
        
          <div class="flex items-center" v-if="moment.color">
            <!-- <div class="color-block" :class="moment.color" /> -->
            <p>
              {{ colorsData.find(color => color.color === moment.color).meaning }}
            </p>
          </div>
        </div>
      </section>

      <Transition name="slide-fade">
        <Form v-if="showForm && formSection === moment.moment" v-model="showForm" :itemId="day.id || '-1'" :moment="moment" :day="{ id: day.id || '-1', dayNumber: day.day, monthNumber: day.month, year: day.year }" @create="updateData" />
      </Transition>
      
      <p v-if="moment.content">
        {{ moment.content }}
      </p>
      <p v-else>...</p>
    </div>

    <!-- Drawer daily routine jour -->
    <Teleport to="#app">
      <Drawner v-model="showDrawer">
        <DailyCurrentRoutine :title="`Tâches du ${dayNumber(day.day, day.month, Number(day.year))} ${day.day} ${months[day.month]} ${day.year}`" :routines="currentRoutines" :asCheckBox="true" @create="createNewRoutine" @update="updateRoutine" @confirm="deleteRoutine">
          <template #cta>
            <button @click="pourRecurrentRoutines">Importer les routines récurrentes</button>
          </template>
        </DailyCurrentRoutine>
      </Drawner>
    </Teleport>
  </section>
</template>

<style scoped lang="scss">
.content-section {
  width: 100%;
  position: relative;
  // @media (min-width: 960px) {
  // }
}

.color-block {
  min-width: 20px;
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.moment-svg {
  width: 70px;
  height: 70px;
  padding: var(--padding);
  background-color: #ece7f3;
  border-radius: 16px;
}
</style>