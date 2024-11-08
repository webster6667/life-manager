import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import { getTreeDaysOfYear } from '@renderer/helpers/get-tree-days-of-year'

const rootLibDir = 'years'

export const createYearDaysTree = async (year) => {
  const pathToCurrentYearDir = await fileSystemAdapter.createDirectory(`${rootLibDir}/${year}`)

  const daysOfCurrentYearTree = getTreeDaysOfYear(year)

  for (const { monthNumber, monthDaysList } of daysOfCurrentYearTree) {
    const createdMonthFolderPath = await fileSystemAdapter.createDirectory(
      `${pathToCurrentYearDir}/${monthNumber}`
    )

    for (const { date } of monthDaysList) {
      const dayDate = date.toISOString().split('T')[0]
      await fileSystemAdapter.createFile(`${createdMonthFolderPath}/${dayDate}.json`, '{}')
    }
  }

  return daysOfCurrentYearTree
}
