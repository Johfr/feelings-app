<script setup lang="ts">
import { useDaysInMonth, useCurrentDate, useCurrentMonth, useCurrentYear } from '@/composables/useDate'

const props = defineProps<{
  month: number,
  yearNumber: number,
}>()

const route = useRoute()

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
  <section class="w-[100%] md:max-w-[85%] mt-[50px]">
    <h3 v-if="route.params.month" class="title-h3 mb-5">Calendar reference</h3>
    <ul class="day-list">
      <li
        v-for="(date, dayIndex) of totalMonthDaysAdjusted" :key="dayIndex"
        class="day-item relative"
        :class="{'md:border-1 md:border-dashed md:border-red-500': date === useCurrentDate && month === useCurrentMonth && yearNumber === useCurrentYear, 'cursor-pointer' : date !== 0}"
      >
        <slot name="item" :date="date" />

        <slot :date="date" />
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.day-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-10);
}
.day-item {
  display: flex;
  width: 11%;
  height: 35px;
  position: relative;

  @media (min-width: 768px) {
    height: 80px;
    width: 12%;
  }
}
</style>