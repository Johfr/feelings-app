<script setup lang="ts">
import { daysInMonth, monthNumber, previousNextMonth } from '@/composables/UseDate'

const props = defineProps<{
  month: string,
  yearNumber: string,
}>()

const totalMonthDays = computed(() => daysInMonth(monthNumber(props.month), parseInt(props.yearNumber)) )
</script>

<template>
  <ul class="day-list">
    <li class="day-item relative" v-for="(dayNumber, dayIndex) of totalMonthDays" :key="dayIndex">
      <slot name="item" :dayNumber="dayNumber" />

      <slot :dayNumber="dayNumber" />
    </li>
  </ul>
</template>

<style scoped lang="scss">
.day-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-10);
}
.day-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 11%;
  height: 30px;
  cursor: pointer;
  position: relative;
  background-color: #fff;

  @media (min-width: 960px) {
    width: 100px;
    height: 100px;
    border: 1px solid #f1f1f1;
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