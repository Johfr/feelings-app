<script setup lang="ts">
import Pencil from '@/assets/svg/pencil.svg?component'
import Sunrise from '@/assets/svg/sunrise.svg?component'
import Moon from '@/assets/svg/moon.svg?component'
import Sun from '@/assets/svg/sun.svg?component'
import Drawner from '@/components/utils/Drawer.vue'
import DailyCurrentRoutine from '@/components/feelings/DailyCurrentRoutine.vue'
import DailyMomentsForm from '@/components/utils/DailyMomentsForm.vue'
import DailyDayName from '@/components/feelings/DailyDayName.vue'
import { useColorStore } from '@/stores/colorStore'
import { useDayNoteStore } from '@/stores/dayNoteStore'
import { useCurrentRoutineStore } from '@/stores/currentRoutineStore'
import { Colors } from '@/types/Colors'
import { Day } from '@/types/Day'
import { DayNote } from '@/types/DayNote'
import { CurrentRoutine } from '@/types/CurrentRoutine'

const currentRoutinesStore = useCurrentRoutineStore()
currentRoutinesStore.loadRoutines()

const props = defineProps<{
  daySelected: Day
}>()

const dayNote = ref<DayNote>()

const findDayNote = async (daySelected: Day) => await useDayNoteStore().findOne(daySelected).then((dayNoteFind: DayNote) => {
  if (dayNoteFind) {
    dayNote.value = dayNoteFind
  }
  else {
    dayNote.value =  {
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

const currentRoutines = computed((): CurrentRoutine[] =>
  currentRoutinesStore.items.filter((item: CurrentRoutine) =>
    item.date === dayNote.value.date && item.month === dayNote.value.month && item.year === dayNote.value.year
  )
)
const currentRoutinesDone = computed((): CurrentRoutine[] =>
  currentRoutines.value.filter((item: CurrentRoutine) =>
    item.done
  )
)

const allTasksDone = computed((): boolean =>
  currentRoutinesDone.value.length === currentRoutines.value.length
)

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
</script>

<template>
  <section class="content-section" v-if="dayNote">
    <!-- Entête -->
    <DailyDayName :daySelected="dateSelected" @update="updateDailyDate"/>

    
    <button @click="showDrawerFn" class="mt-2 mb-3">
      <span v-if="!allTasksDone" class="text-red-500">
        {{ currentRoutinesDone.length }} tâche(s) faite(s) / {{ currentRoutines.length }} restantes
      </span>
      <span v-else class="text-green-500 inline-block text-left">
        Félicitation ! Tu as réalisé toutes tes tâches de ta journée. Tu peux être fier de toi 💪 !
      </span>
    </button>

    <!-- Moments de la journée colorés: morning, afternoon, night -->
    <div class="mb-10" v-for="(moment, momentIndex) in dayNote.moments" :key="momentIndex">
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
            <p>
              {{ colorsData.find(color => color.color === moment.color).meaning }}
            </p>
          </div>
        </div>
      </section>
      
      <pre v-if="moment.content" class="whitespace-pre-line text-sm font-[inherit] mt-3">
        {{ moment.content }}
      </pre>
      <p v-else>...</p>

      <Teleport to=".popin-content">
        <Transition name="slide-fade">
          <DailyMomentsForm v-if="showForm && formSection === moment.moment" v-model="showForm" :itemId="dayNote.id || '-1'" :moment="moment" :day="{ id: dayNote.id || '-1', date: dayNote.date, month: dayNote.month, year: dayNote.year }" @create="updateData" />
        </Transition>
      </Teleport>
    </div>

    <!-- Drawer daily routine jour -->
    <Teleport to="#app">
      <Drawner v-model="showDrawer">
        <DailyCurrentRoutine
          v-if="showDrawer"
          title="Tâche du :"
          :daySelected="dateSelected"
          :routines="currentRoutines"
          :asCheckBox="true"
          >
          <template #title>
            <h2 class="title-h2">
              <DailyDayName :daySelected="dateSelected" @update="updateDailyDate"/>
            </h2>
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