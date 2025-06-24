<script setup lang="ts">
import { monthNumber } from '@/composables/UseDate'
import { useTodoStore } from '@/stores/todoStore'
import { Todo } from '@/types/Todo'

const props = defineProps<{
  dayNumber: number,
  month: string,
  year: string,
}>()

const store = useTodoStore()
store.loadTodos()

const data = computed((): Todo[] => {
  const itemsFound = store.todoItems.filter(item => {
    if (item.month === monthNumber(props.month) && item.year === parseInt(props.year) && item.day === props.dayNumber) {
      return item
    }
  })
  return itemsFound
})

</script>

<template>
  <ul class="item_color-container" v-for="(day, dayIndex) in data" :key="dayIndex" v-show="day.day === dayNumber">
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
}
.item_color-block {
  width: 33px;
  height: 5px;

  @media (min-width: 960px) {
    height: 5px;
  }
}
</style>