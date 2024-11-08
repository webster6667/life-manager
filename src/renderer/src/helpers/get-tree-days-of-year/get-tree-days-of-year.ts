import { eachDayOfInterval, endOfMonth, format, isToday } from 'date-fns'

import { MonthOfYears, DayOfMonth } from './types'

export const getTreeDaysOfYear = (year: number): MonthOfYears[] => {
  const today = new Date() // Текущая дата
  const monthsOfYear: MonthOfYears[] = []

  for (let month = 0; month < 12; month++) {
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = endOfMonth(firstDayOfMonth)

    const monthDates: DayOfMonth[] = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth
    }).map((date) => ({
      date: date, // Это теперь полная дата
      isTodayDate: isToday(date) // Проверяем, является ли дата сегодняшней
    }))

    const isTodayMonth = today.getFullYear() === year && today.getMonth() === month // Проверяем, является ли месяц текущим

    monthsOfYear.push({
      monthNumber: format(firstDayOfMonth, 'M'),
      monthDaysList: monthDates, // Используем monthDates вместо monthDays
      isTodayMonth
    })
  }

  return monthsOfYear
}
