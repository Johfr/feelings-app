<script setup lang="ts">
import { Todo } from '@/types/Todo'
import TodoItems from '@/components/todo/TodoItems.vue'
import { useTodoStore } from '@/stores/todoStore'
import Vbutton from '@/design-system/Vbutton.vue'
import UpdateTodoForm from '@/components/todo/update-todo-form.vue'

defineProps<{
  items: Todo[]
}>()

const emit = defineEmits<{
  deleteTodo: [value: boolean]
}>()

const updateTodo = (item: Todo, newName: string) => useTodoStore().updateName(item, newName)
.then(e => closeForm())

const createTodo = (item: Todo, newName: string) => useTodoStore().addNewTodo(item, newName)
.then(e => closeForm())

const deleteTodo = (item: Todo) => {
  useTodoStore().deleteTodo(item)
  .then(() => emitDelete())
}

const toggleTodoStatus = (item: Todo) => useTodoStore().updateStatus(item)

const updateFormModel = ref<boolean>(false)
const formItem = ref<Todo>()
const formAction = ref<string>('')
const isUpdate = computed(() => formAction.value === 'update')
// const isCreate = computed(() => formAction.value === 'create')

const showUpdateForm = (item: Todo, action: string): void => {
  updateFormModel.value = true
  formItem.value = item
  formAction.value = action
}

const closeForm = (): void => {
  updateFormModel.value = false
}

const emitDelete = () => {
  emit('deleteTodo', true)
}
</script>

<template>
  <h2>Todo list</h2>
  <Vbutton @click="showUpdateForm({ name: '', status: false, id: '' }, 'create')" :btnTitle="'Add new todo'"/>

  <ul>
    <TodoItems v-for="(item, itemId) in items" :key="itemId" :item="item">
      <template #title>
        <p
          class="todo-title bg-avocado-600"
          :class="{ '--done': item.status}"
        >
          Name: {{ item.name }}
        </p>
      </template>
      
      <template #actions>
        <Vbutton @click="showUpdateForm(item, 'update')" :btnTitle="'update'"/>
        <Vbutton @click="toggleTodoStatus(item)" :btnTitle="'validate'"/>
        <Vbutton @click="deleteTodo(item)" :btnTitle="'delete'" />
        <router-link :to="{ name: 'article-detail', params: { id: item.id } }">Go to</router-link>
      </template>
    </TodoItems>
  </ul>

  <UpdateTodoForm v-if="updateFormModel" v-model="updateFormModel" :item="formItem">
    <template #actions="{slotProps}">
      <Vbutton v-if="isUpdate" @click="updateTodo(slotProps.item, slotProps.newName)" :btnTitle="'Valider'" />
      <Vbutton v-else @click="createTodo(slotProps.item, slotProps.newName)" :btnTitle="'Creer'" />
    </template>
  </UpdateTodoForm>

  <!-- <UpdateTodoForm v-if="updateFormModel" v-model="updateFormModel" v-model:title="formItem.name" :item="formItem">
    <template #actions>
      <Vbutton @click="updateTodo(formItem)" :btnTitle="'changer nom'"/>
    </template>
  </UpdateTodoForm> -->
</template>

<style scoped lang="postcss">
/* You will need this line in every component if you use the @apply directive in your style */
/* @reference "../../assets/main.css";
.todo-title {
  @apply text-3xl font-bold underline;
} */
</style>