<script setup lang="ts">
import { usePreviousNextDate } from '@/composables/useDate'
// import { DayNote } from '@/types/DayNote'
import { Day } from '@/types/Day'
import { useMonths, useMonthName, useDayNumber } from '@/composables/useDate'

const props = defineProps<{
  daySelected: Day
}>()

const router = useRouter()
const emit = defineEmits(['update'])

// const routerPush = (routeName: string, params: {year: number, month: number, date: number}) => router.push({ name: routeName, params })
const routerPush = (routeName: string, year: number, month: string, date: number) => router.push({ name: routeName, params: { year, month, date } })

const localDate = ref<number>(props.daySelected.date)
const localMonth = ref<number>(props.daySelected.month)
const localYear = ref<number>(props.daySelected.year)

const GetPreviousNextDate = (direction: string) => {
  const dateUpdated = usePreviousNextDate( localDate.value, localMonth.value, localYear.value, direction)
  
  localMonth.value = dateUpdated.month
  localDate.value = dateUpdated.date
  localYear.value = dateUpdated.year

  const monthUpdated = useMonthName(dateUpdated.month)
  
  routerPush('date', dateUpdated.year, monthUpdated, dateUpdated.date)  
  emit('update', dateUpdated)
}

watch(props, (newVal) => {
  localDate.value = newVal.daySelected.date
  localMonth.value = newVal.daySelected.month
  localYear.value = newVal.daySelected.year
}, {
  immediate: true
})
</script>

<template>
  <div class="title-container mt-2">
    <span class="previous-button" @click="GetPreviousNextDate('previous')"><</span>
    <h2 class="title-h2">
      {{ useDayNumber(localDate, localMonth, Number(localYear)) }} {{ localDate }} {{ useMonths[localMonth]}} {{ localYear }}
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