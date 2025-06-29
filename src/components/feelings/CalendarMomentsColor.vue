<script setup lang="ts">
import { useMonthNumber } from '@/composables/useDate'
import { useDayNoteStore } from '@/stores/dayNoteStore'
import { DayNote } from '@/types/DayNote'

const props = defineProps<{
  date: number,
  month: string,
  year: number,
}>()

const store = useDayNoteStore()
store.loadDayNotes()

const data = computed((): DayNote[] => {
  const itemsFound = store.dayNoteItems.filter(item => {
    if (item.month === useMonthNumber(props.month) && item.year === props.year && item.date === props.date) {
      return item
    }
  })
  return itemsFound
})

</script>

<template>
  <ul class="item_color-container" v-for="(day, dayIndex) in data" :key="dayIndex" v-show="day.date === date">
    <li
      v-for="moment in day.moments"
      :key="moment.moment"
      class="item_color-block"
      :class="[
        '--' + moment.moment, // --morning, --afternoon, --night (pour cibler via CSS si besoin)
        'item_' + moment.moment + '-block', // item_morning-block
        moment.color // yellow, orange, etc.
      ]"
    />
  </ul>
</template>

<style scoped lang="scss">
// block de couleur
.item_color-container {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: 2;

  @media (min-width: 960px) {
    display: block;
    width: 3px;
    height: 100%;
    left: 0;
    top: 0;
  }
}
.item_color-block {
  width: 100%;
  height: 1px;

  @media (min-width: 960px) {
    height: 33%;
  }
}
</style>