import { useEffect, useState } from 'react'
import { splitLines } from '../utils/parsing'

export type TextMetrics = {
  lineCount: number
  emptyLineCount: number
  charCount: number
}

const computeMetrics = (text: string): TextMetrics => {
  const lines = splitLines(text)
  const emptyLineCount = lines.filter((line) => line.trim().length === 0).length

  return {
    lineCount: lines.length,
    emptyLineCount,
    charCount: text.length
  }
}

export const useTextMetrics = (text: string, delay = 150): TextMetrics => {
  const [metrics, setMetrics] = useState<TextMetrics>(() =>
    computeMetrics(text)
  )

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setMetrics(computeMetrics(text))
    }, delay)

    return () => window.clearTimeout(handle)
  }, [text, delay])

  return metrics
}
