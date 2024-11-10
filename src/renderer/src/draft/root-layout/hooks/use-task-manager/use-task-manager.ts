import { DateContent, StepperData, Task } from '@renderer/draft/root-layout/types'
import { useImmer } from 'use-immer'
import { isEmpty } from 'lodash'
import { getDefaultStepperLayout } from '@renderer/draft/root-layout/helpers/get-default-stepper-layout'
import { useEffectAfterMount } from '@front-shared/hooks/use-effect-after-mount'
import { fileSystemAdapter } from '@renderer/api/fileSystemAdapter'
import finish from '@assets/sounds/finish.mp3'

export const useTaskManager = (contentData: DateContent, selectedFilePath: string) => {
  const [dayData, setDayData] = useImmer<StepperData>(
    isEmpty(contentData) ? getDefaultStepperLayout() : (contentData as StepperData)
  )

  // Хендлер для добавления новой задачи в backlog или taskList в timeSegment
  const createNewTask = ({
    value,
    segmentIndex
  }: {
    value: string
    parentId?: number
    segmentIndex?: number
  }): Task => {
    const newTask: Task = {
      id: Date.now(),
      isFinished: false,
      value, // Заменили 'description' на 'value'
      description: '', // Добавляем поле description
      parentId: 0,
      commentsList: []
    }

    setDayData((draft) => {
      if (segmentIndex !== undefined) {
        // Добавляем задачу в taskList конкретного сегмента времени
        const segment = draft.timeSegmentList[segmentIndex]
        if (segment) {
          segment.taskList.push(newTask)
        }
      } else {
        // Добавляем задачу в backlog
        draft.backLog.push(newTask)
      }
    })

    return newTask
  }

  // Хендлер для изменения value задачи в backlog или taskList
  const updateTaskValue = (taskId: number, newValue: string, segmentIndex?: number) => {
    setDayData((draft) => {
      if (segmentIndex !== undefined) {
        // Обновляем value в taskList конкретного timeSegment
        const segment = draft.timeSegmentList[segmentIndex]
        if (segment) {
          const task = segment.taskList.find((t) => t.id === taskId)
          if (task) {
            task.value = newValue // Заменили 'description' на 'value'
          }
        }
      } else {
        // Обновляем в backlog
        const task = draft.backLog.find((t) => t.id === taskId)
        if (task) {
          task.value = newValue // Заменили 'description' на 'value'
        }
      }
    })
  }

  // Хендлер для изменения description задачи в backlog или taskList
  const updateTaskDescription = (taskId: number, newDescription: string, segmentIndex?: number) => {
    setDayData((draft) => {
      if (segmentIndex !== undefined) {
        // Обновляем description в taskList конкретного timeSegment
        const segment = draft.timeSegmentList[segmentIndex]
        if (segment) {
          const task = segment.taskList.find((t) => t.id === taskId)
          if (task) {
            task.description = newDescription // Обновляем описание
          }
        }
      } else {
        // Обновляем в backlog
        const task = draft.backLog.find((t) => t.id === taskId)
        if (task) {
          task.description = newDescription // Обновляем описание
        }
      }
    })
  }

  // Хендлер для переключения значения isFinished задачи в backlog или taskList
  const toggleTaskFinished = (taskId: number, segmentIndex?: number) => {
    setDayData((draft) => {
      if (segmentIndex !== undefined) {
        // Переключаем в taskList конкретного timeSegment
        const segment = draft.timeSegmentList[segmentIndex]
        if (segment) {
          const task = segment.taskList.find((t) => t.id === taskId)
          if (task) {
            task.isFinished = !task.isFinished
          }
        }
      } else {
        // Переключаем в backlog
        const task = draft.backLog.find((t) => t.id === taskId)
        if (task) {
          task.isFinished = !task.isFinished
        }
      }
    })
  }

  // Хендлер для переноса задачи из backlog в timeSegmentList
  const moveTaskToTimeSegment = (taskId: number, timeSegmentIndex: number) => {
    setDayData((draft) => {
      // Ищем задачу в backlog
      const taskIndexInBacklog = draft.backLog.findIndex((t) => t.id === taskId)
      if (taskIndexInBacklog !== -1) {
        const task = draft.backLog.splice(taskIndexInBacklog, 1)[0] // Удаляем из backlog
        const segment = draft.timeSegmentList[timeSegmentIndex]
        if (segment) {
          // Добавляем задачу в taskList указанного сегмента времени
          segment.taskList.push(task)
        }
      }
    })
  }

  // Хендлер для переноса задачи из timeSegmentList в backlog
  const moveTaskToBackLog = (taskId: number, timeSegmentIndex: number) => {
    setDayData((draft) => {
      // Ищем задачу в taskList конкретного timeSegment
      const segment = draft.timeSegmentList[timeSegmentIndex]
      if (segment) {
        const taskIndexInSegment = segment.taskList.findIndex((t) => t.id === taskId)
        if (taskIndexInSegment !== -1) {
          const task = segment.taskList.splice(taskIndexInSegment, 1)[0] // Удаляем из taskList
          draft.backLog.push(task) // Добавляем в backlog
        }
      }
    })
  }

  // Общая функция для удаления задачи из backlog или из timeSegmentList
  const deleteTask = (taskId: number, segmentIndex?: number) => {
    setDayData((draft) => {
      if (segmentIndex !== undefined) {
        // Удаляем задачу из taskList конкретного timeSegment
        const segment = draft.timeSegmentList[segmentIndex]
        if (segment) {
          const taskIndexInSegment = segment.taskList.findIndex((t) => t.id === taskId)
          if (taskIndexInSegment !== -1) {
            segment.taskList.splice(taskIndexInSegment, 1) // Удаляем из taskList
          }
        }
      } else {
        // Удаляем задачу из backlog
        const taskIndexInBacklog = draft.backLog.findIndex((t) => t.id === taskId)
        if (taskIndexInBacklog !== -1) {
          draft.backLog.splice(taskIndexInBacklog, 1) // Удаляем из backlog
        }
      }
    })
  }

  const finishTimeSegment = () => {
    setDayData(({ timeSegmentList }) => {
      const finishedStepIndex = timeSegmentList.findIndex(({ status }) => status === 'process')

      if (finishedStepIndex >= 0) {
        timeSegmentList[finishedStepIndex].status = 'finished'
        const nextStep = finishedStepIndex + 1
        const finishSound = new Audio(finish)
        finishSound.play()

        if (nextStep < timeSegmentList.length) {
          timeSegmentList[nextStep].status = 'waiting-start'
        }
      }
    })
  }

  const togglePlaning = () => {
    setDayData((draft) => {
      draft.isPlanning = !draft.isPlanning
    })
  }

  const incrementPlanningSecond = () => {
    setDayData((draft) => {
      draft.planningSeconds = draft.planningSeconds + 1
    })
  }

  const incrementSkippedSecond = () => {
    setDayData((draft) => {
      draft.skippedSeconds = draft.skippedSeconds + 1
    })
  }

  useEffectAfterMount(async () => {
    await fileSystemAdapter.updateFile(selectedFilePath, JSON.stringify(dayData))
  }, [JSON.stringify(dayData)])

  return {
    dayData,
    finishTimeSegment,
    createNewTask,
    updateTaskValue,
    updateTaskDescription,
    toggleTaskFinished,
    moveTaskToTimeSegment,
    moveTaskToBackLog,
    deleteTask,
    togglePlaning,
    incrementPlanningSecond,
    incrementSkippedSecond,
    setDayData
  }
}
