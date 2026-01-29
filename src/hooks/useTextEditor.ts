import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeLineEndings } from "../utils/parsing";

export type Operation = (text: string) => string | Promise<string>;

export type TextEditorState = {
  text: string;
  isWorking: boolean;
  lastOperation: string | null;
  lastDurationMs: number | null;
  lastChangeAt: number | null;
  canUndo: boolean;
  canRedo: boolean;
  setTextManual: (value: string) => void;
  applyOperation: (label: string, operation: Operation) => void;
  undo: () => void;
  redo: () => void;
  clearAll: () => void;
};

const MAX_HISTORY = 20;
const STORAGE_KEY = "text-transformer-content";
const SAVE_DELAY = 400;

export const useTextEditor = (initialText = ""): TextEditorState => {
  const [text, setText] = useState(() => {
    if (typeof window === "undefined") {
      return normalizeLineEndings(initialText);
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return normalizeLineEndings(stored ?? initialText);
    } catch {
      return normalizeLineEndings(initialText);
    }
  });
  const [past, setPast] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  const [isWorking, setIsWorking] = useState(false);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [lastDurationMs, setLastDurationMs] = useState<number | null>(null);
  const [lastChangeAt, setLastChangeAt] = useState<number | null>(null);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handle = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, text);
      } catch {
        // Ignore storage write errors (private mode, quota, etc.).
      }
    }, SAVE_DELAY);

    return () => window.clearTimeout(handle);
  }, [text]);

  const pushHistory = useCallback((snapshot: string) => {
    setPast((prev) => {
      const updated = [...prev, snapshot];
      if (updated.length > MAX_HISTORY) updated.shift();
      return updated;
    });
    setFuture([]);
  }, []);

  const setTextManual = useCallback((value: string) => {
    const normalized = normalizeLineEndings(value);
    setText(normalized);
    setPast([]);
    setFuture([]);
    setLastOperation(null);
    setLastDurationMs(null);
    setLastChangeAt(Date.now());
  }, []);

  const applyOperation = useCallback(
    (label: string, operation: Operation) => {
      if (isWorking) return;

      setIsWorking(true);

      window.setTimeout(async () => {
        const start = performance.now();
        const current = textRef.current;
        let next = operation(current);
        if (next instanceof Promise) {
          next = await next;
        }
        const duration = performance.now() - start;

        if (next !== current) {
          pushHistory(current);
          setText(next);
          setLastChangeAt(Date.now());
        }

        setLastOperation(label);
        setLastDurationMs(duration);
        setIsWorking(false);
      }, 0);
    },
    [isWorking, pushHistory],
  );

  const undo = useCallback(() => {
    if (isWorking) return;
    setPast((prev) => {
      if (prev.length === 0) return prev;
      const previous = prev[prev.length - 1];

      setFuture((futurePrev) => [...futurePrev, textRef.current]);
      setText(previous);
      setLastOperation("Назад");
      setLastChangeAt(Date.now());

      return prev.slice(0, -1);
    });
  }, [isWorking]);

  const redo = useCallback(() => {
    if (isWorking) return;
    setFuture((prev) => {
      if (prev.length === 0) return prev;
      const next = prev[prev.length - 1];

      setPast((pastPrev) => {
        const updated = [...pastPrev, textRef.current];
        if (updated.length > MAX_HISTORY) updated.shift();
        return updated;
      });
      setText(next);
      setLastOperation("Вперед");
      setLastChangeAt(Date.now());

      return prev.slice(0, -1);
    });
  }, [isWorking]);

  const clearAll = useCallback(() => {
    if (textRef.current.length === 0) return;
    pushHistory(textRef.current);
    setText("");
    setLastOperation("Очистити все");
    setLastChangeAt(Date.now());
  }, [pushHistory]);

  return {
    text,
    isWorking,
    lastOperation,
    lastDurationMs,
    lastChangeAt,
    canUndo: past.length > 0 && !isWorking,
    canRedo: future.length > 0 && !isWorking,
    setTextManual,
    applyOperation,
    undo,
    redo,
    clearAll,
  };
};
