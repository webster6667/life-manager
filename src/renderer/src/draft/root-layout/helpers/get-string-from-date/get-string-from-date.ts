import { format } from 'date-fns'

export const getStringFromDate = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}
