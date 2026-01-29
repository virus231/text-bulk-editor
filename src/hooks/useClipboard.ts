import { useCallback, useState } from 'react'

export type ClipboardStatus = 'idle' | 'copied' | 'error'

export const useClipboard = () => {
  const [status, setStatus] = useState<ClipboardStatus>('idle')

  const copy = useCallback(async (text: string) => {
    if (text.length === 0) return

    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch (error) {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', 'true')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setStatus('copied')
      } catch (fallbackError) {
        console.error(fallbackError)
        setStatus('error')
      }
    }

    window.setTimeout(() => setStatus('idle'), 1500)
  }, [])

  return { status, copy }
}
