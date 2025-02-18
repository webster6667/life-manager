import { Box, IconButton, MenuItem, Checkbox, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import DeleteIcon from '@mui/icons-material/Delete'
import PlusIcon from '@mui/icons-material/PlusOne'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const DroppableScrollContainer = ({ items, setItems }) => {
  return (
    <Droppable droppableId="droppable">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            overflowY: 'auto',
            height: '100%',
            padding: '10px'
          }}
        >
          {items.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided) => (
                <Box
                  width="100%"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
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
                  {item.content}
                </Box>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export const DynamicDropDown = () => {
  const optionsWrapper = useRef()
  const selectWrapper = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(null)
  const [options, setOptions] = useState([
    { value: 'option1', label: 'Option 1', checked: false },
    { value: 'option2', label: 'Option 2', checked: false },
    { value: 'option3', label: 'Option 3', checked: false },
    { value: 'option4', label: 'Option 4', checked: false },
    { value: 'option5', label: 'Option 5', checked: false },
    { value: 'option6', label: 'Option 6', checked: false }
  ])

  const handleDeleteOption = (e, value) => {
    e.stopPropagation()
    if (value === selectedValue) {
      setSelectedValue(null)
    }

    const updatedOptions = options.filter((option) => option.value !== value)

    setOptions(updatedOptions)
    selectWrapper.current.focus()
  }

  const handleDragEnd = (result) => {
    const { destination, source } = result
    if (!destination) return // Если перетаскивание не завершилось в допустимую зону, ничего не делать

    const reorderedOptions = Array.from(options)
    const [movedItem] = reorderedOptions.splice(source.index, 1)
    reorderedOptions.splice(destination.index, 0, movedItem)

    setOptions(reorderedOptions)
  }

  return (
    <Box
      sx={{ width: '100%', position: 'relative' }}
      tabIndex={-1}
      onFocus={() => {
        setIsOpen(true)
      }}
      ref={selectWrapper}
      onBlur={(e) => {
        const currentElement = e.currentTarget // Текущий элемент, потерявший фокус
        const relatedElement = e.relatedTarget // Элемент, получивший фокус

        if (!currentElement.contains(relatedElement)) {
          setIsOpen(false)
        }
      }}
    >
      <TextField
        sx={{ width: '100%' }}
        value={
          selectedValue
            ? options.find(({ value }) => selectedValue === value).label
            : 'Выберите значение'
        }
        disabled
      />

      <IconButton
        edge="end"
        aria-label="delete"
        onClick={(e) => {
          setOptions((options) => [...options, { value: Date.now(), label: 'Новенький' }])

          if (!isOpen) {
            setIsOpen(true)
          }

          setTimeout(() => {
            const container = optionsWrapper.current
            container.scrollTop = container.scrollHeight
          }, 10)
        }}
        size="small"
        sx={{ position: 'absolute', right: '5px', top: '13px' }}
      >
        <PlusIcon fontSize="small" />
      </IconButton>

      <Box
        sx={{
          left: '0',
          maxHeight: '200px',
          top: '100%',
          width: '100%',
          position: 'absolute',
          background: 'black',
          overflow: 'auto',
          display: isOpen ? 'block' : 'none'
        }}
        ref={optionsWrapper}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable-list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {options.map((option, index) => (
                  <Draggable key={option.value} draggableId={option.value} index={index}>
                    {(provided) => (
                      <MenuItem
                        ref={provided.innerRef}
                        key={option.value}
                        value={option.value}
                        onClick={() => {
                          setSelectedValue(option.value)
                        }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TextField
                          value={option.label}
                          onChange={({ target }) => {
                            setOptions((options) => {
                              const newOpt = [...options]

                              newOpt[index].label = target.value

                              return newOpt
                            })
                            target.value
                          }}
                        />
                        <Checkbox
                          checked={option.checked}
                          onClick={(e) => e.stopPropagation()}
                          onChange={({ target }) => {
                            setOptions((options) => {
                              const newOpt = [...options]

                              newOpt[index].checked = target.checked

                              return newOpt
                            })
                          }}
                        />
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => handleDeleteOption(e, option.value)}
                          size="small"
                          style={{ marginLeft: '10px' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </MenuItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Box>
  )
}

export const CanvasNav = () => {
  const [items, setItems] = useState([
    { id: 'item-1', content: 'Элемент 1' },
    { id: 'item-2', content: 'Элемент 2' },
    { id: 'item-3', content: 'Элемент 3' }
  ])

  const onDragEnd = (result) => {
    if (!result.destination) return
    const reorderedItems = reorder(items, result.source.index, result.destination.index)
    setItems(reorderedItems)
  }

  return (
    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', height: '100%' }}>
      <DynamicDropDown />

      <br />

      <DragDropContext onDragEnd={onDragEnd}>
        <DroppableScrollContainer items={items} setItems={setItems} />
      </DragDropContext>
    </Box>
  )
}
