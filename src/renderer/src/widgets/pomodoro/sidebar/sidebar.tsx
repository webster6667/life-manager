import { FC, useState } from 'react'

import { SidebarProps } from './types'
import { useDidMount } from '@common-hook'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { getYear } from 'date-fns'
import { createYearDaysTree } from '@renderer/widgets/pomodoro/sidebar/helpers/create-year-days-tree'
import { getTreeDaysOfYear } from '@renderer/helpers/get-tree-days-of-year'

const today = new Date()
const currentYear = getYear(today)
const rootLibDir = 'years'

export const Sidebar: FC<SidebarProps> = (props) => {
  const [yearsTabs, setYearsTabs] =
    useState<{ year: string; isSelected: boolean; isCurrentYear: boolean }[]>()

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
  })

  const selectedYear = +yearsTabs.find((item) => item.isSelected === true)?.year
  const daysTreeOfSelectedYears = selectedYear ? getTreeDaysOfYear(selectedYear) : []

  return <div></div>
}
