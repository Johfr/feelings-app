import { defineStore } from 'pinia'
import { Todo } from '@/types/Todo'
import { DayMoments } from '@/types/DayMoments'
import { Day } from '@/types/Day'
import { useFetch } from '@/composables/useFetch'

export const useTodoStore = defineStore('todo', () => {
  const { fetchApi, items, loading, update } = useFetch<Todo>('todos')
  const todoItems = items

  const loadTodos = async () => {
    await fetchApi()
  }

  const findOne = async (day: Day): Promise<Todo> => {    
    const todo = todoItems.value.find((item): boolean => item.day === day.dayNumber && item.month === day.monthNumber && item.year === parseInt(day.year as string) )

    return todo
  }

  const updateTodo = async (itemId: string, momentUpdated: DayMoments): Promise<{status: number, message: string}> => {
    const index = todoItems.value.findIndex((item): Boolean => item.id === itemId)
    const todoMomentIndex = todoItems.value[index].moments.findIndex(moment => moment.moment === momentUpdated.moment)

    todoItems.value[index].moments[todoMomentIndex] = momentUpdated

    const resp = await update(todoItems.value[index], 'PUT')
    return resp
  }

  const createTodo = async (day: Day, momentUpdated: DayMoments): Promise<{status: number, message: string}> => {
    const newItem = {
      id: crypto.randomUUID(),
      day: day.dayNumber,
      month: day.monthNumber,
      year: Number(day.year),
      moments: [
        {
          moment: "morning",
          color: "",
          content: ""
        },
        {
          moment: "afternoon",
          color: "",
          content: ""
        },
        {
          moment: "night",
          color: "",
          content: ""
        },
      ]
    }

    const itemMomentToUpdate = newItem.moments.find(moment => moment.moment === momentUpdated.moment)
    itemMomentToUpdate.color = momentUpdated.color
    itemMomentToUpdate.content = momentUpdated.content
    
    todoItems.value.push(newItem)
    
    const resp = await update(newItem, 'POST')
    
    return resp
  }

  const deleteTodo = async (todoItem: Todo): Promise<void> => {
    const index = todoItems.value.findIndex((item): Boolean => item.id === todoItem.id)

    await update(todoItem, 'DELETE')
    .then(() => todoItems.value.splice(index, 1))
  }

  return {
    todoItems,
    loading,
    loadTodos,
    findOne,
    create: createTodo,
    update: updateTodo,
    deleteTodo,
  }
})
