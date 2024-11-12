import {
  Box,
  CircularProgress,
  Typography,
  Fab,
  List,
  ListItem,
  Checkbox,
  TextField,
  Button,
  Divider,
  Stack,
  ListItemButton,
  ListItemText,
  Collapse
} from '@mui/material'
import { Add, Remove, Delete, ExpandLess, ExpandMore } from '@mui/icons-material'
import { TextareaAutosize } from './../components/TextareaAutosize'

import { FC } from 'react'
import { isEmpty, last, first } from 'lodash'

import { Stepper } from './ui/stepper'
import { Step } from './ui/step'

import { useStepperTimer } from '@renderer/draft/root-layout/hooks/use-stepper-timer'
import { useConditionsInterval } from '@front-shared/hooks/use-conditions-interval'
import { TimeSegment } from '@renderer/draft/root-layout/components/time-segment'
import { DateContent } from '@renderer/draft/root-layout/types'
import { formatSecondsToRemainingTime } from '@renderer/draft/root-layout/helpers/format-seconds-to-remaining-time'
import { useTaskManager } from '@renderer/draft/root-layout/hooks/use-task-manager'
import { useStepper } from '@renderer/draft/root-layout/hooks/use-stepper'
import { MarkdownEditor } from '@renderer/draft/root-layout/components/mark-down-editor'
import {
  defaultAdditionalCucumberTime,
  defaultAdditionalPomodoroTime
} from '@renderer/draft/root-layout/const'

import { useToggle } from '@common-hook'
import { PomadoroLayout } from './ui/pomadoro-layout'
import { FooterNav } from './ui/footer-nav'
import { TaskList } from './ui/task-list'
import { TimeList } from '@renderer/draft/root-layout/components/pomodoro-content/ui/time-list'

export const PomodoroContent: FC<{ contentData: DateContent; selectedFilePath: string }> = ({
  contentData,
  selectedFilePath
}) => {
  const {
    dayData,
    setDayData,
    finishTimeSegment,
    createNewTask,
    updateTaskValue,
    updateTaskDescription,
    toggleTaskFinished,
    moveTaskToTimeSegment,
    moveTaskToBackLog,
    deleteTask,
    togglePlaning,
    incrementPlanningSecond,
    incrementSkippedSecond
  } = useTaskManager(contentData, selectedFilePath)

  const { activeStepIndex, handleStep } = useStepper(dayData)
  const isPaused = dayData.timeSegmentList[activeStepIndex].status === 'paused'
  const timerData = useStepperTimer({
    onFinish: finishTimeSegment,
    isPaused
  })

  const addTimeForTimeSegment = (timeSegmentIndex: number) => {
    setDayData(({ timeSegmentList }) => {
      const remainingSeconds = timerData.totalSeconds
      if (timeSegmentIndex >= 0) {
        const { type, status, timeToFinish } = timeSegmentList[timeSegmentIndex]
        const additionalTime =
          type === 'tomato' ? defaultAdditionalPomodoroTime : defaultAdditionalCucumberTime
        timeSegmentList[timeSegmentIndex].timeToFinish = timeToFinish + additionalTime
        timeSegmentList[timeSegmentIndex].additionalTime += additionalTime

        if (status === 'process') {
          timerData.startWithSettings(remainingSeconds + additionalTime)
        } else if (status === 'finished' || status === 'paused') {
          if (timeSegmentIndex < timeSegmentList.length - 1) {
            timeSegmentList[timeSegmentIndex + 1].status = 'not-started'
            timeSegmentList[timeSegmentIndex].status = 'paused'
            timerData.startWithSettings(remainingSeconds + additionalTime, false)
          }
        }
      }
    })
  }

  const {
    timeSegmentList = [],
    backLog = [],
    isPlanning,
    planningSeconds,
    skippedSeconds
  } = dayData || {}
  const taskList = timeSegmentList[activeStepIndex]?.taskList || []
  const isSkippingTime =
    isPlanning === false &&
    last(timeSegmentList).status !== 'finished' &&
    first(timeSegmentList).status !== 'waiting-start' &&
    timeSegmentList.findIndex(({ status }) => status === 'process') == -1

  useConditionsInterval([isPlanning], () => {
    if (isPlanning) {
      incrementPlanningSecond()
    }
  })

  useConditionsInterval([isSkippingTime], () => {
    if (isSkippingTime) {
      incrementSkippedSecond()
    }
  })

  return (
    <PomadoroLayout
      isLoading={isEmpty(dayData)}
      stepper={() => (
        <Stepper activeStepIndex={activeStepIndex}>
          {timeSegmentList.map(({ ...props }, index) => (
            <Step
              key={index}
              activeStepIndex={activeStepIndex}
              index={index}
              onClick={() => handleStep(index)}
            >
              <TimeSegment
                timerData={timerData}
                setDayData={setDayData}
                index={index}
                timeSegmentList={timeSegmentList}
                addTimeForTimeSegment={addTimeForTimeSegment}
                {...props}
              />
            </Step>
          ))}
        </Stepper>
      )}
      content={() => (
        <>
          <TaskList
            taskList={taskList}
            onTaskToggle={toggleTaskFinished}
            onTaskTextChange={updateTaskDescription}
            onTaskDescriptionChange={updateTaskDescription}
            onReturn={moveTaskToBackLog}
            onDelete={deleteTask}
          />

          <TimeList
            timeSegmentList={timeSegmentList}
            planningSeconds={planningSeconds}
            skippedSeconds={skippedSeconds}
            notPlanningSeconds={skippedSeconds}
          />

          {/*Беклог*/}

          <FooterNav>
            <Button variant={'contained'} onClick={() => togglePlaning()}>
              {isPlanning ? 'Запустить процесс не по плану' : 'Остановить процесс не по плану'}
            </Button>
            <Button variant={'contained'} onClick={() => togglePlaning()}>
              {isPlanning ? 'Остановить планнинг' : 'Запустить планинг'}
            </Button>
          </FooterNav>
        </>
      )}
    />
  )
}
