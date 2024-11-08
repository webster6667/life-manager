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
}

export type TimeSegment = {
  type: 'tomato' | 'cucumber'
  status: 'waiting-start' | 'process' | 'paused' | 'finished' | 'not-started'
  taskList: Task[]
  timeToFinish: number
}

export type StepperData = {
  timeSegmentList: TimeSegment[]
  backLog: Task[]
  skippedSeconds: number
  planningSeconds: number
  isPlanning: boolean
}

export type DateContent = StepperData | object
