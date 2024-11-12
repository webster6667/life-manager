import {
  Box,
  CircularProgress,
  Step,
  Stepper,
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

export const PomodoroContent: FC<{ contentData: DateContent; selectedFilePath: string }> = ({
  contentData,
  selectedFilePath
}) => {
  const [isAdditionalTimeCountsOpen, toggleAdditionalTimeCountsOpen] = useToggle(false)
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
    <Box sx={{ width: '100%' }}>
      <>
        {isEmpty(dayData) ? (
          <CircularProgress />
        ) : (
          <>
            <Stepper
              activeStep={activeStepIndex}
              alternativeLabel
              connector={
                <Box sx={{ width: '100px', height: '2px', background: 'silver', mr: '16px' }} />
              }
              sx={{
                padding: '0 20px',
                paddingBottom: '60px',
                paddingTop: '30px',
                alignItems: 'center',
                overflowX: 'scroll',
                position: 'sticky',
                top: '0',
                background: 'white',
                zIndex: '9999',
                boxShadow: '0 0 17px #0000007d',
                scrollbarWidth: 'none',

                '& .MuiStep-horizontal': {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }
              }}
            >
              {timeSegmentList.map(({ ...props }, index) => {
                return (
                  <Step key={index} sx={{ flexDirection: 'column' }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        margin: 'auto 0',
                        borderRadius: '50%',
                        cursor: index === activeStepIndex ? 'auto' : 'pointer',
                        boxShadow:
                          index === activeStepIndex
                            ? 'inset 0 0 15px 1px #a2a2ffa6'
                            : 'inset 0 0 0 1px silver',
                        '& > div:hover > div:first-child': {
                          transform: index === activeStepIndex ? `scale(1)` : `scale(1.2)`
                        }
                      }}
                      onClick={handleStep(index)}
                    >
                      <TimeSegment
                        timerData={timerData}
                        setDayData={setDayData}
                        index={index}
                        timeSegmentList={timeSegmentList}
                        addTimeForTimeSegment={addTimeForTimeSegment}
                        {...props}
                      />
                    </Box>
                  </Step>
                )
              })}
            </Stepper>
            <br />

            <Box sx={{ p: '10px' }}>
              <Box>
                {taskList.length ? (
                  <List>
                    {taskList.map(({ isFinished, description = '', value, id }, index) => (
                      <ListItem
                        key={index}
                        alignItems={'flex-start'}
                        sx={{
                          display: 'flex',
                          columnGap: '10px'
                        }}
                      >
                        <Checkbox
                          checked={isFinished}
                          onChange={() => toggleTaskFinished(id, activeStepIndex)}
                        />
                        <Stack flexGrow={1} spacing={3}>
                          <TextField
                            variant="standard"
                            value={value}
                            placeholder={`Задача номер ${index + 1}`}
                            onChange={(e) => updateTaskValue(id, e.target.value, activeStepIndex)}
                            fullWidth
                          />
                          <MarkdownEditor
                            value={description}
                            placeholder={`Задача номер ${index + 1}`}
                            updateTaskValue={updateTaskDescription}
                            id={id}
                            activeStepIndex={activeStepIndex}
                          />
                        </Stack>
                        <Fab size="small" color="error" aria-label="add">
                          <Remove onClick={() => moveTaskToBackLog(id, activeStepIndex)} />
                        </Fab>
                        <Fab size="small" color="error" aria-label="add">
                          <Delete onClick={() => deleteTask(id, activeStepIndex)} />
                        </Fab>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="h5">Добавьте задачу или возьмите из беклога</Typography>
                )}
              </Box>

              <br />

              <Button
                variant={'contained'}
                onClick={() => createNewTask({ value: '', segmentIndex: activeStepIndex })}
              >
                Добавить задачу
              </Button>

              <Divider sx={{ m: '20px 0' }} />

              <Box>
                <List>
                  {backLog.map(({ isFinished, value, description = '', id }, index) => (
                    <ListItem
                      key={index}
                      sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <Checkbox checked={isFinished} onChange={() => toggleTaskFinished(id)} />
                      <Box sx={{ flexGrow: '1' }}>
                        <TextField
                          variant="standard"
                          value={value}
                          placeholder={`Задача номер ${index + 1}`}
                          onChange={(e) => updateTaskValue(id, e.target.value)}
                          fullWidth
                        />
                        <TextareaAutosize
                          value={description}
                          onChange={(e) => updateTaskDescription(id, e.target.value)}
                        />
                      </Box>
                      <Fab size="small" color="primary" aria-label="add">
                        <Add onClick={() => moveTaskToTimeSegment(id, activeStepIndex)} />
                      </Fab>
                      <Fab size="small" color="error" aria-label="add">
                        <Delete onClick={() => deleteTask(id)} />
                      </Fab>
                    </ListItem>
                  ))}
                </List>
              </Box>

              <br />

              <List>
                <Box>
                  <ListItemButton onClick={toggleAdditionalTimeCountsOpen}>
                    <ListItemText primary="Доп временные расчеты" />
                    {isAdditionalTimeCountsOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={isAdditionalTimeCountsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton>
                        Рабочее время: {formatSecondsToRemainingTime(planningSeconds)}
                      </ListItemButton>
                      <ListItemButton>
                        Доп время для работы: {formatSecondsToRemainingTime(planningSeconds)}
                      </ListItemButton>
                      <ListItemButton>
                        Не рабочее время: {formatSecondsToRemainingTime(planningSeconds)}
                      </ListItemButton>
                      <ListItemButton>
                        Доп не рабочее время: {formatSecondsToRemainingTime(planningSeconds)}
                      </ListItemButton>
                    </List>
                  </Collapse>
                </Box>
                <Divider />
                <ListItem>Планирование: {formatSecondsToRemainingTime(planningSeconds)}</ListItem>
                <ListItem>Не продуктивно: {formatSecondsToRemainingTime(skippedSeconds)}</ListItem>
                <ListItem>Отвлекли: {formatSecondsToRemainingTime(skippedSeconds)}</ListItem>
              </List>

              <Stack flexDirection={'row'} columnGap={'15px'}>
                <Button variant={'contained'} onClick={() => createNewTask({ value: `` })}>
                  Добавить задачу
                </Button>

                <Button variant={'contained'} onClick={() => togglePlaning()}>
                  {isPlanning ? 'Остановить планнинг' : 'Запустить планинг'}
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </>
    </Box>
  )
}
