// DayNote interface
import { DayMoments } from "./DayMoments" 
export interface DayNote {
  id: string,
  date:number,
  month: number,
  year: number,
  moments: DayMoments[]
}