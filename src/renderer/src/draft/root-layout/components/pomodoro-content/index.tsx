import { Box, Button, Fab, Tab, Tabs } from '@mui/material'

import { FC, useState } from 'react'
import { isEmpty } from 'lodash'

import { Stepper } from './ui/stepper'
import { Step } from './ui/step'

import { useStepperTimer } from '@renderer/draft/root-layout/hooks/use-stepper-timer'
import { useConditionsInterval } from '@front-shared/hooks/use-conditions-interval'
import { TimeSegment } from '@renderer/draft/root-layout/components/time-segment'
import { DateContent } from '@renderer/draft/root-layout/types'
import { useTaskManager } from '@renderer/draft/root-layout/hooks/use-task-manager'
import { useStepper } from '@renderer/draft/root-layout/hooks/use-stepper'

import { PomadoroLayout } from './ui/pomadoro-layout'
import { FooterNav } from './ui/footer-nav'
import { TaskList } from './ui/task-list'
import { TimeList } from '@renderer/draft/root-layout/components/pomodoro-content/ui/time-list'
import { Remove, Add } from '@mui/icons-material'
import { DropDown } from '@renderer/draft/root-layout/components/pomodoro-content/ui/drop-down'
import { format } from 'date-fns'

export const PomodoroContent: FC<{
  contentData: DateContent
  selectedFilePath: string
  selectedDate: string
}> = ({ contentData, selectedFilePath, selectedDate }) => {
  const isStepperForToday = format(new Date(), 'yyyy-MM-dd') === selectedDate

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
    incrementNotPlanningSecond,
    toggleTimeObserving
  } = useTaskManager(contentData, selectedFilePath)

  const {
    timeSegmentList = [],
    backLog = [],
    isPlanning,
    isNotPlanning,
    planningSeconds,
    skippedSeconds,
    notPlanningSeconds,
    isTimeObserving = true
  } = dayData || {}

  const {
    activeStepIndex,
    selectedStepIndex,
    selectStepHandler,
    hasStepInProgress,
    isActiveStepPaused,
    isStepperNotFinished,
    isStepperWasInitiated
  } = useStepper(timeSegmentList)

  const timerData = useStepperTimer({
    onFinish: finishTimeSegment,
    isActiveStepPaused,
    isStepperForToday
  })

  const taskList = timeSegmentList[selectedStepIndex]?.taskList || []

  const shouldWriteSkippingTime =
    isPlanning === false &&
    isNotPlanning === false &&
    hasStepInProgress === false &&
    isStepperWasInitiated &&
    isTimeObserving
  const shouldWritePlanningTime = isPlanning && isStepperForToday
  const shouldWriteNotPlanning = isNotPlanning && isStepperForToday

  useConditionsInterval([shouldWritePlanningTime], () => {
    if (shouldWritePlanningTime) {
      incrementPlanningSecond()
    }
  })

  useConditionsInterval([shouldWriteSkippingTime], () => {
    if (shouldWriteSkippingTime) {
      incrementSkippedSecond()
    }
  })

  useConditionsInterval([shouldWriteNotPlanning], () => {
    if (shouldWriteNotPlanning) {
      incrementNotPlanningSecond()
    }
  })

  const [backLogType, setBackLogType] = useState('tomato')
  const activeTimeSegmentType = timeSegmentList[activeStepIndex].type

  return (
    <PomadoroLayout
      isLoading={isEmpty(dayData)}
      stepper={() => (
        <Stepper selectedStepIndex={selectedStepIndex}>
          {timeSegmentList.map((props, index) => (
            <Step
              key={index}
              selectedStepIndex={selectedStepIndex}
              index={index}
              onClick={() => {
                selectStepHandler(index)
              }}
            >
              <TimeSegment
                timerData={timerData}
                setDayData={setDayData}
                index={index}
                timeSegmentList={timeSegmentList}
                isStepperForToday={isStepperForToday}
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
            selectedStepIndex={selectedStepIndex}
            navigation={(id) => (
              <Fab size="small" color="error" aria-label="add">
                <Remove onClick={() => moveTaskToBackLog(id, selectedStepIndex)} />
              </Fab>
            )}
            placeholder={'Добавьте задачу или возьмите из беклога'}
          />

          <Button
            variant={'contained'}
            onClick={() =>
              createNewTask({ segmentIndex: selectedStepIndex, type: activeTimeSegmentType })
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
                  <Add onClick={() => moveTaskToTimeSegment(id, selectedStepIndex)} />
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

          {isStepperForToday && (
            <FooterNav>
              <Button
                variant={'contained'}
                onClick={() => toggleNotPlaning()}
                disabled={!isTimeObserving}
              >
                {isNotPlanning ? 'Остановить процесс не по плану' : 'Запустить процесс не по плану'}
              </Button>
              <Button
                variant={'contained'}
                onClick={() => togglePlaning()}
                disabled={!isTimeObserving}
              >
                {isPlanning ? 'Остановить планнинг' : 'Запустить планинг'}
              </Button>
              {isStepperNotFinished && isStepperNotFinished && (
                <Button
                  variant={'contained'}
                  color={isTimeObserving ? 'error' : 'success'}
                  onClick={() => toggleTimeObserving()}
                >
                  {isTimeObserving ? 'Прекратить счет времени' : 'Запустить счет времени'}
                </Button>
              )}
            </FooterNav>
          )}
        </>
      )}
    />
  )
}
