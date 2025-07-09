// DayNote interface
import { Day } from "./Day"
import { DayMoments } from "./DayMoments"

export interface DayNote {
  id: Day["id"],
  date: Day["date"],
  month: Day["month"],
  year: Day["year"],
  moments: DayMoments[]
  favoris?: boolean,
  favorisNote?: string,
}

// version factorisée
// type BaseDay = Pick<Day, "id" | "date" | "month" | "year">

// export interface DayNote extends BaseDay {
//   moments: DayMoments[],
//   favoris?: boolean
// }
