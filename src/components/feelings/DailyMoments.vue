<script setup lang="ts">
import Pencil from '@/assets/svg/pencil.svg?component'
import Sunrise from '@/assets/svg/sunrise.svg?component'
import Moon from '@/assets/svg/moon.svg?component'
import Sun from '@/assets/svg/sun.svg?component'
import Drawner from '@/components/utils/Drawer.vue'
import DailyCurrentRoutine from '@/components/feelings/DailyCurrentRoutine.vue'
import Form from '@/components/utils/Form.vue'
import DailyDayName from '@/components/feelings/DailyDayName.vue'
import { useDays, useDayNumber, useMonths, useMonthNumber, useCurrentDay, useCurrentMonth } from '@/composables/useDate'
import { useColorStore } from '@/stores/colorStore'
import { useDayNoteStore } from '@/stores/dayNoteStore'
import { useCurrentRoutineStore } from '@/stores/currentRoutineStore'
import { useRecurrentRoutineStore } from '@/stores/recurrentRoutineStore'
import { Colors } from '@/types/Colors'
import { Day } from '@/types/Day'
import { DayNote } from '@/types/DayNote'
import { CurrentRoutine } from '@/types/CurrentRoutine'
import { RecurrentRoutine } from '@/types/RecurrentRoutine'

const currentRoutinesStore = useCurrentRoutineStore()
currentRoutinesStore.loadRoutines()

const recurrentRoutinesStore = useRecurrentRoutineStore()
recurrentRoutinesStore.loadRoutines()

const props = defineProps<{
  daySelected: Day
}>()

const day = ref<DayNote>()

const findDayNote = async (daySelected: Day) => await useDayNoteStore().findOne(daySelected).then((dayNoteFind: DayNote) => {
  if (dayNoteFind) {
    day.value = dayNoteFind    
  }
  else {
    day.value =  {
      id: daySelected.id,
      date: daySelected.date,
      month: daySelected.month,
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

onMounted(() => findDayNote(props.daySelected))

const currentRoutines = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(item => item.date === day.value.date && item.month === day.value.month && item.year === day.value.year ))
const recurrentRoutines = computed((): RecurrentRoutine[] => recurrentRoutinesStore.items)

const store = useColorStore()
store.loadColors()
const colorsData = computed((): Colors[] => store.colorItems)

const dateSelected = ref<Day>(props.daySelected)

const updateDailyDate = async (dateUpdated: { date: number, month: number, year: number }) => {
  dateSelected.value = {
    id: null,
    date: dateUpdated.date,
    month: dateUpdated.month,
    year: dateUpdated.year
  }

  // await findDayNote({ id: null, date: dateUpdated.date, month: day.value.month, year: day.value.year })
  findDayNote(dateSelected.value)
}

// mets à jour le contenu de la popin après un create
const updateData = async () => {
  await findDayNote(dateSelected.value)
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
  routine.date = day.value.date
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
  const resp = await currentRoutinesStore.update(routine)

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

const deletMultipleRoutine = async (routinesSelected: CurrentRoutine[]) => {
  const ids = routinesSelected.map(item => item.id)
  const createPromises = routinesSelected.map(deleteRoutine)
  await Promise.all(createPromises)

  // retire les items côté front uniquement à la fin des requêtes asynchrones pour éviter un bug au niveau des index du tableau lors de la suppression successive
  currentRoutinesStore.removeRoutinesByIds(ids)
}

const pourRecurrentRoutines = async () => {
  // push dans la bdd
  const createPromises = recurrentRoutines.value.map(createNewRoutine)
  const results = await Promise.all(createPromises)
}
</script>

<template>
  <section class="content-section" v-if="day">
    <!-- Entête -->
    <!-- <div class="xl:flex xl:items-center xl:justify-between"> -->
    <DailyDayName :day="day" @update="updateDailyDate"/>

    <button @click="showDrawerFn" class="">
      {{ currentRoutines.length }} Tâche(s) pour ce jour
    </button>
    <!-- </div> -->

    <!-- Moments de la journée colorés: morning, afternoon, night -->
    <div class="mt-10" v-for="(moment, momentIndex) in day.moments" :key="momentIndex">
      <section class="flex items-center cursor-pointer" @click="showFormFn(moment.moment)" title="Modifier">
        <Sunrise v-if="moment.moment === 'morning'" class="moment-svg morning border-1 border-solid border-[moment.color]" :style="{borderColor: moment.color}" />
        <Sun v-if="moment.moment === 'afternoon'" class="moment-svg afternoon border-1 border-solid" :style="{borderColor: moment.color}" />
        <Moon v-if="moment.moment === 'night'" class="moment-svg night border-1 border-solid" :style="{borderColor: moment.color}" />

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

      <Teleport to=".popin-content">
        <Transition name="slide-fade">
          <Form v-if="showForm && formSection === moment.moment" v-model="showForm" :itemId="day.id || '-1'" :moment="moment" :day="{ id: day.id || '-1', date: day.date, month: day.month, year: day.year }" @create="updateData" />
        </Transition>
      </Teleport>
      <p v-if="moment.content">
        {{ moment.content }}
      </p>
      <p v-else>...</p>
    </div>

    <!-- Drawer daily routine jour -->
    <Teleport to="#app">
      <Drawner v-model="showDrawer">
        <DailyCurrentRoutine
          v-if="showDrawer"
          title="Tâche du :"
          :routines="currentRoutines"
          :asCheckBox="true"
          @create="createNewRoutine"
          @update="updateRoutine"
          @confirm="deleteRoutine"
          @confirmMultiple="deletMultipleRoutine"
        >
          <template #title>
            <h2 class="title-h2">
              <!-- {{ `Tâches du ${useDayNumber(day.date, day.month, Number(day.year))} ${day.date} ${useMonths[day.month]} ${day.year}` }} -->
              <DailyDayName :day="day" @update="updateDailyDate"/>
            </h2>
          </template>
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
}

.color-block {
  min-width: 20px;
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.moment-svg {
  width: 50px;
  height: 50px;
  padding: 10px;
  background-color: #ece7f3;
  border-radius: 16px;

  &.morning {
    background-color: dodgerblue; //blue
    fill: #fff;
  }
  &.afternoon {
    background-color: yellow;
    fill: #000; // defaut: none
    stroke: #000;
  }
  &.night {
    background-color: darkblue;
    fill: #fff; // defaut: none
  }
  
  @media (min-width: 960px) {
    width: 60px;
    height: 60px;
    padding: var(--padding);
  }
}
</style>