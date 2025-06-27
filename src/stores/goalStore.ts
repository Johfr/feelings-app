import { defineStore } from 'pinia'
import { Goal } from '@/types/Goal'
import { useFetch } from '@/composables/useFetch'

export const useGoalStore = defineStore('goal', () => {
  const { fetchApi, items, loading, update } = useFetch<Goal>('monthGoals')
  
  const loadGoal = async () => {
    await fetchApi()
  }

  const findOne = async (month: number, year: number): Promise<Goal> => items.value.find((item): boolean => item.year === year && item.month === month)
  
  const updateGoal = async (itemId: string, goalUpdated: string): Promise<{status: number, message: string}> => {
    const index = items.value.findIndex((item): Boolean => item.id === itemId)

    const itemCopy = {...items.value[index]}
    itemCopy.goal = goalUpdated

    const resp = await update(itemCopy, 'PUT')

    // maj faite, on met à jour localement
    if (resp.status === 200) {
      items.value[index].goal = itemCopy.goal    
    }

    return resp
  }

  const createGoal = async (newGoalTitle: string, routeMonthNumber : number, routeYear : number): Promise<{status: number, message: string}> => {
    const newGoal = {
      id: crypto.randomUUID(),
      goal: newGoalTitle,
      month: routeMonthNumber,
      year: routeYear
    }

    const resp = await update(newGoal, 'POST')

    // maj faite, on met à jour localement
    if (resp.status === 201) {
      items.value.push(newGoal)    
    }

    return resp
  }
  
  const deleteGoal = async (itemId: string): Promise<{status: number, message: string}> => {
    const index = items.value.findIndex((item): Boolean => item.id === itemId)

    const resp = await update(items.value[index], 'DELETE')

    // maj faite, on met à jour localement
    if (resp.status === 200) {
      items.value.splice(index, 1) 
    }

    return resp
  }

  return {
    items,
    loading,
    loadGoal,
    findOne,
    create: createGoal,
    update: updateGoal,
    delete: deleteGoal,
  }
})
