<script setup lang="ts">
import { usePreviousNextMonth } from '@/composables/useDate'

const props = defineProps<{
  routeMonth: string,
  routeYear: number
}>()

const router = useRouter()

const localMonth = ref<string>(props.routeMonth)
const localYear = ref<number>(props.routeYear)

const GetPreviousNextMonth = (direction: string) => {
  const monthNameUpdated = usePreviousNextMonth(props.routeMonth, props.routeYear, direction)

  localMonth.value = monthNameUpdated.month
  localYear.value = monthNameUpdated.year
  
  router.push({ name: 'month', params: { year: monthNameUpdated.year, month: monthNameUpdated.month } })
}

watch(props, (newVal) => {
  localMonth.value = newVal.routeMonth
  localYear.value = newVal.routeYear  
})
</script>

<template>
  <div class="title-container">
    <span class="previous-button" @click="GetPreviousNextMonth('previous')"><</span>
    <h1 class="title-h1">{{ localMonth }} {{ localYear }}</h1>
    <span class="next-button" @click="GetPreviousNextMonth('next')">></span>

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