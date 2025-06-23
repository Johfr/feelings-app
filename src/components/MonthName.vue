<script setup lang="ts">
import {  previousNextMonth } from '@/composables/UseDate'

const props = defineProps<{
  routeMonth: string,
  routeYear: string
}>()

const router = useRouter()

const GetPreviousNextMonth = (direction: string) => {
  const monthNameUpadated = previousNextMonth(props.routeMonth, direction)
  
  router.push({ name: 'month', params: { year: props.routeYear, month: monthNameUpadated} })
}
</script>

<template>
  <div class="title-container">
    <span class="previous-button" @click="GetPreviousNextMonth('previous')"><</span>
    <h1 class="title-h1">{{ routeMonth }} {{ routeYear }}</h1>
    <span class="next-button" @click="GetPreviousNextMonth('next')">></span>
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