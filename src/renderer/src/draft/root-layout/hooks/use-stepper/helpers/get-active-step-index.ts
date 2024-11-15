import { TimeSegmentProps } from '@renderer/draft/root-layout/types'

export const getActiveStepIndex = (timeSegmentList: TimeSegmentProps[]) => {
  const firstStenIndexInReadyToStart = timeSegmentList.findIndex(({ status }) =>
    ['waiting-start', 'process', 'paused'].includes(status)
  )

  return firstStenIndexInReadyToStart == -1 ? 0 : firstStenIndexInReadyToStart
}
