import { useEffect, useState } from 'react'

export const useDidMount = (callback?: () => void, onError?: (e: any) => void) => {
  const [wasMountedCallbackFinished, setWasMountedCallbackFinished] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (callback) {
        try {
          await callback()
          setWasMountedCallbackFinished(true)
        } catch (e) {
          onError && onError(e)
        }
      } else {
        setWasMountedCallbackFinished(true)
      }
    })()
  }, [])

  return wasMountedCallbackFinished
}
