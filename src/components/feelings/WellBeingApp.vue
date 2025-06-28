<script setup lang="ts">
import MonthsTotalDays from '@/components/feelings/MonthsTotalDays.vue'
import DayMoments from '@/components/feelings/DayMoments.vue'
import MonthColorsRatio from '@/components/feelings/MonthColorsRatio.vue'
import ColorsMeaning from '@/components/feelings/ColorsMeaning.vue'
import Content from '@/components/feelings/Content.vue'
import MonthGoal from '@/components/feelings/MonthGoal.vue'
import MonthName from '@/components/feelings/MonthName.vue'
import DailyRecurrentRoutine from '@/components/feelings/DailyRecurrentRoutine.vue'
import Drawner from '@/components/utils/Drawer.vue'
import Popin from '@/components/utils/Popin.vue'
import BackButton from '@/components/utils/BackButton.vue'
import { monthNumber, currentDay, currentDate, currentMonth, currentYear } from '@/composables/UseDate'
import { useTodoStore } from '@/stores/todoStore'
import { Day } from '@/types/Day'
import { RecurrentRoutine } from '@/types/RecurrentRoutine'
import { useRecurrentRoutineStore } from '@/stores/recurrentRoutineStore'
import { useCurrentRoutineStore } from '@/stores/currentRoutineStore'
import { CurrentRoutine } from '@/types/CurrentRoutine'

const currentRoutinesStore = useCurrentRoutineStore()
currentRoutinesStore.loadRoutines()
const recurrentRoutinesStore = useRecurrentRoutineStore()
recurrentRoutinesStore.loadRoutines()
const recurrentRoutines = computed((): RecurrentRoutine[] => recurrentRoutinesStore.items)
const currentRoutineLeft = computed((): CurrentRoutine[] => currentRoutinesStore.items.filter(routine => {
  if (routine.day === currentDate && routine.month === currentMonth && routine.year === currentYear) {
    return !routine.done
  }
})
)
// const currentRoutine = computed((): RecurrentRoutine[] => currentRoutinesStore.items)

const store = useTodoStore()
store.loadTodos()

const showDrawer = ref<boolean>(false)
const showDrawerFn = () => {
  showDrawer.value = !showDrawer.value
}

const route = useRoute()
const router = useRouter()
const routeMonth = computed(() => route.params.month as string)
const routeYear = computed(() => route.params.year as string)
const routeYearNumber = Number(routeYear.value)
const routeMonthNumber = computed((): number  => monthNumber(routeMonth.value))
const currentDailyRoutineTotal = computed((): number => currentRoutinesStore.items.filter(routine => routine.day === currentDate && routine.month === currentMonth && routine.year === routeYearNumber).length)

const daySelected = ref<Day>()
const showPopin = ref<boolean>(false)

const showPopinFn = (dayNumber: number):void => {
  showPopin.value = !showPopin.value  

  router.push({ path: `/well-being-app/${routeYear.value}/${routeMonth.value}/${dayNumber}` })

  daySelected.value = {
    id: null,
    dayNumber: dayNumber,
    monthNumber: routeMonthNumber.value,
    year: routeYearNumber
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
    <div class="mt-3 ml-2 cursor-pointer" v-if="currentDailyRoutineTotal && currentDailyRoutineTotal > 0" @click="showPopinFn(currentDate)">
      <p v-if="currentRoutineLeft.length === 0" class="text-indigo-400">
        Félicitation ! Tu as réalisé toutes tes tâches de ta journée. Tu peux être fier de toi !
      </p>
      
      <p v-else class="text-indigo-400">
        {{ currentRoutineLeft.length }} tâches restantes pour aujourd'hui. Tu peux le faire 💪
      </p>
    </div>

    <MonthColorsRatio :month="routeMonth" :year="routeYearNumber" />

    <MonthGoal :routeMonthNumber="routeMonthNumber" :routeYear="routeYearNumber" />
    
    <!-- Calendrier -->
    <MonthsTotalDays :month="routeMonthNumber" :yearNumber="routeYearNumber">
      <template v-slot:item="slotProps">
        <!-- <div v-if="(routeMonthNumber < currentMonth || (slotProps.dayNumber < currentDate && routeMonthNumber === currentMonth))" class="day_finished right" />
        <div v-if="(routeMonthNumber < currentMonth || (slotProps.dayNumber < currentDate && routeMonthNumber === currentMonth))" class="day_finished left" /> -->

        <p class="day_number" :class="{ 'opacity-[0.3]': (routeMonthNumber < currentMonth || (slotProps.dayNumber < currentDate && routeMonthNumber === currentMonth))}" @click="showPopinFn(slotProps.dayNumber)">
          {{ slotProps.dayNumber }}
        </p>
      </template>
      <template v-slot="slotProps">
        <DayMoments :month="routeMonth" :year="routeYearNumber" :dayNumber="slotProps.dayNumber" />
      </template>
    </MonthsTotalDays>

    <ColorsMeaning />

    <!-- <Teleport to="#app"> -->
    <Drawner v-model="showDrawer">
      <DailyRecurrentRoutine :title="'Routines récurrentes'" :routines="recurrentRoutines" @create="createNewRoutine" @update="updateRoutine" @confirm="deleteRoutine" />
    </Drawner>
    <!-- </Teleport> -->
  </div>

  <!-- <Transition name="slide-fade">
    <Popin v-if="showPopin" v-model="showPopin">
      <div class="popin-content">
        <Content :daySelected="daySelected"/>
      </div>
    </Popin>
  </Transition> -->
  
  <Transition name="slide-fade">
    <Teleport to="#app">
      <Drawner v-model="showPopin">
        <div class="popin-content">
          <Content v-if="showPopin" :daySelected="daySelected"/>
        </div>
      </Drawner>
    </Teleport>
  </Transition>
</template>

<style scoped lang="scss">
.popin-content {
  // display: flex;
  // align-items: center;
  width: 100%;
}

.month-container {
  transition: .2s;
  &.fade {
    opacity: .5;
  }
}

.day_number {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  position: relative;
  z-index: 2;
}
.day_finished {
  width: 70%;
  height: 70%;
  border-left: 1px solid;
  border-bottom: 1px solid;
  position: absolute;
  z-index: 0;

  &.right {
    top: 63%;
    right: -35%;
    transform: rotate(45deg) translate(-50%, -50%);
    border-color: rgba(0, 0, 0, 0.04);
  }
  &.left {
    top: 15%;
    left: -33%;
    transform: rotate(-135deg);
    border-color: rgba(255, 0, 0, 0.04);
  }
}
</style>