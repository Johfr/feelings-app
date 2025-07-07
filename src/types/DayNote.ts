// DayNote interface
import { Day } from "./Day"
import { DayMoments } from "./DayMoments"

export interface DayNote {
  id: Day["id"],
  date: Day["date"],
  month: Day["month"],
  year: Day["year"],
  moments: DayMoments[]
}