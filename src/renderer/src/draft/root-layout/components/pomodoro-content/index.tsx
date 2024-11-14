import { Box, Button, Fab, Tab, Tabs } from '@mui/material'

import { FC, useState } from 'react'
import { isEmpty, last, first } from 'lodash'

import { Stepper } from './ui/stepper'
import { Step } from './ui/step'

import { useStepperTimer } from '@renderer/draft/root-layout/hooks/use-stepper-timer'
import { useConditionsInterval } from '@front-shared/hooks/use-conditions-interval'
import { TimeSegment } from '@renderer/draft/root-layout/components/time-segment'
import { DateContent } from '@renderer/draft/root-layout/types'
import { useTaskManager } from '@renderer/draft/root-layout/hooks/use-task-manager'
import { useStepper } from '@renderer/draft/root-layout/hooks/use-stepper'
import {
  defaultAdditionalCucumberTime,
  defaultAdditionalPomodoroTime
} from '@renderer/draft/root-layout/const'

import { PomadoroLayout } from './ui/pomadoro-layout'
import { FooterNav } from './ui/footer-nav'
import { TaskList } from './ui/task-list'
import { TimeList } from '@renderer/draft/root-layout/components/pomodoro-content/ui/time-list'
import { Remove, Add } from '@mui/icons-material'
import { DropDown } from '@renderer/draft/root-layout/components/pomodoro-content/ui/drop-down'

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
    toggleNotPlaning,
    incrementPlanningSecond,
    incrementSkippedSecond,
    incrementNotPlanningSecond
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
    isNotPlanning,
    planningSeconds,
    skippedSeconds,
    notPlanningSeconds
  } = dayData || {}
  const taskList = timeSegmentList[activeStepIndex]?.taskList || []
  const isSkippingTime =
    isPlanning === false &&
    isNotPlanning === false &&
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

  useConditionsInterval([isNotPlanning], () => {
    if (isNotPlanning) {
      incrementNotPlanningSecond()
    }
  })

  const [backLogType, setBackLogType] = useState('tomato')
  const activeTimeSegmentType = timeSegmentList[activeStepIndex].type

  return (
    <PomadoroLayout
      isLoading={isEmpty(dayData)}
      stepper={() => (
        <Stepper activeStepIndex={activeStepIndex}>
          {timeSegmentList.map((props, index) => (
            <Step
              key={index}
              activeStepIndex={activeStepIndex}
              index={index}
              onClick={() => {
                handleStep(index)
              }}
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
            onTaskTextChange={updateTaskValue}
            onTaskDescriptionChange={updateTaskDescription}
            onDelete={deleteTask}
            activeStepIndex={activeStepIndex}
            navigation={(id) => (
              <Fab size="small" color="error" aria-label="add">
                <Remove onClick={() => moveTaskToBackLog(id, activeStepIndex)} />
              </Fab>
            )}
            placeholder={'Добавьте задачу или возьмите из беклога'}
          />

          <Button
            variant={'contained'}
            onClick={() =>
              createNewTask({ segmentIndex: activeStepIndex, type: activeTimeSegmentType })
            }
          >
            Добавить задачу
          </Button>

          <br />
          <br />
          <br />

          <DropDown label="Беклог">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={backLogType}
                onChange={(_, value) => setBackLogType(value)}
                aria-label="basic tabs example"
              >
                <Tab label="Tomato" value="tomato" />
                <Tab label="Cucumber" value="cucumber" />
              </Tabs>
            </Box>

            <TaskList
              taskList={backLog.filter(({ type }) => type === backLogType)}
              onTaskToggle={toggleTaskFinished}
              onTaskTextChange={updateTaskValue}
              onTaskDescriptionChange={updateTaskDescription}
              onDelete={deleteTask}
              navigation={(id) => (
                <Fab
                  size="small"
                  color="error"
                  aria-label="add"
                  disabled={activeTimeSegmentType !== backLogType}
                >
                  <Add onClick={() => moveTaskToTimeSegment(id, activeStepIndex)} />
                </Fab>
              )}
              placeholder={'Бек лог задачи'}
            />

            <Button variant={'contained'} onClick={() => createNewTask({ type: backLogType })}>
              Добавить в бек лог
            </Button>
          </DropDown>

          <TimeList
            timeSegmentList={timeSegmentList}
            planningSeconds={planningSeconds}
            skippedSeconds={skippedSeconds}
            notPlanningSeconds={notPlanningSeconds}
          />

          <FooterNav>
            <Button variant={'contained'} onClick={() => toggleNotPlaning()}>
              {isNotPlanning ? 'Остановить процесс не по плану' : 'Запустить процесс не по плану'}
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
