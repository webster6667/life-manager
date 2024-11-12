import { addSeconds, format } from 'date-fns'

export const formatSecondsToRemainingTime = (seconds: number) => {
  const date = addSeconds(new Date(0).setHours(0), seconds)

  return format(date, 'HH:m:ss')
}
