import { useCallback, useEffect, useRef, useState } from 'react'
import { normalizeLineEndings } from '../utils/parsing'

export type Operation = (text: string) => string

export type TextEditorState = {
  text: string
  isWorking: boolean
  lastOperation: string | null
  lastDurationMs: number | null
  canUndo: boolean
  canRedo: boolean
  setTextManual: (value: string) => void
  applyOperation: (label: string, operation: Operation) => void
  undo: () => void
  redo: () => void
  clearAll: () => void
}

const MAX_HISTORY = 20

export const useTextEditor = (initialText = ''): TextEditorState => {
  const [text, setText] = useState(() => normalizeLineEndings(initialText))
  const [past, setPast] = useState<string[]>([])
  const [future, setFuture] = useState<string[]>([])
  const [isWorking, setIsWorking] = useState(false)
  const [lastOperation, setLastOperation] = useState<string | null>(null)
  const [lastDurationMs, setLastDurationMs] = useState<number | null>(null)
  const textRef = useRef(text)

  useEffect(() => {
    textRef.current = text
  }, [text])

  const pushHistory = useCallback((snapshot: string) => {
    setPast((prev) => {
      const updated = [...prev, snapshot]
      if (updated.length > MAX_HISTORY) updated.shift()
      return updated
    })
    setFuture([])
  }, [])

  const setTextManual = useCallback((value: string) => {
    const normalized = normalizeLineEndings(value)
    setText(normalized)
    setPast([])
    setFuture([])
    setLastOperation(null)
    setLastDurationMs(null)
  }, [])

  const applyOperation = useCallback(
    (label: string, operation: Operation) => {
      if (isWorking) return

      setIsWorking(true)

      window.setTimeout(() => {
        const start = performance.now()
        const current = textRef.current
        const next = operation(current)
        const duration = performance.now() - start

        if (next !== current) {
          pushHistory(current)
          setText(next)
        }

        setLastOperation(label)
        setLastDurationMs(duration)
        setIsWorking(false)
      }, 0)
    },
    [isWorking, pushHistory]
  )

  const undo = useCallback(() => {
    setPast((prev) => {
      if (prev.length === 0) return prev
      const previous = prev[prev.length - 1]

      setFuture((futurePrev) => [...futurePrev, textRef.current])
      setText(previous)
      setLastOperation('Undo')

      return prev.slice(0, -1)
    })
  }, [])

  const redo = useCallback(() => {
    setFuture((prev) => {
      if (prev.length === 0) return prev
      const next = prev[prev.length - 1]

      setPast((pastPrev) => {
        const updated = [...pastPrev, textRef.current]
        if (updated.length > MAX_HISTORY) updated.shift()
        return updated
      })
      setText(next)
      setLastOperation('Redo')

      return prev.slice(0, -1)
    })
  }, [])

  const clearAll = useCallback(() => {
    if (textRef.current.length === 0) return
    pushHistory(textRef.current)
    setText('')
    setLastOperation('Clear all')
  }, [pushHistory])

  return {
    text,
    isWorking,
    lastOperation,
    lastDurationMs,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    setTextManual,
    applyOperation,
    undo,
    redo,
    clearAll
  }
}
