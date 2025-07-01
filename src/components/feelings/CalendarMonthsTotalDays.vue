<script setup lang="ts">
import { useDaysInMonth, useCurrentDate } from '@/composables/useDate'

const props = defineProps<{
  month: number,
  yearNumber: number,
}>()

const totalMonthDays = computed(() => useDaysInMonth(props.month, props.yearNumber) )

const getStartWeekDayIndex = (month: number, year: number): number => {
  // En JS : 0 = dimanche, 1 = lundi, ..., 6 = samedi
  // On veut commencer à lundi donc on remappe dimanche (0) à 6, le reste -1
  const jsDay = new Date(year, month, 1).getDay() // jour du 1er jour du mois
  return (jsDay + 6) % 7 // 0 (lundi), ..., 6 (dimanche)
}

const totalMonthDaysAdjusted = computed(() => {
  const daysInMonth = totalMonthDays.value
  const blanks = getStartWeekDayIndex(props.month, props.yearNumber)
  // Ajoute N valeurs null en début, puis 1...daysInMonth
  return [
    ...Array(blanks).fill(0),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ]
})
</script>

<template>
  <ul class="day-list">
    <li
      v-for="(date, dayIndex) of totalMonthDaysAdjusted" :key="dayIndex"
      class="day-item relative"
      :class="{'md:border-1 md:border-dashed md:border-red-300': date === useCurrentDate, 'cursor-pointer' : date !== 0}"
    >
      <slot name="item" :date="date" />

      <slot :date="date" />
    </li>
  </ul>
</template>

<style scoped lang="scss">
.day-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-10);
  margin-top: 50px;
  width: 100%;
  
  @media (min-width: 960px) {
    max-width: 85%;
  }
}
.day-item {
  display: flex;
  // justify-content: center;
  // align-items: center;
  // flex-wrap: wrap;
  width: 11%;
  height: 35px;
  // cursor: pointer;
  position: relative;

  @media (min-width: 768px) {
    height: 80px;
  }

  @media (min-width: 960px) {
    width: 13%;
    height: 80px;
    // background-color: #fff;
  }

  // &_day {
  //   width: 100%;
  //   height: 100%;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   font-size: 12px;
  // }
}
</style>