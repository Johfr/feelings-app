// composables/useDayNotes.ts
import { ref } from 'vue'
import type { DayNote } from '@/types/DayNote'

export const useDayNotes = () => {
  const dayNoteItems = ref<DayNote[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchDayNotes = async () => {
    loading.value = true
    try {
      const res = await fetch('/api/dayNotes')
      if (!res.ok) throw new Error('Erreur serveur')
      const data = await res.json()
      dayNoteItems.value = data
    } catch (err: any) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const updateDayNote = async (item: DayNote, method: string): Promise<{status: number, message: string}> => {
    loading.value = true
    try {
      let fetchUri = '/api/dayNotes/'+ item.id

      if (method === 'POST') fetchUri = '/api/dayNotes/'
      
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
    dayNoteItems,
    loading,
    error,
    fetchDayNotes,
    updateDayNote,
  }
}
