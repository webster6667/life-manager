import { useEffect } from 'react'

import { useTimer } from 'react-timer-hook'
import { UseStepperTimerProps } from '@renderer/draft/root-layout/hooks/use-stepper-timer/types'

export const useStepperTimer = (props: UseStepperTimerProps) => {
  const { onFinish, isActiveStepPaused, isStepperForToday } = props || {}
  const remainingSeconds = +window.localStorage.getItem('remainingSeconds')
  const expiryTimestamp = new Date()
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + remainingSeconds)

  const { totalSeconds, seconds, minutes, hours, days, isRunning, start, pause, resume, restart } =
    useTimer({
      expiryTimestamp,
      onExpire: () => {
        onFinish && onFinish()
        window.localStorage.removeItem('remainingSeconds')
      },
      autoStart: isActiveStepPaused || isStepperForToday === false ? false : remainingSeconds >= 0
    })

  useEffect(() => {
    window.localStorage.setItem('remainingSeconds', String(totalSeconds))
  }, [totalSeconds])

  useEffect(() => {
    if (isActiveStepPaused) {
      pause()
    }
  }, [isActiveStepPaused])

  const startWithSettings = (secondsToFinish: number, autoStart = true) => {
    const timerFinishTime = new Date()
    timerFinishTime.setSeconds(timerFinishTime.getSeconds() + secondsToFinish)

    window.localStorage.setItem('remainingSeconds', String(secondsToFinish))

    restart(timerFinishTime, autoStart)
  }

  return {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    startWithSettings,
    pause,
    resume,
    restart
  }
}
