import { useState } from 'react'

import { StepperData } from '@renderer/draft/root-layout/types'

export const useStepper = (dayData: StepperData) => {
  const [activeStepIndex, setActiveStepIndex] = useState(() => {
    const activeStepIndexToWrite = dayData.timeSegmentList.findIndex(({ status }, index) => {
      const isStepInProgressOrInQueue = ['waiting-start', 'process', 'paused'].includes(status)
      const isAllStepsFinished =
        dayData.timeSegmentList.length - 1 === index && status === 'finished'
      return isStepInProgressOrInQueue || isAllStepsFinished
    })

    return activeStepIndexToWrite == -1 ? 0 : activeStepIndexToWrite
  })

  const handleStep = (step: number) => {
    setActiveStepIndex(step)
  }

  return { activeStepIndex, setActiveStepIndex, handleStep }
}
