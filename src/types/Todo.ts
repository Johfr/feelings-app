// todo interface
export interface Todo {
  id: string,
  day: number,
  month: number,
  year: string | number,
  moments: [
    { 
      moment:string,
      color: string,
      content: string
    },
    { 
      moment:string,
      color: string,
      content: string
    },
    { 
      moment:string,
      color: string,
      content: string
    }
  ]
}