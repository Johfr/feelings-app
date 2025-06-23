<script setup lang="ts">
import { useTodoStore } from '@/stores/todoStore'
import { Todo } from '@/types/Todo'
import TodoList from '@/components/todo/TodoList.vue'
import Vbutton from '@/design-system/Vbutton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// props from router
const props = defineProps<{ id: string }>()

const todo = ref<Todo>()

useTodoStore().findOne(props.id).then((todoFind: Todo) => {
  todo.value = todoFind
})

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="article">
    <h1>Article page</h1>
    <Vbutton @click="$router.go(-1)" :btnTitle="'<-Back'"/>
    
    <TodoList v-if="todo" :items="[todo]" @delete-todo="goBack" />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .article {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
