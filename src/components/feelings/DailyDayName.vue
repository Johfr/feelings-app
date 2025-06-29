<script setup lang="ts">
import { usePreviousNextDate } from '@/composables/useDate'
import { DayNote } from '@/types/DayNote'
import { useMonths, useMonthName, useDayNumber } from '@/composables/useDate'

const props = defineProps<{
  day: DayNote
}>()

const router = useRouter()
const emit = defineEmits(['update'])

// const routerPush = (routeName: string, params: {year: number, month: number, date: number}) => router.push({ name: routeName, params })
const routerPush = (routeName: string, year: number, month: number, date: number) => router.push({ name: routeName, params: { year, month, date } })


const GetPreviousNextDate = (direction: string) => {
  const dateUpadated = usePreviousNextDate(props.day, direction)

  emit('update', dateUpadated)

  // routerPush('date', { year: dateUpadated.year, month: useMonthName[dateUpadated.month], date: dateUpadated.date})
  routerPush('date', dateUpadated.year, useMonthName[dateUpadated.month], dateUpadated.date)

}
</script>

<template>
  <div class="title-container">
    <span class="previous-button" @click="GetPreviousNextDate('previous')"><</span>
    <h2 class="title-h2">
      {{ useDayNumber(day.date, day.month, Number(day.year)) }} {{ day.date }} {{ useMonths[day.month]}} {{ day.year }}
    </h2>
    <span class="next-button" @click="GetPreviousNextDate('next')">></span>

    <slot></slot>
  </div>
</template>


<style scoped lang="scss">
.title-container {
  display: flex;
  align-items: center;
  gap: var(--gap-10);
}

.previous-button, .next-button {
  font-size: 22px;
  cursor: pointer;
}
</style>