import { Box, Collapse, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { formatSecondsToRemainingTime } from '@renderer/draft/root-layout/helpers/format-seconds-to-remaining-time'
import { useToggle } from '@common-hook'
import { TimeSegmentProps } from '@renderer/draft/root-layout/types'
import { FC } from 'react'

export const TimeList: FC<{
  timeSegmentList: TimeSegmentProps[]
  planningSeconds: number
  skippedSeconds: number
  notPlanningSeconds: number
}> = ({ timeSegmentList, planningSeconds, skippedSeconds, notPlanningSeconds }) => {
  const [isAdditionalTimeCountsOpen, toggleAdditionalTimeCountsOpen] = useToggle(false)

  const { commonTime, tomatoTime, cucumberTime, tomatoTimeAdditional, cucumberTimeAdditional } =
    timeSegmentList.reduce(
      (acc, { additionalTime, timeToFinish, type }) => {
        acc[`${type}Time`] += timeToFinish
        acc[`${type}TimeAdditional`] += additionalTime
        acc.commonTime += timeToFinish

        return acc
      },
      {
        tomatoTime: 0,
        tomatoTimeAdditional: 0,
        cucumberTime: 0,
        cucumberTimeAdditional: 0,
        commonTime: 0
      }
    )

  return (
    <List>
      <Box>
        <ListItemButton onClick={toggleAdditionalTimeCountsOpen}>
          <ListItemText primary="Доп временные расчеты" />
          {isAdditionalTimeCountsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isAdditionalTimeCountsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton>
              Рабочее время: {formatSecondsToRemainingTime(tomatoTime)}
            </ListItemButton>
            <ListItemButton>
              Доп время для работы: {formatSecondsToRemainingTime(tomatoTimeAdditional)}
            </ListItemButton>
            <ListItemButton>
              Не рабочее время: {formatSecondsToRemainingTime(cucumberTime)}
            </ListItemButton>
            <ListItemButton>
              Доп не рабочее время: {formatSecondsToRemainingTime(cucumberTimeAdditional)}
            </ListItemButton>
            <ListItemButton>
              Общее время процессов: {formatSecondsToRemainingTime(commonTime)}
            </ListItemButton>
          </List>
        </Collapse>
      </Box>
      <Divider />
      <ListItem>Планирование: {formatSecondsToRemainingTime(planningSeconds)}</ListItem>
      <ListItem>Не продуктивно: {formatSecondsToRemainingTime(skippedSeconds)}</ListItem>
      <ListItem>Отвлекли: {formatSecondsToRemainingTime(notPlanningSeconds)}</ListItem>
    </List>
  )
}
