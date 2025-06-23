<script setup lang="ts">
import TodoList from '@/components/todo/TodoList.vue'
import { useTodoStore } from '@/stores/todoStore'

const store = useTodoStore()
store.loadTodos()
</script>

<template>
  <TodoList v-if="store.todoItems" :items="store.todoItems" />
</template>