import { FC } from 'react'
import { Updater } from 'use-immer'
import {
  CurrentTimerResult,
  StepperData,
  TimeSegmentProps
} from '@renderer/draft/root-layout/types'
import { getPercentage } from '@renderer/draft/root-layout/helpers/get-percentage'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { PlayArrow, Pause, Add } from '@mui/icons-material'
import { formatSecondsToRemainingTime } from '@renderer/draft/root-layout/helpers/format-seconds-to-remaining-time'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ReactComponent as Tomato } from '@assets/img/icons/tomato/tom.svg'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ReactComponent as Cucumber } from '@assets/img/icons/cucumbers/cuc.svg'

import { getTimeStringFromTimerData } from '@renderer/draft/root-layout/helpers/get-time-string-from-timer-data'
import {
  defaultAdditionalCucumberTime,
  defaultAdditionalPomodoroTime
} from '@renderer/draft/root-layout/const'

export const TimeSegment: FC<
  TimeSegmentProps & {
    timerData: CurrentTimerResult
    setDayData: Updater<StepperData>
    index: number
    timeSegmentList: TimeSegmentProps[]
    isStepperForToday: boolean
  }
> = ({
  status,
  type,
  timeToFinish,
  timerData,
  index,
  setDayData,
  additionalTime,
  timeSegmentList,
  isStepperForToday
}) => {
  const isInProcess = status === 'process'
  const isFinished = status === 'finished'
  const isPaused = status === 'paused'
  const nextSiblingStatus = timeSegmentList[index + 1]?.status || ''
  const isLastStep = nextSiblingStatus === ''

  const addTimeForTimeItem = (timeSegmentIndex: number) => {
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

  const startTimeItemHandler = () => {
    setDayData((draft) => {
      const currentStatus = draft.timeSegmentList[index].status
      draft.timeSegmentList[index].status = 'process'
      draft.isPlanning = false
      draft.isNotPlanning = false
      draft.isTimeObserving = true

      if (currentStatus === 'paused') {
        timerData.startWithSettings(+timerData.totalSeconds || timeToFinish)
      } else {
        timerData.startWithSettings(timeToFinish)
      }
    })
  }

  const pausedHandler = () => {
    setDayData((draft) => {
      draft.timeSegmentList[index].status = 'paused'
      timerData.pause()
    })
  }

  const value =
    isInProcess || isPaused ? getPercentage(timeToFinish - timerData.totalSeconds, timeToFinish) : 0
  const time = isInProcess
    ? getTimeStringFromTimerData(timerData)
    : formatSecondsToRemainingTime(isPaused ? timerData.totalSeconds : timeToFinish)

  const additionalNavByStatus = {
    'waiting-start': () => <PlayArrow sx={{ width: '15px' }} onClick={startTimeItemHandler} />,
    paused: () => <PlayArrow sx={{ width: '15px' }} onClick={startTimeItemHandler} />,
    process: () => <Pause onClick={pausedHandler} />
  }

  return (
    <Box
      sx={{
        width: 100,
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          '& .MuiCircularProgress-root + svg': {
            width: '25px',
            height: '50px',
            position: 'absolute',
            left: '50%',
            top: '47%',
            transform: `translate(-50%, -50%)`
          },
          '& svg#tomato path': {
            fill: '#d00000'
          },
          '& svg#tomato path#up': {
            fill: '#008e00'
          },
          '& svg#cucumber path': {
            fill: '#008e00'
          }
        }}
      >
        <CircularProgress
          size={50} // Size of the progress ring
          thickness={5} // Thickness of the progress ring
          variant="determinate" // Use determinate to show progress
          value={isFinished ? 100 : value} // Set progress value
          sx={{
            // position: 'absolute',
            color: 'blue', // No fill color
            boxShadow: 'inset 0 0 0 5px silver',
            borderRadius: '50%',
            circle: {
              stroke: '#3bc181' // Color of the ring itself
            }
          }}
        />
        {type === 'tomato' ? <Tomato /> : <Cucumber />}
      </Box>

      <Stack
        sx={{
          position: 'absolute',
          top: '110%',
          width: '100%',
          left: '0'
        }}
        justifyContent="center"
      >
        {isStepperForToday ? (
          <Stack flexDirection="row" columnGap="5px" justifyContent="center" alignItems="center">
            {additionalNavByStatus[status] && additionalNavByStatus[status]()}
            <Typography variant="subtitle2">{time}</Typography>
            {(isLastStep ||
              nextSiblingStatus === 'waiting-start' ||
              nextSiblingStatus === 'not-started') && (
              <Add onClick={() => addTimeForTimeItem(index)} />
            )}
          </Stack>
        ) : (
          <Typography sx={{ width: '100%', textAlign: 'center' }} variant="subtitle2">
            {time}
          </Typography>
        )}
      </Stack>
    </Box>
  )
}
