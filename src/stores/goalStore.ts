import { defineStore } from 'pinia'
import { Goal } from '@/types/Goal'
import { useFetch } from '@/composables/useFetch'

export const useGoalStore = defineStore('goal', () => {
  const { fetchApi, items, loading, update } = useFetch<Goal>('monthGoals')
  
  const loadGoal = async () => {
    await fetchApi()
  }

  const findOne = async (month: number, year: number): Promise<Goal> => items.value.find((item): boolean => item.year === year && item.month === month)

  const updateGoal = async (itemId: string, goalUpdated: string | null, tagsUpdated: string[] | null = null): Promise<{ status: number; message: string }> => {
    const index = items.value.findIndex((item) => item.id === itemId)
    if (index === -1) return { status: 404, message: 'Item not found' }

    const original = items.value[index]
    const updated = { ...original }

    if (goalUpdated !== null) updated.goal = goalUpdated
    if (tagsUpdated !== null) updated.tags = tagsUpdated

    // Si goal et tags sont tous les deux "vides" on supprime l'objet
    const isNowEmpty = !updated.goal?.trim() && updated.tags?.length === 0
    if (isNowEmpty) {
      return await deleteGoal(itemId)
    }

    const resp = await update(updated, 'PUT') // Ou PATCH selon ton backend

    if (resp.status === 200) {
      items.value[index] = updated
    }

    return resp
  }

  const createGoal = async (newGoalTitle: string, routeMonthNumber: number, routeYear: number, tags: string[] = []): Promise<{status: number, message: string}> => {
    const newGoal = {
      id: crypto.randomUUID(),
      goal: newGoalTitle,
      month: routeMonthNumber,
      year: routeYear,
      tags
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

  const deleteGoalField = async (itemId: string, field: 'goal' | 'tags'): Promise<{ status: number; message: string }> => {
    const index = items.value.findIndex((item) => item.id === itemId)
    if (index === -1) return { status: 404, message: 'Item not found' }

    const item = { ...items.value[index] }

    // Supprimer le champ demandé
    if (field === 'goal') item.goal = ''
    if (field === 'tags') item.tags = []

    // Vérification : supprimer complètement si vide
    const isNowEmpty = !item.goal?.trim() && item.tags?.length === 0
    if (isNowEmpty) {
      return await deleteGoal(itemId) // Appelle la suppression globale existante
    }

    // Sinon, on fait juste une mise à jour partielle
    const resp = await update(item, 'PATCH') // ou PUT selon ton API

    if (resp.status === 200) {
      items.value[index] = item
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
    delete: deleteGoalField,
  }
})
