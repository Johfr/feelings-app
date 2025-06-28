import { Todo } from "@/types/Todo"

const date = new Date()

// export const months = {
//   french: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
//   english: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
// }
export const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
export const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ]

// export const currentMonthNumber = () => date.getMonth()
// export const currentMonthNumberAdjusted = date.getMonth() + 1

// export const currentMonthName = (lang: string) => months[lang][date.getMonth()]
// export const currentYear = () => date.getFullYear()


export const previousNextMonth = (monthName: string, direction: string): string => {
  let actualMonth = months.indexOf(monthName)

  if (direction === 'next') actualMonth += 1
  else actualMonth -= 1

  return months[actualMonth]
}

export const previousNextDate = (day: Todo, direction: string): { date: number, month: number, year: number } => {
  let actualDate = day.day

  // Gérer le cas du passage au mois suivant 31, 32 juin n'existe pas
  if (direction === 'next') actualDate += 1
  else actualDate -= 1  

  return { date: actualDate, month: day.month, year: day.year as number }
}

export const daysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

export const monthNumber = (monthName: string) => months.indexOf(monthName)

export const dayNumber = (date: number, month: number, year: number) => {
  const d = new Date(year, month, date)
  return days[d.getDay()]
}

export const currentDate = date.getDate() // 1er au 31
export const currentDayNumber = date.getDay() // 1 à 7
export const currentDay = days[date.getDay()] // 0 à 6

export const currentMonth = date.getMonth()
export const currentYear = date.getFullYear()