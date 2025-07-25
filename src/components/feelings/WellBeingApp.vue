<script setup lang="ts">
import CalendarMonthsTotalDays from '@/components/feelings/CalendarMonthsTotalDays.vue'
import DailyRecurrentRoutine from '@/components/feelings/DailyRecurrentRoutine.vue'
import CalendarMomentsColor from '@/components/feelings/CalendarMomentsColor.vue'
import DailyCurrentRoutine from '@/components/feelings/DailyCurrentRoutine.vue'
import MonthTendence from '@/components/feelings/MonthTendence.vue'
import ColorsMeaning from '@/components/feelings/ColorsMeaning.vue'
import DailyDayName from '@/components/feelings/DailyDayName.vue'
import DailyMoments from '@/components/feelings/DailyMoments.vue'
import MonthGoal from '@/components/feelings/MonthGoal.vue'
import MonthName from '@/components/feelings/MonthName.vue'
import BackButton from '@/components/utils/BackButton.vue'
import Drawner from '@/components/utils/Drawer.vue'
// import Popin from '@/components/utils/Popin.vue'
import { useMonthName, useMonthNumber, useCurrentDay, useDayNumber, useCurrentDate, useCurrentMonth, useCurrentYear } from '@/composables/useDate'
import { useEmoji } from '@/composables/useEmoji'
import { useRecurrentRoutineStore } from '@/stores/recurrentRoutineStore'
import { useCurrentRoutineStore } from '@/stores/currentRoutineStore'
import { useDayNoteStore } from '@/stores/dayNoteStore'
import { RecurrentRoutine } from '@/types/RecurrentRoutine'
import DailyTasksRemaining from './DailyTasksRemaining.vue'
import { CurrentRoutine } from '@/types/CurrentRoutine'
import { DayNote } from '@/types/DayNote'
import { Day } from '@/types/Day'
import { FormQuestion } from '@/types/FormQuestion'
import StepForm from '@/components/utils/StepForm.vue'
import MonthGoalTags from './MonthGoalTags.vue'


const currentRoutinesStore = useCurrentRoutineStore()
currentRoutinesStore.loadRoutines()
const recurrentRoutinesStore = useRecurrentRoutineStore()
recurrentRoutinesStore.loadRoutines()
const recurrentRoutines = computed((): RecurrentRoutine[] => recurrentRoutinesStore.items)

const noteStore = useDayNoteStore()
noteStore.loadDayNotes()

const showRecurrentDrawer = ref<boolean>(false)
const showRecurrentDrawerFn = () => {
  showRecurrentDrawer.value = !showRecurrentDrawer.value
}

const showCurrentDrawer = ref<boolean>(false)
const showCurrentDrawerFn = () => {
  showCurrentDrawer.value = !showCurrentDrawer.value
}

const route = useRoute()
// const router = useRouter()
const routeMonth = computed(() => route.params.month as string)
const routeMonthNumber = computed((): number  => useMonthNumber(routeMonth.value))
const routeYear = computed(() => route.params.year as string)
const routeYearNumber = computed(() => Number(routeYear.value))

// retourne uniquement les routines du mois affiché
const currentMonthlyRoutines = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(routine => routine.month === routeMonthNumber.value && routine.year === routeYearNumber.value) )
const currentDailyRoutines = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(routine => routine.date === daySelected.value.date && routine.month === routeMonthNumber.value && routine.year === routeYearNumber.value) )

const daySelected = ref<Day>()
const showPopin = ref<boolean>(false)

const emojiValueMap = new Map<string, number>(
  useEmoji.map(({ icon, value }) => [icon, value])
)
const dayEmojisStats = computed(() => {
  let totalPositive = 0
  let totalNegative = 0
  let totalNeutre = 0

  dayEmojisByDate.value.forEach((emoji) => {
    const value = emojiValueMap.get(emoji) ?? 0
    if (value > 0) totalPositive++
    else if (value < 0) totalNegative++
    else totalNeutre++
  })

  return { totalPositive, totalNegative, totalNeutre }
})

// regroupement des jours +, -, neutre
const dayGroupedByMood = computed(() => {
  const positiveDays: number[] = []
  const neutralDays: number[] = []
  const negativeDays: number[] = []

  dayEmojisByDate.value.forEach((emoji, day) => {
    const value = emojiValueMap.get(emoji) ?? 0

    if (value > 0) positiveDays.push(day)
    else if (value < 0) negativeDays.push(day)
    else neutralDays.push(day)
  })

  return {
    positiveDays,
    neutralDays,
    negativeDays
  }
})

const momentStats = computed(() => {
  const result = {
    morning: { positive: [], neutral: [], negative: [] },
    afternoon: { positive: [], neutral: [], negative: [] },
    night: { positive: [], neutral: [], negative: [] }
  }

  noteStore.dayNoteItems.forEach(item => {
    if (
      item.month === useMonthNumber(routeMonth.value) &&
      item.year === routeYearNumber.value
    ) {
      item.moments.forEach(moment => {
        const point = moment.colorPoint
        const day = item.date
        const momentKey = moment.moment as 'morning' | 'afternoon' | 'night'

        if (typeof point !== 'number') return

        if (point > 0) {
          result[momentKey].positive.push(day)
        } else if (point < 0) {
          result[momentKey].negative.push(day)
        } else {
          result[momentKey].neutral.push(day)
        }
      })
    }
  })

  // const formatted = {} as Record<string, Record<'positive' | 'neutral' | 'negative', { number: number, days: number[] }>>

  // for (const moment of ['morning', 'afternoon', 'night']) {
  //   formatted[moment] = {
  //     positive: { number: result[moment].positive.length, days: result[moment].positive },
  //     neutral: { number: result[moment].neutral.length, days: result[moment].neutral },
  //     negative: { number: result[moment].negative.length, days: result[moment].negative }
  //   }
  // }

  // return formatted

  return {
    morning: {
      positive: {
        number: result.morning.positive.length,
        days: result.morning.positive
      },
      negative: {
        number: result.morning.negative.length,
        days: result.morning.negative
      },
      neutral: {
        number: result.morning.neutral.length,
        days: result.morning.neutral
      }
    },
    afternoon: {
      positive: {
        number: result.afternoon.positive.length,
        days: result.afternoon.positive
      },
      negative: {
        number: result.afternoon.negative.length,
        days: result.afternoon.negative
      },
      neutral: {
        number: result.afternoon.neutral.length,
        days: result.afternoon.neutral
      }
    },
    night: {
      positive: {
        number: result.night.positive.length,
        days: result.night.positive
      },
      negative: {
        number: result.night.negative.length,
        days: result.night.negative
      },
      neutral: {
        number: result.night.neutral.length,
        days: result.night.neutral
      }
    }
  }
})


// calcule les points de la journée en fonction de l'humeur et retourne l'émoji associé
const dayEmojisByDate = computed(() => {
  const result = new Map<number, string>()

  noteStore.dayNoteItems.forEach((item: DayNote) => {
    if (item.month === useMonthNumber(routeMonth.value) && item.year === routeYearNumber.value) {
      let colorCount = 0
      let asColorPoints = false

      item.moments.forEach(moment => {
        if (typeof moment?.colorPoint === 'number') {
          colorCount += moment.colorPoint
          asColorPoints = true
        }
      })

      if (asColorPoints) {
        const emoji = useEmoji.find(e => e.value === colorCount)?.icon
        if (emoji) result.set(item.date, emoji)
      }
    }
  })

  return result
})



// let colorMonthCount = ref(0)
// let daysHumor = ref([])
// const totalDays = 31
// // calcule les points de la journée en fonction de l'humeur et retourne l'émoji associé
// const dayPointsCount = (dayNumber: number): {date: Number, icon: string} | null => {
//   console.log(dayNumber);
//   const itemsFound = noteStore.dayNoteItems.find(item => {
//     if (item.month === useMonthNumber(routeMonth.value) && item.year === routeYearNumber.value && item.date === dayNumber) {
//       return item
//     }
//   })

//   let itemDate = 0
//   let colorCount = 0
//   let asColorPoints = false

//   if (!itemsFound) return

//   itemsFound?.moments.map(moment => {
//     if (moment?.colorPoint) {
//       colorCount += moment?.colorPoint
//       itemDate = itemsFound.date
      
//       colorMonthCount.value += moment?.colorPoint
//       asColorPoints = true
//     }
//   })

//   asColorPoints ? daysHumor.value.push({
//     date: itemDate,
//     icon: useEmoji.find(emoji => emoji.value === colorCount).icon
//   }) : null
// }
// for(let dayNumber = 1; dayNumber <= totalDays; dayNumber++) {
//   dayPointsCount(dayNumber)
// }



const showPopinFn = ():void => {
  showPopin.value = !showPopin.value
}

const openPopin = (date: number, month: number, year: number):void => {
  showPopinFn() 

  // router.push({ path: `/well-being-app/${useMonthName(useCurrentMonth)}/${useCurrentYear}/${date}` })

  daySelected.value = {
    id: null,
    date,
    month,
    year
  }
}

const openCurrentRoutine = (date: number, month: number, year: number):void => {
  showCurrentDrawerFn()
  updateDailyDate({ date, month, year })
}

const updateDailyDate = async (dateUpdated: { date: number, month: number, year: number }) => {
  daySelected.value = {
    id: null,
    date: dateUpdated.date,
    month: dateUpdated.month,
    year: dateUpdated.year
  }
}

// CRUD RECURRENT STORE
const createNewRoutine = async (routine: RecurrentRoutine) => {
  const resp = await recurrentRoutinesStore.create(routine.title)

  // if (resp.status === 201) {
  //   toaster('ok')
  // }
}

const updateRoutine = async (routine: RecurrentRoutine) => {
  const resp = await recurrentRoutinesStore.update(routine.id, routine.title, routine.done)

  // if (resp.status === 200) {
  //   toaster('ok')
  // }
}

const deleteRoutine = async (routineSelected: RecurrentRoutine) => {
  const resp = await recurrentRoutinesStore.delete(routineSelected.id)

  // if (resp.status === 200) {
  //   toaster('ok')
  // }
}

const time = computed(() => {
  let hour = ref()
  let minutes = ref()
  let secondes = ref()
  setInterval(() => {
    hour.value = new Date().getHours()
    minutes.value = new Date().getMinutes()
    secondes.value = new Date().getSeconds()
    
  }, 1000)

  return { hour, minutes, secondes }
})
</script>

<template>
  <!-- calendrier mensuel avec les 31 jours -->
  <!-- Chaque jour sera coloré en rouge (triste), vert (jour positif, paix) et blanc (neutre). Potentiellement jaune (joie), dégouté (marron), orange (mitigé) et bleu (espoir), violet (magie, créativité, indépendance, détermination) à voir. -->
  <!-- Possibilité de scindé le jour en matinée / après midi, soir + 1 couleur générale (par ex jour vert)-->
  <!-- Possibilité de rajouter une note spécifique pour chaque section matin/soir/jours -->
  <!-- Un bloc de couleur s'affichera à la fin du mois prenant en compte l'ensemble des couleurs pour en faire une couleur du mois -->
  <!-- proposer les couleurs primaires avec un nuancier pour rendre la couleur plus vive ou moins vive selon l'intensité du ressenti : jaune clair, rouge vif, bleu clair etc. -->
  <!-- Chaque mois sera accessible -->
  <!-- Un calcule des couleurs s'affichent avec le pourcentage pour chaque couleur -->
  <!-- 3 pictos par moments : matin: levé de soleil / nuageux, midi: gros soleil / nuageux, soir : demie lune + étoile / nuageux -->
  <!-- Passer les routines done en fin de liste -->
   <div class="month-container" :class="{fade : showPopin}">
    <BackButton routeName="year" :btnText="'Retour'" />
    
    <button @click="showRecurrentDrawerFn" class="">
      Créer des tâches récurrentes
    </button>

    <span>
      {{ time.hour }}:{{ time.minutes }}:{{ time.secondes }}
    </span>
    <!-- 
    <p>{{ dayEmojisStats }}</p>
    <p>{{ dayGroupedByMood }}</p>
    <p>
      {{ momentStats }}
    </p> -->

    <!-- Faire une analyse des données dayGroupedByMood au niveau : Pairs/Impairs, Nombres premiers, Suite de fibonacci, numérologie ?, cycle circasptan,cycles astrologiques ? -->

    <MonthName :routeMonth="routeMonth" :routeYear="routeYearNumber" />

    <!-- Tâches restantes  -->
    <DailyTasksRemaining :actifMonth="routeMonth" :actifMonthNumber="routeMonthNumber" :actifYear="routeYearNumber" @openpopin="openCurrentRoutine"/>

    <MonthTendence :month="routeMonth" :year="routeYearNumber" />
      
    <MonthGoal :routeMonthNumber="routeMonthNumber" :routeYear="routeYearNumber" />
    <!-- <MonthGoalTags :routeMonthNumber="routeMonthNumber" :routeYear="routeYearNumber" /> -->
    
    <!-- Calendrier -->
     <div class="md:flex md:justify-between md:gap-10">
      <CalendarMonthsTotalDays :month="routeMonthNumber" :yearNumber="routeYearNumber">
        <template v-slot:item="slotProps">
          <!-- <div v-if="(routeMonthNumber < useCurrentMonth || (slotProps.date < useCurrentDate && routeMonthNumber === useCurrentMonth))" class="day_finished right hidden md:block" />
          <div v-if="(routeMonthNumber < useCurrentMonth || (slotProps.date < useCurrentDate && routeMonthNumber === useCurrentMonth))" class="day_finished left hidden md:block" /> -->
          <div class="day_number-bg ">
            <div
              v-if="slotProps.date"
              class="day_number-wrapper"
              :class=" (
                routeYearNumber < useCurrentYear // pour toutes les années précédentes
                || (routeYearNumber <= useCurrentYear && routeMonthNumber < useCurrentMonth) // pour mois précédent au mois en cours
                || (routeYearNumber <= useCurrentYear && slotProps.date < useCurrentDate && routeMonthNumber === useCurrentMonth) // pour les jours du mois en cours
              )
              ? 'opacity-50'
              : 'bg-white/20 md:border-2 md:border-white md:border-solid'"
              @click="openPopin(slotProps.date, routeMonthNumber, routeYearNumber)" 
            >
              <p
                class="day_number"
              >
                <span class="hidden md:inline-block">
                  {{ useDayNumber(slotProps.date, routeMonthNumber, routeYearNumber) }}
                </span>
                
                {{ slotProps.date }}

                <span class="hidden md:block md:text-xl">
                  {{ dayEmojisByDate.get(slotProps.date) ?? '' }}
                </span>
              </p>

              <!-- affichage des tâches (todos) créées uniquement pour les jours associés -->
              <div class="has-tasks flex max-w-[100%] right-0 absolute bottom-1 lg:bottom-3 lg:right-1 overflow-hidden">
                <div v-for="task in currentMonthlyRoutines.filter((item) => item.date === slotProps.date )" :key="task.id">
                  <div
                    class="bg-blue-500 w-1 h-1 lg:w-2 lg:h-2 rounded-[50%] ml-[1px]"
                    :class="[
                      {
                        'opacity-[0.5]' : (
                          routeMonthNumber < useCurrentMonth
                          || (slotProps.date < useCurrentDate && routeMonthNumber === useCurrentMonth)
                        )
                      },
                      { 'bg-red-500' : !task.done }
                    ]"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-slot="slotProps">
          <CalendarMomentsColor :month="routeMonth" :year="routeYearNumber" :date="slotProps.date" />
        </template>
      </CalendarMonthsTotalDays>

      <ColorsMeaning />
    </div>

    <Drawner v-model="showRecurrentDrawer">
      <DailyRecurrentRoutine
        :title="'Routines récurrentes'"
        :routines="recurrentRoutines"
        @create="createNewRoutine"
        @update="updateRoutine"
        @confirm="deleteRoutine"
      />
    </Drawner>
  </div>

  <!-- <Transition name="slide-fade">
    <Popin v-if="showPopin" v-model="showPopin">
      <div class="popin-content">
        <DailyMoments :daySelected="daySelected"/>
      </div>
    </Popin>
  </Transition> -->
  
  <!-- Daily moments -->
  <Teleport to="#app">
    <Drawner v-model="showPopin">
      <div class="popin-content">
        <DailyMoments v-if="showPopin" :daySelected="daySelected"/>
      </div>
    </Drawner>
  </Teleport>
  
  <!-- Current Routines -->
  <Teleport to="#app">
    <Drawner v-model="showCurrentDrawer">
      <DailyCurrentRoutine
        v-if="showCurrentDrawer"
        title="Tâche du :"
        :daySelected="daySelected"
        :routines="currentDailyRoutines"
        :asCheckBox="true"
        >
        <template #title>
          <h2 class="title-h2">
            <DailyDayName :daySelected="daySelected" @update="updateDailyDate"/>
          </h2>
        </template>
      </DailyCurrentRoutine>
    </Drawner>
  </Teleport>
</template>

<style scoped lang="scss">
.popin-content {
  width: 100%;
}

.month-container {
  transition: .2s;

  &.fade {
    opacity: .7;
    color: #aab0b2; //bdc3c5
  }
}

.day_number-bg {
  width: 100%;
}

.day_number-wrapper {
  width: 100%;
  height: 100%;
  // background-color: rgba(255, 255, 255, 0.3);

  @media (min-width: 960px) {
  }
}

.day_number {
  width: 100%;
  padding-right: 5px;
  font-size: 12px;
  text-align: right;
  position: absolute;
}

.day_finished {
  width: 70%;
  height: 70%;
  border-left: 1px solid;
  border-bottom: 1px solid;
  position: absolute;
  z-index: 3;

  &.right {
    top: 63%;
    right: -35%;
    transform: rotate(45deg) translate(-50%, -50%);
    border-color: rgba(0, 0, 0, 0.08);
  }
  &.left {
    top: 15%;
    left: -33%;
    transform: rotate(-135deg);
    border-color: rgba(255, 0, 0, 0.08);
  }
}
</style>