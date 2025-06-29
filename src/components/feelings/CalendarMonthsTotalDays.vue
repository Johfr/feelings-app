<script setup lang="ts">
import { useDaysInMonth, useCurrentDate, useMonthNumber, usePreviousNextMonth } from '@/composables/useDate'

const props = defineProps<{
  month: number,
  yearNumber: number,
}>()

const totalMonthDays = computed(() => useDaysInMonth(props.month, props.yearNumber) )
</script>

<template>
  <ul class="day-list">
    <li
      v-for="(date, dayIndex) of totalMonthDays" :key="dayIndex"
      class="day-item relative"
      :class="{'md:border-1 md:border-dashed md:border-red-300': date === useCurrentDate}"
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
  
  @media (min-width: 960px) {
    width: 100%;
    max-width: 85%;
  }
}
.day-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 11%;
  height: 35px;
  cursor: pointer;
  position: relative;

  @media (min-width: 960px) {
    width: 13%;
    height: 80px;
    background-color: #fff;
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