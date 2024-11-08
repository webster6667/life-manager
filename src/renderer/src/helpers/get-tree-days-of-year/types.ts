export type DayOfMonth = {
  date: Date
  isTodayDate: boolean
}

export type MonthOfYears = {
  monthNumber: string
  monthDaysList: DayOfMonth[]
  isTodayMonth: boolean
}
