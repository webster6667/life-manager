import { useEffect } from 'react'

export const useDidMount = (callback: () => void, onError?: (e: any) => void) => {
  useEffect(() => {
    ;(async () => {
      if (callback) {
        try {
          await callback()
        } catch (e) {
          onError && onError(e)
        }
      }
    })()
  }, [])
}
