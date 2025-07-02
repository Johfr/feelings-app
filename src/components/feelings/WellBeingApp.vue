<script setup lang="ts">
import CalendarMonthsTotalDays from '@/components/feelings/CalendarMonthsTotalDays.vue'
import CalendarMomentsColor from '@/components/feelings/CalendarMomentsColor.vue'
import MonthTendence from '@/components/feelings/MonthTendence.vue'
import ColorsMeaning from '@/components/feelings/ColorsMeaning.vue'
import DailyMoments from '@/components/feelings/DailyMoments.vue'
import MonthGoal from '@/components/feelings/MonthGoal.vue'
import MonthName from '@/components/feelings/MonthName.vue'
import DailyRecurrentRoutine from '@/components/feelings/DailyRecurrentRoutine.vue'
import Drawner from '@/components/utils/Drawer.vue'
// import Popin from '@/components/utils/Popin.vue'
import BackButton from '@/components/utils/BackButton.vue'
import { useMonthName, useMonthNumber, useCurrentDay, useDayNumber, useCurrentDate, useCurrentMonth, useCurrentYear } from '@/composables/useDate'
import { useDayNoteStore } from '@/stores/dayNoteStore'
import { Day } from '@/types/Day'
import { RecurrentRoutine } from '@/types/RecurrentRoutine'
import { useRecurrentRoutineStore } from '@/stores/recurrentRoutineStore'
import { useCurrentRoutineStore } from '@/stores/currentRoutineStore'
import { CurrentRoutine } from '@/types/CurrentRoutine'
import DailyTasksRemaining from './DailyTasksRemaining.vue'

const currentRoutinesStore = useCurrentRoutineStore()
currentRoutinesStore.loadRoutines()
const recurrentRoutinesStore = useRecurrentRoutineStore()
recurrentRoutinesStore.loadRoutines()
const recurrentRoutines = computed((): RecurrentRoutine[] => recurrentRoutinesStore.items)

const noteStore = useDayNoteStore()
noteStore.loadDayNotes()

const showDrawer = ref<boolean>(false)
const showDrawerFn = () => {
  showDrawer.value = !showDrawer.value
}

const route = useRoute()
// const router = useRouter()
const routeMonth = computed(() => route.params.month as string)
const routeMonthNumber = computed((): number  => useMonthNumber(routeMonth.value))
const routeYear = computed(() => route.params.year as string)
const routeYearNumber = computed(() => Number(routeYear.value))

// retourne uniquement les routines du mois affiché
const currentRoutines = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(routine => routine.month === routeMonthNumber.value && routine.year === routeYearNumber.value) )

const daySelected = ref<Day>()
const showPopin = ref<boolean>(false)

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
    <button @click="showDrawerFn" class="">
      Créer des tâches récurrentes
    </button>
    
    <MonthName :routeMonth="routeMonth" :routeYear="routeYearNumber" />

    <!-- Tâches restantes  -->
    <DailyTasksRemaining @openpopin="openPopin"/>

    <MonthTendence :month="routeMonth" :year="routeYearNumber" />

    <MonthGoal :routeMonthNumber="routeMonthNumber" :routeYear="routeYearNumber" />
    
    <!-- Calendrier -->
     <div class="md:flex md:justify-between md:gap-10">
      <CalendarMonthsTotalDays :month="routeMonthNumber" :yearNumber="routeYearNumber">
        <template v-slot:item="slotProps">
          <!-- <div v-if="(routeMonthNumber < useCurrentMonth || (slotProps.date < useCurrentDate && routeMonthNumber === useCurrentMonth))" class="day_finished right hidden md:block" />
          <div v-if="(routeMonthNumber < useCurrentMonth || (slotProps.date < useCurrentDate && routeMonthNumber === useCurrentMonth))" class="day_finished left hidden md:block" /> -->
          <div
            v-if="slotProps.date"
            class="day_number-wrapper"
            :class=" (
              routeYearNumber < useCurrentYear // pour toutes les années précédentes
              || (routeYearNumber <= useCurrentYear && routeMonthNumber < useCurrentMonth) // pour mois précédent au mois en cours
              || (routeYearNumber <= useCurrentYear && slotProps.date < useCurrentDate && routeMonthNumber === useCurrentMonth) // pour les jours du mois en cours
            )
            ? 'text-[#aab0b2] bg-[#ffffff8c]'
            : 'bg-white'"
            @click="openPopin(slotProps.date, routeMonthNumber, routeYearNumber)" 
          >
            <p
              class="day_number"
            >
              <span class="hidden md:inline-block">
                {{ useDayNumber(slotProps.date, routeMonthNumber, routeYearNumber) }}
              </span>
              {{ slotProps.date }}
            </p>

            <!-- affichage des tâches créées uniquement pour les jours associés -->
            <div class="has-tasks flex max-w-[100%] right-0 absolute bottom-1 lg:bottom-3 lg:right-1 overflow-hidden">
              <div v-for="task in currentRoutines.filter((item) => item.date === slotProps.date )" :key="task.id">
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

        </template>
        <template v-slot="slotProps">
          <CalendarMomentsColor :month="routeMonth" :year="routeYearNumber" :date="slotProps.date" />
        </template>
      </CalendarMonthsTotalDays>

      <ColorsMeaning />
    </div>

    <Drawner v-model="showDrawer">
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
.day_number-wrapper {
  width: 100%;
  
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