import { StepperData } from '@renderer/draft/root-layout/types'

const defaultPomodoroTime = 1800
const defaultCucumberTime = 600
const defaultTomatoCount = 5

export const getDefaultStepperLayout = (): StepperData => {
  const steps: StepperData = {
    timeSegmentList: [],
    backLog: [],
    skippedSeconds: 0,
    planningSeconds: 0,
    isPlanning: false
  }

  for (let i = 0; i < defaultTomatoCount; i++) {
    steps.timeSegmentList.push({
      type: 'tomato',
      status: i === 0 ? 'waiting-start' : 'not-started',
      taskList: [],
      timeToFinish: defaultPomodoroTime
    })
    steps.timeSegmentList.push({
      type: 'cucumber',
      status: 'not-started',
      taskList: [],
      timeToFinish: defaultCucumberTime
    })
  }

  return steps
}
