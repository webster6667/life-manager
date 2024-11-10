import { FC } from 'react'
import { Updater } from 'use-immer'
import {
  CurrentTimerResult,
  StepperData,
  TimeSegment as TimeSegmentProps
} from '@renderer/draft/root-layout/types'
import { getPercentage } from '@renderer/draft/root-layout/helpers/get-percentage'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { PlayArrow, Pause } from '@mui/icons-material'
import { formatSecondsToRemainingTime } from '@renderer/draft/root-layout/helpers/format-seconds-to-remaining-time'

import { ReactComponent as Tomato } from '@assets/img/icons/tomato/tom.svg'
import { ReactComponent as Cucumber } from '@assets/img/icons/cucumbers/cuc.svg'

export const TimeSegment: FC<
  TimeSegmentProps & {
    timerData: CurrentTimerResult
    setDayData: Updater<StepperData>
    index: number
  }
> = ({ status, type, timeToFinish, timerData, index, setDayData }) => {
  const isReadyForInitStatus = status === 'waiting-start'
  const isInProcess = status === 'process'
  const isPaused = status === 'paused'

  const startTimeItemHandler = () => {
    setDayData((draft) => {
      const currentStatus = draft.timeSegmentList[index].status
      draft.timeSegmentList[index].status = 'process'
      draft.isPlanning = false

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

  const value = isInProcess ? getPercentage(timeToFinish - timerData.totalSeconds, timeToFinish) : 0

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
          '& svg': {
            width: '25px',
            height: '50px',
            position: 'absolute',
            left: '50%',
            top: '43%',
            transform: `translate(-50%, -50%)`
          },
          '& svg#tomato path': {
            fill: '#d00000'
          },
          '& svg#tomato path#up': {
            fill: 'black'
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
          value={value} // Set progress value
          sx={{
            // position: 'absolute',
            color: 'blue', // No fill color
            boxShadow: 'inset 0 0 0 5px silver',
            borderRadius: '50%',
            circle: {
              stroke: 'white' // Color of the ring itself
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
        {isReadyForInitStatus ? (
          <Stack flexDirection="row" columnGap="5px" justifyContent="center" alignItems={'center'}>
            <PlayArrow sx={{ width: '15px' }} onClick={startTimeItemHandler} />
            <Typography variant="subtitle2">
              {formatSecondsToRemainingTime(timeToFinish)}
            </Typography>
          </Stack>
        ) : (
          <Stack flexDirection="row" columnGap="5px" justifyContent="center" alignItems="center">
            {isInProcess ? (
              <>
                <Pause onClick={pausedHandler} />{' '}
                <Typography variant="subtitle2">
                  {timerData.minutes}:{timerData.seconds}
                </Typography>
              </>
            ) : (
              <>
                {isPaused && <PlayArrow sx={{ width: '15px' }} onClick={startTimeItemHandler} />}
                <Typography variant="subtitle2">
                  {formatSecondsToRemainingTime(isPaused ? timerData.totalSeconds : timeToFinish)}
                </Typography>
              </>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
