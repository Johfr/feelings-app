// composables/useFetchApi.ts
import { ref } from 'vue'
type WithId = { id?: string } // id étant optionnel dans certain type, on le défini en extends


export const useFetch = <T extends WithId>(apiRoute: string) => {
  const items = ref<T[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchApi = async () => {
    loading.value = true
    try {
      const res = await fetch(`/api/${apiRoute}`)
      // let res 
      // if (apiRoute === 'todos') res = await fetch(`/api/${apiRoute}`)
      // else res = await fetch(`/api/${apiRoute}`)
      
      if (!res.ok) throw new Error('Erreur serveur')

      const data = await res.json()
      items.value = data
    } catch (err: any) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  
  const update = async (item: T, method: string): Promise<{status: number, message: string}> => {
    loading.value = true
    try {
      let fetchUri = `/api/${apiRoute}/` + (item.id ?? '')
      

      if (method === 'POST') fetchUri = `/api/${apiRoute}/`
      
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
    items,
    loading,
    error,
    fetchApi,
    update,
  }
}
