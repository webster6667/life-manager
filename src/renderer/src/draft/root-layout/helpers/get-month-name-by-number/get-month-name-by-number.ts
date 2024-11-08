import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export const getMonthNameByNumber = (monthNumber: number | string): string => {
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error('Номер месяца должен быть от 1 до 12')
  }

  const date = new Date(2020, Number(monthNumber) - 1)
  return format(date, 'LLLL', { locale: ru })
}
