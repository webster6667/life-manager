import { useState, FC, HTMLProps } from 'react'

import { useDidMount } from '@common-hook'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { createYearDaysTree } from '@renderer/widgets/pomodoro/sidebar/helpers/create-year-days-tree'

import { getYear } from 'date-fns'
import { CircularProgress } from '@mui/material'

import { getStringFromDate } from '@renderer/draft/root-layout/helpers/get-string-from-date'
import { getMonthNumberFromDateString } from '@renderer/draft/root-layout/helpers/get-month-number-from-date-string'
import { PomodoroContent } from '@renderer/draft/root-layout/components/pomodoro-content/index'
import { TemplateGrid } from '@renderer/draft/root-layout/ui/template-grid'
import { RootSidebar } from '@renderer/draft/root-layout/ui/root-sidebar'
import { YearsTab } from '@renderer/draft/root-layout/types'
import { DateContent, TimeSegmentProps } from '@renderer/draft/root-layout/types'

const today = new Date()
const currentYear = getYear(today)
const rootLibDir = 'years'

export const RootLayout: FC<HTMLProps<HTMLDivElement>> = () => {
  const [yearsTabs, setYearsTabs] = useState<YearsTab[]>([])
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

    const selectedDateContent = JSON.parse(selectedDateContentJson) as TimeSegmentProps[]
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

  return (
    <TemplateGrid
      sidebarContent={() => (
        <RootSidebar
          selectedDate={selectedDate}
          yearsTabs={yearsTabs}
          selectDateHandler={selectDateHandler}
        />
      )}
      selectedContend={() => (
        <>
          {(isContentLoading || contentData === null) && <CircularProgress />}
          {contentData !== null && (
            <PomodoroContent contentData={contentData} selectedFilePath={selectedFilePath} />
          )}
        </>
      )}
    />
  )
}
