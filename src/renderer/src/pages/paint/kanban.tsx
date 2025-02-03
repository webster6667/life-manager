import { FC, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  TextField,
  ListItemIcon
} from '@mui/material'
import { getShiftedArray } from '@renderer/helpers/get-shifted-array'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import { AlertDialog } from '@renderer/front-shared/ui-kit/dialog'

// const initialColumns = {
//   'column-1': {
//     id: 'column-1',
//     title: 'To Do',
//     tasks: [
//       { id: 'task-1', content: 'Task 1' },
//       { id: 'task-2', content: 'Task 2' },
//       { id: 'task-3', content: 'Task 3' },
//       { id: 'task-4', content: 'Task 4' },
//       { id: 'task-5', content: 'Task 5' },
//       { id: 'task-6', content: 'Task 6' },
//       { id: 'task-7', content: 'Task 7' }
//     ]
//   },
//   'column-2': {
//     id: 'column-2',
//     title: 'In Progress',
//     tasks: [
//       { id: 'task-8', content: 'Task 8' },
//       { id: 'task-9', content: 'Task 9' }
//     ]
//   },
//   'column-3': {
//     id: 'column-3',
//     title: 'Done',
//     tasks: [{ id: 'task-12', content: 'Task 12' }]
//   }
// }

const initialColumns = [
  {
    id: 'column-1',
    title: 'To Do',
    tasks: [
      { id: 'task-1', content: 'Task 1' },
      { id: 'task-2', content: 'Task 2' },
      { id: 'task-3', content: 'Task 3' }
    ]
  },
  {
    id: 'column-2',
    title: 'In Progress',
    tasks: [
      { id: 'task-4', content: 'Task 4' },
      { id: 'task-5', content: 'Task 5' }
    ]
  },
  { id: 'column-3', title: 'Done', tasks: [{ id: 'task-6', content: 'Task 6' }] }
]

const Column = ({ columnId, column, index, addTask, updateColumnTitle, deleteColumn }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(column.title)
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = () => {
    deleteColumn(index)
    setOpen(false)
  }

  const handleSave = () => {
    updateColumnTitle(index, newTitle)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setNewTitle(column.title)
    setIsEditing(false)
  }

  return (
    <Draggable draggableId={columnId} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <AlertDialog
            open={open}
            handleClose={handleCancel}
            desciption="Уверены что хотите удалить?"
            customFooter={
              <>
                <Button onClick={handleClose}>Нет</Button>
                <Button onClick={handleDelete}>Да</Button>
              </>
            }
          />
          <Card
            sx={({ palette }) => ({
              width: 300,
              p: 2,
              paddingTop: '0',
              backgroundColor: palette.background.paper,
              overflow: 'auto'
            })}
          >
            <Box
              width="100%"
              {...provided.dragHandleProps}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pt: '10px',
                '&:hover #trash': {
                  display: 'block'
                },
                '&:hover #cardsCount': {
                  display: 'none'
                }
              }}
            >
              {isEditing ? (
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ flexGrow: 1, minWidth: 0 }}
                  />
                  <IconButton onClick={handleSave} color="success">
                    <CheckIcon />
                  </IconButton>
                  <IconButton onClick={handleCancel} color="error">
                    <CloseIcon />
                  </IconButton>
                </Box>
              ) : (
                <Typography variant="h6" onClick={() => setIsEditing(true)}>
                  {column.title}
                </Typography>
              )}

              <Typography id="cardsCount" variant="body2">
                {column.tasks.length}
              </Typography>
              <ListItemIcon
                id="trash"
                sx={{ display: 'none', cursor: 'pointer', width: '30px', minWidth: '30px' }}
                onClick={handleClickOpen}
              >
                <DeleteIcon />
              </ListItemIcon>
            </Box>
            <Droppable droppableId={columnId} type="TASK">
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 50 }}>
                  {column.tasks.length === 0 && (
                    <Typography color="textSecondary" align="center">
                      No tasks
                    </Typography>
                  )}
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={({ palette }) => ({
                            my: 1,
                            p: 1,
                            cursor: 'pointer',
                            backgroundColor: palette.background.default
                          })}
                        >
                          <CardContent>{task.content}</CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
            <Button onClick={() => addTask(index)} variant="contained" fullWidth sx={{ mt: 2 }}>
              + Add Task
            </Button>
          </Card>
        </Box>
      )}
    </Draggable>
  )
}

const Board = () => {
  const [columns, setColumns] = useState(initialColumns)

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result
    if (!destination) return
    const updatedColumns = [...columns]

    const isColumnOperation = type === 'COLUMN'
    const isSwapInColumn = source.droppableId === destination.droppableId

    if (isColumnOperation) {
      const shiftedColumns = getShiftedArray(columns, source.index, destination.index)

      setColumns(shiftedColumns)
    } else {
      const sourceColumnIndex = columns.findIndex(({ id }) => id === source.droppableId)
      const sourceColumn = columns[sourceColumnIndex]
      const sourceTasks = [...sourceColumn.tasks]

      const shiftedColumnsTaskList = getShiftedArray(sourceTasks, source.index, destination.index)

      if (isSwapInColumn) {
        updatedColumns[sourceColumnIndex] = { ...sourceColumn, tasks: shiftedColumnsTaskList }
        setColumns(updatedColumns)
      } else {
        const destinationColumnIndex = columns.findIndex(({ id }) => id === destination.droppableId)

        const deletedCard = updatedColumns[sourceColumnIndex].tasks.splice(source.index, 1)[0]
        updatedColumns[destinationColumnIndex].tasks.splice(destination.index, 0, deletedCard)

        setColumns(updatedColumns)
      }
    }
  }

  const addColumn = () => {
    const newColumnId = `column-${uuidv4()}`
    setColumns([...columns, { id: newColumnId, title: 'New Column', tasks: [] }])
  }

  const addTask = (columnIndex) => {
    const newTask = { id: `task-${uuidv4()}`, content: 'New Task' }
    const updatedColumns = [...columns]
    updatedColumns[columnIndex].tasks.push(newTask)

    setColumns(updatedColumns)
  }

  const updateColumnTitle = (columnIndex, newTitle) => {
    const updatedColumns = [...columns]
    updatedColumns[columnIndex].title = newTitle

    setColumns(updatedColumns)
  }

  const deleteColumn = (deleteColumnIndex) => {
    const updatedColumns = columns.filter((_, index) => index !== deleteColumnIndex)

    setColumns(updatedColumns)
  }

  return (
    <Box sx={{ width: '100%', height: '100%', pt: '50px', position: 'relative' }}>
      <Button
        onClick={addColumn}
        variant="contained"
        sx={{ mb: 2, position: 'absolute', left: '15px', top: '15px' }}
      >
        + Add Column
      </Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ display: 'flex', gap: 2, overflowX: 'auto', p: 2, height: '100%' }}
            >
              {columns.map((column, index) => (
                <Column
                  key={column.id}
                  columnId={column.id}
                  column={column}
                  index={index}
                  addTask={addTask}
                  updateColumnTitle={updateColumnTitle}
                  deleteColumn={deleteColumn}
                />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  )
}

export const KanbanBoard: FC<{ selectedFilePath: string; initData: object }> = ({
  selectedFilePath,
  initData
}) => {
  return <Board />
}
