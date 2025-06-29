import { DayNote } from "@/types/DayNote"

const date = new Date()

export const useMonths = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
export const useDays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ]

export const usePreviousNextMonth = (monthName: string, direction: string): string => {
  let actualMonth = useMonths.indexOf(monthName)

  if (direction === 'next') actualMonth += 1
  else actualMonth -= 1

  return useMonths[actualMonth]
}

export const usePreviousNextDate = (day: DayNote, direction: string): { date: number, month: number, year: number } => {
  let actualDate = day.date

  // Gérer le cas du passage au mois suivant 31, 32 juin n'existe pas
  if (direction === 'next') actualDate += 1
  else actualDate -= 1  

  return { date: actualDate, month: day.month, year: day.year as number }
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
export const useCurrentMonth = date.getMonth() // Janvier, fevrier...
export const useCurrentYear = date.getFullYear() // 2025, 2026...


// export const useMonths = {
//   french: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
//   english: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
// }

// export const useCurrentMonthNumber = () => date.getMonth()
// export const useCurrentMonthNumberAdjusted = date.getMonth() + 1

// export const useCurrentMonthName = (lang: string) => useMonths[lang][date.getMonth()]
// export const useCurrentYear = () => date.getFullYear()
