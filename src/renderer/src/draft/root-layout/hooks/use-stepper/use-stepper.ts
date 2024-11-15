import { useState } from 'react'

import { TimeSegmentProps } from '@renderer/draft/root-layout/types'
import { getActiveStepIndex } from '@renderer/draft/root-layout/hooks/use-stepper/helpers/get-active-step-index'

export const useStepper = (timeSegmentList: TimeSegmentProps[]) => {
  const lastStepIndex = timeSegmentList.length - 1
  const isStepperFinished = timeSegmentList[lastStepIndex].status === 'finished'
  const isStepperOnFirstStep = timeSegmentList[0].status !== 'finished'
  const hasStepInProgress = timeSegmentList.findIndex(({ status }) => status === 'process') >= 0
  const isStepperNotInitiated = ['waiting-start', 'not-started'].includes(timeSegmentList[0].status)

  const activeStepIndex = isStepperFinished
    ? lastStepIndex
    : isStepperOnFirstStep
      ? 0
      : getActiveStepIndex(timeSegmentList)
  const [selectedStepIndex, setSelectedStepIndex] = useState(activeStepIndex)

  const selectStepHandler = (stepIndex: number) => {
    setSelectedStepIndex(stepIndex)
  }
  const isActiveStepPaused = timeSegmentList[activeStepIndex].status === 'paused'

  return {
    selectedStepIndex,
    activeStepIndex,
    isActiveStepPaused,
    selectStepHandler,
    isStepperFinished,
    isStepperNotFinished: !isStepperFinished,
    hasStepInProgress,
    isStepperNotInitiated,
    isStepperWasInitiated: !isStepperNotInitiated
  }
}
