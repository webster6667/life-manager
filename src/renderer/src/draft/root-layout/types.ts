import { TimerResult } from 'react-timer-hook'

export interface CurrentTimerResult extends TimerResult {
  startWithSettings: (secondsToFinish: number) => void
}

export type TaskComment = {
  nesting: number
  parentId: number
  comment: string
}

export type Task = {
  id: number
  isFinished: boolean
  value: string
  description: string
  parentId: number
  commentsList: TaskComment[]
  type: 'tomato' | 'cucumber'
}

export type TimeSegmentProps = {
  type: 'tomato' | 'cucumber'
  status: 'waiting-start' | 'process' | 'paused' | 'finished' | 'not-started'
  taskList: Task[]
  timeToFinish: number
  additionalTime?: number
}

export type StepperData = {
  timeSegmentList: TimeSegmentProps[]
  backLog: Task[]
  skippedSeconds: number
  planningSeconds: number
  notPlanningSeconds: number
  isPlanning: boolean
  isNotPlanning: boolean
}

export type DateContent = StepperData | object

export type YearsTab = { year: string; isSelected: boolean; isCurrentYear: boolean }
