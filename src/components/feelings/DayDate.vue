<script setup lang="ts">
import { previousNextDate } from '@/composables/UseDate'
import { Todo } from '@/types/Todo'
import { months, monthNumber, currentDay, currentMonth } from '@/composables/UseDate'

const props = defineProps<{
  day: Todo
}>()

// const router = useRouter()
const emit = defineEmits(['update'])
const GetPreviousNextDate = (direction: string) => {
  const dateUpadated = previousNextDate(props.day, direction)

  emit('update', dateUpadated)

  // props.day.day = dateUpadated
  
  // router.push({ name: 'month', params: { year: props.day.year, month: monthNameUpadated} })
}
</script>

<template>
  <div class="title-container">
    <span class="previous-button" @click="GetPreviousNextDate('previous')"><</span>
    <h2 class="title-h2">
      {{ day.day }} {{ months[day.month]}} {{ day.year }}
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