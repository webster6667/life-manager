import { useEffect, useRef, DependencyList } from 'react'

export const useEffectAfterMount = (effect: () => void, dependencies: DependencyList) => {
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) {
      ;(async () => {
        try {
          await effect()
        } catch (e) {
          throw new Error('useEffectAfterMount error')
        }
      })()
    } else {
      // Устанавливаем флаг с задержкой, чтобы учитывать StrictMode
      const timer = setTimeout(() => {
        isMounted.current = true
      }, 0)
      return () => clearTimeout(timer)
    }
  }, dependencies)
}
