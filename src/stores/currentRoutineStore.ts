import { defineStore } from 'pinia'
import { CurrentRoutine } from '@/types/CurrentRoutine'
import { useFetch } from '@/composables/useFetch'

export const useCurrentRoutineStore = defineStore('CurrentRoutine', () => {
  const { fetchApi, items, loading, update } = useFetch<CurrentRoutine>('currentRoutine')
  
  const loadRoutines = async () => {
    await fetchApi()
  }

  // const findOne = async (month: number, year: number): Promise<CurrentRoutine> => items.value.find((item): boolean => item.year === year && item.month === month)
  
  const updateRoutine = async (itemId: string, titleUpdated: string, done: boolean): Promise<{status: number, message: string}> => {  
    const index = items.value.findIndex((item): Boolean => item.id === itemId)

    const itemCopy = {...items.value[index]}
    itemCopy.title = titleUpdated
    itemCopy.done = done    

    const resp = await update(itemCopy, 'PUT')

    // maj faite, on met à jour localement
    if (resp.status === 200) {
      items.value[index].title = itemCopy.title    
    }

    return resp
  }

  const createRoutine = async (routine: CurrentRoutine): Promise<{status: number, message: string}> => {
    const newRoutine = {
      id: crypto.randomUUID(),
      date:routine.date,
      month: routine.month,
      year: routine.year,
      title: routine.title,
      done: false,
      type: routine.type
    }    

    const resp = await update(newRoutine, 'POST')

    // maj faite, on met à jour localement
    if (resp.status === 201) {
      items.value.push(newRoutine)    
    }

    return resp
  }

  const deleteRoutine = async (itemId: string): Promise<{status: number, message: string}> => {
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
    loadRoutines,
    // findOne,
    create: createRoutine,
    update: updateRoutine,
    delete: deleteRoutine,
  }
})
