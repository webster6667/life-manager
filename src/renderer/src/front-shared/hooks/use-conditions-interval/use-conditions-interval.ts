import { useEffect, useRef, DependencyList } from 'react'

export const useConditionsInterval = (
  conditions: DependencyList,
  intervalFn: () => void,
  intervalTime: number = 1000
) => {
  const intervalId = useRef(null)

  useEffect(() => {
    if (conditions) {
      intervalId.current = setInterval(() => {
        intervalFn && intervalFn()
      }, intervalTime)
    } else {
      clearInterval(intervalId.current)
      intervalId.current = null
    }
    return () => clearInterval(intervalId.current)
  }, conditions)
}
