import { defineStore } from 'pinia'
import { DayNote } from '@/types/DayNote'
import { DayMoments } from '@/types/DayMoments'
import { Day } from '@/types/Day'
import { useFetch } from '@/composables/useFetch'

export const useDayNoteStore = defineStore('dayNote', () => {
  const { fetchApi, items, loading, update } = useFetch<DayNote>('dayNotes')
  const dayNoteItems = items

  const loadDayNotes = async () => {
    await fetchApi()   
  }

  const findOne = async (day: Day): Promise<DayNote> => {
    
    const dayNote = dayNoteItems.value.find((item): boolean => item.date === day.date && item.month === day.month && item.year === day.year )
    
    return dayNote
  }

  const updateDayNote = async (itemId: string, momentUpdated: DayMoments): Promise<{status: number, message: string}> => {
    const index = dayNoteItems.value.findIndex((item): Boolean => item.id === itemId)
    const dayNoteMomentIndex = dayNoteItems.value[index].moments.findIndex(moment => moment.moment === momentUpdated.moment)

    dayNoteItems.value[index].moments[dayNoteMomentIndex] = momentUpdated

    const resp = await update(dayNoteItems.value[index], 'PUT')
    return resp
  }

  const createDayNote = async (day: Day, momentUpdated: DayMoments): Promise<{status: number, message: string}> => {
    const newItem = {
      id: crypto.randomUUID(),
      date: day.date,
      month: day.month,
      year: day.year,
      moments: [
        {
          moment: 'morning',
          color: '',
          content: ''
        },
        {
          moment: 'afternoon',
          color: '',
          content: ''
        },
        {
          moment: 'night',
          color: '',
          content: ''
        },
      ]
    }

    const itemMomentToUpdate = newItem.moments.find(moment => moment.moment === momentUpdated.moment)
    itemMomentToUpdate.color = momentUpdated.color
    itemMomentToUpdate.content = momentUpdated.content
    
    dayNoteItems.value.push(newItem)
    
    const resp = await update(newItem, 'POST')
    
    return resp
  }

  const deleteDayNote = async (dayNoteItem: DayNote): Promise<void> => {
    const index = dayNoteItems.value.findIndex((item): Boolean => item.id === dayNoteItem.id)

    await update(dayNoteItem, 'DELETE')
    .then(() => dayNoteItems.value.splice(index, 1))
  }

  return {
    dayNoteItems,
    loading,
    loadDayNotes,
    findOne,
    create: createDayNote,
    update: updateDayNote,
    deleteDayNote,
  }
})
