import { CurrentTimerResult } from '@renderer/draft/root-layout/types'

export const getTimeStringFromTimerData = (timerData: CurrentTimerResult) => {
  return `${timerData.hours}:${timerData.minutes.toString().padStart(2, '0')}:${timerData.seconds.toString().padStart(2, '0')}`
}
