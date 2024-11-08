import { parse } from 'date-fns'

export const getMonthNumberFromDateString = (dateString: string): number => {
  const date = parse(dateString, 'yyyy-MM-dd', new Date())
  return date.getMonth() + 1 // getMonth() возвращает месяцы от 0 до 11, поэтому добавляем 1
}
