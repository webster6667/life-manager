import { useEffect, useState } from 'react'

export const useDidMount = <T>(
  callback?: () => Promise<T> | T,
  deps?: any[],
  onError?: (e: any) => void
) => {
  const [wasMountedCallbackFinished, setWasMountedCallbackFinished] = useState(false)
  const [dataReturnAfterMount, setDataReturnAfterMount] = useState<T | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      if (callback) {
        try {
          const data = await callback()
          setDataReturnAfterMount(data)
          setWasMountedCallbackFinished(true)
        } catch (e) {
          onError && onError(e)
        }
      } else {
        setWasMountedCallbackFinished(true)
      }
    })()
  }, deps || [])

  return [wasMountedCallbackFinished, dataReturnAfterMount]
}
