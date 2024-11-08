import { addSeconds, format } from 'date-fns'

export const formatSecondsToRemainingTime = (seconds: number) => {
  const date = addSeconds(new Date(0), seconds)

  return format(date, 'm:ss')
}
