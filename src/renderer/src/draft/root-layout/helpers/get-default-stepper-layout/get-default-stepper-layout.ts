import { StepperData } from '@renderer/draft/root-layout/types'
import {
  defaultCucumberTime,
  defaultPomodoroTime,
  defaultTomatoCount
} from '@renderer/draft/root-layout/const'

export const getDefaultStepperLayout = (): StepperData => {
  const steps: StepperData = {
    timeSegmentList: [],
    backLog: [],
    skippedSeconds: 0,
    planningSeconds: 0,
    notPlanningSeconds: 0,
    isPlanning: false,
    isNotPlanning: false
  }

  for (let i = 0; i < defaultTomatoCount; i++) {
    steps.timeSegmentList.push({
      type: 'tomato',
      status: i === 0 ? 'waiting-start' : 'not-started',
      taskList: [],
      timeToFinish: defaultPomodoroTime,
      additionalTime: 0
    })
    steps.timeSegmentList.push({
      type: 'cucumber',
      status: 'not-started',
      taskList: [],
      timeToFinish: defaultCucumberTime,
      additionalTime: 0
    })
  }

  return steps
}
