import { DayNote } from "@/types/DayNote"
import { ref } from "vue"

const date = new Date()

export const useMonths = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
export const useDays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ]

export const usePreviousNextMonth = (monthName: string, year: number, direction: string):  { month: string, year: number } => {
  let actualMonth = useMonths.indexOf(monthName)
  let currentYear = year

  if (direction === 'next') {
    if (actualMonth === 11) { // décembre
      actualMonth = 0
      currentYear += 1
    } else {
      actualMonth += 1
    }
  } else if (direction === 'previous') {
    if (actualMonth === 0) { // janvier
      actualMonth = 11
      currentYear -= 1
    } else {
      actualMonth -= 1
    }
  }

  return { month: useMonths[actualMonth], year: currentYear }
}

export const usePreviousNextDate = (date: number, month: number, year: number, direction: string): { date: number, month: number, year: number } => {
  let actualDate = date // 1->31
  let totalMonthDays = useDaysInMonth(month, year) // 28, 30, 31
  let actualMonth = month // number
  let currentYear = year 
  
  if (direction === 'next') {
    if (actualDate === totalMonthDays) {
      actualDate = 0

      // décembre à janvier
      if (actualMonth === 11) {
        actualMonth = 0
        currentYear += 1
      } else {
        actualMonth += 1
      }
    }
    actualDate += 1
  } else {
    if (actualDate === 1) {
      if (actualMonth === 0) {
        actualMonth = 11
        currentYear -= 1
      } else {
        actualMonth -= 1
      }
      actualDate = useDaysInMonth(actualMonth, currentYear)
    } else {
      actualDate -= 1
    }
  }

  return { date: actualDate, month: actualMonth, year: currentYear }
}

// return the number of days in a month : 28, 30, 31
export const useDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

export const useMonthName = (monthNumber: number) => useMonths[monthNumber] // return 5 = juin, 6 = juillet etc.
export const useMonthNumber = (monthName: string) => useMonths.indexOf(monthName) // return juin = 5, juillet = 6 etc.

// return lundi -> dimanche
export const useDayNumber = (date: number, month: number, year: number) => {
  const d = new Date(year, month, date)
  return useDays[d.getDay()]
}

export const useCurrentDate = date.getDate() // 1er au 31
export const useCurrentDayNumber = date.getDay() // 0 à 6
export const useCurrentDay = useDays[date.getDay()] // lundi, mardi..
export const useCurrentMonth = date.getMonth() // 0 à 11
export const useCurrentYear = date.getFullYear() // 2025, 2026...


// export const useMonths = {
//   french: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
//   english: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
// }

// export const useCurrentMonthNumber = () => date.getMonth()
// export const useCurrentMonthNumberAdjusted = date.getMonth() + 1

// export const useCurrentMonthName = (lang: string) => useMonths[lang][date.getMonth()]
// export const useCurrentYear = () => date.getFullYear()
