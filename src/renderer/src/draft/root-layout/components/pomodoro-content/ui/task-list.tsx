import { Box, Checkbox, Fab, List, ListItem, Stack, TextField, Typography } from '@mui/material'
import { Task } from '@renderer/draft/root-layout/types'
import { FC } from 'react'
import { MarkdownEditor } from '@renderer/draft/root-layout/components/mark-down-editor'
import { Delete, Remove } from '@mui/icons-material'
import { useTaskManager } from '@renderer/draft/root-layout/hooks/use-task-manager'

type useTaskManagerMethods = ReturnType<typeof useTaskManager>

export const TaskList: FC<{
  taskList: Task[]
  placeholder?: string
  onTaskToggle: useTaskManagerMethods['toggleTaskFinished']
  onTaskTextChange: useTaskManagerMethods['updateTaskValue']
  onTaskDescriptionChange: useTaskManagerMethods['updateTaskDescription']
  onReturn: useTaskManagerMethods['moveTaskToBackLog']
  onDelete: useTaskManagerMethods['deleteTask']
  activeStepIndex?: number
}> = ({
  activeStepIndex,
  taskList = [],
  placeholder,
  onTaskToggle,
  onTaskTextChange,
  onTaskDescriptionChange,
  onReturn,
  onDelete
}) => {
  return (
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
                <Checkbox checked={isFinished} onChange={() => onTaskToggle(id, activeStepIndex)} />
                <Stack flexGrow={1} spacing={3}>
                  <TextField
                    variant="standard"
                    value={value}
                    placeholder={`Задача номер ${index + 1}`}
                    onChange={(e) => onTaskTextChange(id, e.target.value, activeStepIndex)}
                    fullWidth
                  />
                  <MarkdownEditor
                    value={description}
                    onChange={(value) => onTaskDescriptionChange(id, value, activeStepIndex)}
                  />
                </Stack>
                <Fab size="small" color="error" aria-label="add">
                  <Remove onClick={() => onReturn(id, activeStepIndex)} />
                </Fab>
                <Fab size="small" color="error" aria-label="add">
                  <Delete onClick={() => onDelete(id, activeStepIndex)} />
                </Fab>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="h5">{placeholder || 'Пусто'}</Typography>
        )}
      </Box>
    </Box>
  )
}
