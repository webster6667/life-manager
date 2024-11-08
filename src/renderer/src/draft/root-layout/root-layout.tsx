import { useState, FC, HTMLProps } from 'react'

import { useDidMount } from '@common-hook'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { createYearDaysTree } from '@renderer/widgets/pomodoro/sidebar/helpers/create-year-days-tree'
import { getTreeDaysOfYear } from '@renderer/helpers/get-tree-days-of-year'
import { getYear } from 'date-fns'
import {
  Box,
  CircularProgress,
  Collapse,
  Grid2 as Grid,
  List,
  ListItemButton,
  ListItemText,
  Stack
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

import { getMonthNameByNumber } from '@renderer/draft/root-layout/helpers/get-month-name-by-number'
import capitalize from 'lodash/capitalize'

import { getStringFromDate } from '@renderer/draft/root-layout/helpers/get-string-from-date'
import { getMonthNumberFromDateString } from '@renderer/draft/root-layout/helpers/get-month-number-from-date-string'
import {
  DateContent,
  PomodoroContent,
  TimeSegment
} from '@renderer/draft/root-layout/components/pomodoro-content'

const today = new Date()
const currentYear = getYear(today)
const rootLibDir = 'years'

export const RootLayout: FC<HTMLProps<HTMLDivElement>> = () => {
  const [yearsTabs, setYearsTabs] = useState<
    { year: string; isSelected: boolean; isCurrentYear: boolean }[]
  >([])
  const [selectedDate, setSelectedDate] = useState('')
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [contentData, setContentData] = useState<DateContent>(null)
  const [selectedFilePath, setSelectedFilePath] = useState('')

  const selectDateHandler = async (date: string) => {
    setIsContentLoading(true)
    setSelectedDate(date)
    const monthNumber = getMonthNumberFromDateString(date)
    const filePath = `${rootLibDir}/${currentYear}/${monthNumber}/${date}.json`
    const selectedDateContentJson = await fileSystemAdapter.readFile(filePath)
    setSelectedFilePath(filePath)

    const selectedDateContent = JSON.parse(selectedDateContentJson) as TimeSegment[]
    setContentData(selectedDateContent)
    setIsContentLoading(false)
  }

  useDidMount(async () => {
    const yearsFolders = await fileSystemAdapter.readDir(rootLibDir, { createIfNotExist: true })
    const isCurrentYearDirNotExist = !yearsFolders.includes(String(currentYear))

    if (isCurrentYearDirNotExist) {
      await createYearDaysTree(currentYear)
    }

    const yearsTabsWithFlags = yearsFolders.map((year) => ({
      year,
      isSelected: +year == currentYear,
      isCurrentYear: +year == currentYear
    }))

    setYearsTabs(yearsTabsWithFlags)
    await selectDateHandler(getStringFromDate(today))
  })

  const selectedYear = +yearsTabs.find((item) => item.isSelected === true)?.year
  const daysTreeOfSelectedYears = selectedYear ? getTreeDaysOfYear(selectedYear) : []

  const [openMonthNumber, setOpenMonthNumber] = useState('')

  const monthClickHandler = (monthNumber: string) => {
    if (openMonthNumber === monthNumber) {
      setOpenMonthNumber('')
    } else {
      setOpenMonthNumber(monthNumber)
    }
  }

  return (
    <Grid container height="100vh">
      <Grid
        size={{ xs: 6, md: 3 }}
        sx={({ palette }) => ({
          bgcolor: palette.background['paper'],
          borderRight: '1px solid silver',
          height: '100vh',
          overflow: 'scroll'
        })}
      >
        <List
          sx={{ width: '100%', bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {daysTreeOfSelectedYears.map(({ monthDaysList, monthNumber, isTodayMonth }) => (
            <Box key={monthNumber}>
              <ListItemButton
                onClick={() => monthClickHandler(monthNumber)}
                selected={isTodayMonth}
              >
                <ListItemText primary={capitalize(getMonthNameByNumber(monthNumber))} />
                {openMonthNumber == monthNumber ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openMonthNumber == monthNumber} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {monthDaysList.map(({ date }) => {
                    const dateString = getStringFromDate(date)

                    return (
                      <ListItemButton
                        key={dateString}
                        sx={{ pl: 4 }}
                        onClick={() => selectDateHandler(dateString)}
                        selected={selectedDate === dateString}
                      >
                        <ListItemText primary={dateString} />
                      </ListItemButton>
                    )
                  })}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </Grid>
      <Grid size={{ xs: 6, md: 9 }} sx={{ position: 'relative' }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: 'center',
            height: '100vh',
            overflow: 'scroll'
          }}
        >
          {(isContentLoading || contentData === null) && <CircularProgress />}
          {contentData !== null && (
            <PomodoroContent contentData={contentData} selectedFilePath={selectedFilePath} />
          )}
        </Stack>
      </Grid>
    </Grid>
  )
}
