import { defineStore } from 'pinia'
import { Colors } from '@/types/Colors'
import { useFetch } from '@/composables/useFetch'

export const useColorStore = defineStore('color', () => {
  const { fetchApi, items, loading, update } = useFetch<Colors>('colors')
  const colorItems = items
  
  const loadColors = async () => {
    await fetchApi()
  }

  const findOne = async (color: Colors): Promise<Colors> => {    
    const colorFind = colorItems.value.find((item): boolean => item.color === color.color )

    return colorFind
  }
  
  // const updateColor = async (itemId: string, goalUpdated: string): Promise<{status: number, message: string}> => {
  //   const index = items.value.findIndex((item): Boolean => item.id === itemId)

  //   const itemCopy = {...items.value[index]}
  //   itemCopy.goal = goalUpdated

  //   const resp = await update(itemCopy, 'PUT')

  //   // maj faite, on met à jour localement
  //   if (resp.status === 200) {
  //     items.value[index].goal = itemCopy.goal    
  //   }

  //   return resp
  // }

  // const createColor = async (newGoalTitle: string, routeMonthNumber : number, routeYear : number): Promise<{status: number, message: string}> => {
  //   // on crée l'id à partir du dernier id connu
  //   const newId = Number(items.value.at(-1).id) + 1

  //   const newGoal = {
  //     id: newId.toString(),
  //     goal: newGoalTitle,
  //     month: routeMonthNumber,
  //     year: routeYear
  //   }

  //   const resp = await update(newGoal, 'POST')    

  //   // maj faite, on met à jour localement
  //   if (resp.status === 201) {
  //     items.value.push(newGoal)    
  //   }

  //   return resp
  // }

  return {
    colorItems,
    loading,
    loadColors,
    findOne,
    // create: createColor,
    // update: updateColor,
  }
})
