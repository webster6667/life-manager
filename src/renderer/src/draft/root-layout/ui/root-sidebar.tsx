import { Box, Chip, Collapse, List, ListItemButton, ListItemText } from '@mui/material'
import capitalize from 'lodash/capitalize'
import { getMonthNameByNumber } from '@renderer/draft/root-layout/helpers/get-month-name-by-number'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { getStringFromDate } from '@renderer/draft/root-layout/helpers/get-string-from-date'
import { isToday } from 'date-fns'
import { FC, useState } from 'react'
import { getTreeDaysOfYear } from '@renderer/helpers/get-tree-days-of-year'
import { YearsTab } from '@renderer/draft/root-layout/types'

export const RootSidebar: FC<{
  yearsTabs: YearsTab[]
  selectedDate: string
  selectDateHandler: (date: string) => Promise<void>
}> = ({ yearsTabs, selectedDate, selectDateHandler }) => {
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
    <List
      sx={{ width: '100%', bgcolor: 'background.paper', p: '0', height: '100%', overflow: 'auto' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {daysTreeOfSelectedYears.map(({ monthDaysList, monthNumber, isTodayMonth }) => (
        <Box key={monthNumber}>
          <ListItemButton
            onClick={() => monthClickHandler(monthNumber)}
            selected={+selectedDate.split('-')[1] == +monthNumber}
          >
            <ListItemText primary={capitalize(getMonthNameByNumber(monthNumber))} />{' '}
            {isTodayMonth && <Chip label="Текущий" color="primary" />}
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
                    <ListItemText primary={dateString} />{' '}
                    {isToday(date) && <Chip label="Сегодня" color="primary" />}
                  </ListItemButton>
                )
              })}
            </List>
          </Collapse>
        </Box>
      ))}
    </List>
  )
}
