import { useEffect, useRef, DependencyList } from 'react'

export const useConditionsInterval = (
  conditions: DependencyList,
  intervalFn: () => void,
  options: { intervalTime?: number; shouldClearAfterOnmount?: boolean } | undefined = {}
) => {
  const intervalId = useRef(null)
  const { intervalTime = 1000 } = options

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
