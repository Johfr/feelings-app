<script setup lang="ts">
import Popin from '@/components/utils/Popin.vue'
import BackButton from '@/components/utils/BackButton.vue'
import MonthsTotalDays from '@/components/MonthsTotalDays.vue'
import DayMoments from '@/components/DayMoments.vue'
import MonthColorsRatio from '@/components/MonthColorsRatio.vue'
import ColorsMeaning from '@/components/ColorsMeaning.vue'
import Content from '@/components/Content.vue'
import { monthNumber, previousNextMonth } from '@/composables/UseDate'
import { useTodoStore } from '@/stores/todoStore'
import { Day } from '@/types/Day'
import MonthGoal from './MonthGoal.vue'
import MonthName from './MonthName.vue'

const store = useTodoStore()
store.loadTodos()

const route = useRoute()
// const router = useRouter()
const routeMonth = computed(() => route.params.month as string)
const routeYear = computed(() => route.params.year as string)
const routeYearNumber = Number(routeYear.value)
const routeMonthNumber = computed(() => monthNumber(routeMonth.value))
const currentDay = new Date().getDate()
const currentMonth = new Date().getMonth()

const daySelected = ref<Day>()
const showPopin = ref<boolean>(false)

const showPopinFn = (dayNumber: number):void => {
  showPopin.value = !showPopin.value
  daySelected.value = {
    dayNumber: dayNumber,
    monthNumber: monthNumber(routeMonth.value),
    year: routeYear.value,
  }
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
   <div class="month-container" :class="{fade : showPopin}">
    <BackButton routeName="year" :btnText="'Retour'" />

    <MonthName :routeMonth="routeMonth" :routeYear="routeYear" />

    <MonthColorsRatio :month="routeMonth" :year="routeYear" />

    <MonthGoal :routeMonthNumber="routeMonthNumber" :routeYear="routeYearNumber" />
    
    <MonthsTotalDays :month="routeMonth" :yearNumber="routeYear">
      <template v-slot:item="slotProps">
        <div v-if="(routeMonthNumber < currentMonth || (slotProps.dayNumber < currentDay && routeMonthNumber === currentMonth))" class="day_finished right" />
        <div v-if="(routeMonthNumber < currentMonth || (slotProps.dayNumber < currentDay && routeMonthNumber === currentMonth))" class="day_finished left" />

        <p class="day_number" @click="showPopinFn(slotProps.dayNumber)">
          {{ slotProps.dayNumber }}
        </p>
      </template>
      <template v-slot="slotProps">
        <DayMoments :month="routeMonth" :year="routeYear" :dayNumber="slotProps.dayNumber" />
      </template>
    </MonthsTotalDays>

    <ColorsMeaning />
  </div>

  <Transition name="slide-fade">
    <Popin v-if="showPopin" v-model="showPopin">
      <div class="popin-content">
        <Content :daySelected="daySelected"/>
      </div>
    </Popin>
  </Transition>
</template>

<style scoped lang="scss">
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