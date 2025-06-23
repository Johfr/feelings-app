// composables/useColors.ts
import { ref } from 'vue'
import type { Colors } from '@/types/Colors'

// fusionner useColors, useTodos et useGoal ?
// renommer le fichier en useApi ?

export const useColors = () => {
  const colorItems = ref<Colors[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchColors = async () => {
    loading.value = true
    try {
      const res = await fetch('/api/colors')
      if (!res.ok) throw new Error('Erreur serveur')
      const data = await res.json()
      colorItems.value = data
    } catch (err: any) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const updateColor = async (item: Colors, method: string): Promise<{status: number, message: string}> => {
    loading.value = true
    try {
      let fetchUri = '/api/Colors/'+ item.id

      if (method === 'POST') fetchUri = '/api/Colors/'
      
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

      console.log(res);
      
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
    colorItems,
    loading,
    error,
    fetchColors,
    updateColor,
  }
}
