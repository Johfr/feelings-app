import { defineStore } from 'pinia'
import { CurrentRoutine } from '@/types/CurrentRoutine'
import { useFetch } from '@/composables/useFetch'

export const useCurrentRoutineStore = defineStore('CurrentRoutine', () => {
  const { fetchApi, items, loading, update } = useFetch<CurrentRoutine>('currentRoutine')
  
  const loadRoutines = async () => {
    await fetchApi()
  }

  const findCurrentRunningTask = async (date: number, month: number, year: number): Promise<CurrentRoutine[]> => 
    items.value.filter((item: CurrentRoutine) => 
      item.year === year && item.month === month && item.date === date && item?.running
    )

  
  const updateRoutine = async (routine: CurrentRoutine): Promise<{status: number, message: string}> => {
    const index = items.value.findIndex((item): Boolean => item.id === routine.id)

    let itemCopy = {...items.value[index]}
    itemCopy.title = routine.title
    itemCopy.done = routine.done
    itemCopy.date = routine.date
    itemCopy.month = routine.month
    itemCopy.year = routine.year
    itemCopy.running = routine.running
    itemCopy = {...routine, type: itemCopy.type, id: itemCopy.id}

    const resp = await update(itemCopy, 'PUT')
    
    // maj faite, on met à jour localement
    if (resp.status === 200) {
      // items.value[index] = { ...itemCopy }
      items.value[index].title = itemCopy.title
      items.value[index].done = itemCopy.done
      items.value[index].date = itemCopy.date
      items.value[index].month = itemCopy.month
      items.value[index].running = itemCopy.running
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
    
    if (index === -1) return { status: 404, message: 'Routine non trouvée' }

    const resp = await update(items.value[index], 'DELETE')    

    return resp
  }

  // utilisé directement dans les composants pour éviter les erreurs liées aux index
  const removeRoutinesByIds = (ids: string[]) => {
    items.value = items.value.filter(item => !ids.includes(item.id))
  }
  
  return {
    items,
    loading,
    loadRoutines,
    findCurrentRunningTask,
    create: createRoutine,
    update: updateRoutine,
    delete: deleteRoutine,
    removeRoutinesByIds
  }
})
