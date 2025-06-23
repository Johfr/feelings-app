// composables/useMonthGoal.ts
import { ref } from 'vue'

export const useGoal = <T>(apiRoute: string) => {
  const goalItems = ref<T[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchGoal = async () => {
    loading.value = true
    try {
      const res = await fetch('/api/' + apiRoute)
      if (!res.ok) throw new Error('Erreur serveur')
      const data = await res.json()
      goalItems.value = data
    } catch (err: any) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  
  const update = async (item: T, method: string): Promise<{status: number, message: string}> => {
    loading.value = true
    try {
      let fetchUri = '/api/' + apiRoute + '/' + item.id

      if (method === 'POST') fetchUri = '/api/' + apiRoute + '/'
      
      const res = await fetch(fetchUri, {
        method,
        body: JSON.stringify(item)
      })
      
      if (!res.ok)  {
        return {
          status: res.status,
          message: (await res.text()) || "Erreur serveur"
        }
      }

      // console.log(res);

      return {
        status: res.status,
        message: "Mis à jour réussie"
      }

      
    } catch (err: any) {
      return {
        status: 500,
        message: err?.message || "Erreur inconnue"
      }
    } finally {
      loading.value = false
    }
  }

  return {
    goalItems,
    loading,
    error,
    fetchGoal,
    update,
  }
}
