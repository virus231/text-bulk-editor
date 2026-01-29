import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Editor from "./components/Editor";
import HistoryControls from "./components/HistoryControls";
import OperationsPanel, { OperationGroup } from "./components/OperationsPanel";
import { OPERATION_GROUPS } from "./data/operations";
import StatusBar from "./components/StatusBar";
import { useClipboard } from "./hooks/useClipboard";
import { useTextEditor } from "./hooks/useTextEditor";
import { useTextMetrics } from "./hooks/useTextMetrics";
import { replaceAllSimple } from "./utils/transformations";

const App = () => {
  const {
    text,
    setTextManual,
    applyOperation,
    undo,
    redo,
    clearAll,
    canUndo,
    canRedo,
    isWorking,
    lastOperation,
    lastDurationMs,
    lastChangeAt,
  } = useTextEditor();

  const metrics = useTextMetrics(text);
  const { status: clipboardStatus, copy } = useClipboard();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [isHighlighted, setIsHighlighted] = useState(false);

  const statusMessage =
    clipboardStatus === "copied"
      ? "Скопійовано в буфер обміну"
      : clipboardStatus === "error"
        ? "Не вдалося скопіювати"
        : null;

  useEffect(() => {
    if (!lastChangeAt) return;
    setIsHighlighted(true);
    const handle = window.setTimeout(() => setIsHighlighted(false), 600);
    return () => window.clearTimeout(handle);
  }, [lastChangeAt]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isEditable) return;

      const isMod = event.metaKey || event.ctrlKey;
      if (!isMod) return;

      const key = event.key.toLowerCase();

      if (key === "z" && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) undo();
      } else if (key === "y" || (key === "z" && event.shiftKey)) {
        event.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canRedo, canUndo, redo, undo]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    setTextManual(content);
    event.target.value = "";
  };

  const handleExport = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "text-transformer-export.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleFindReplace = () => {
    applyOperation("Знайти й замінити", (value) =>
      replaceAllSimple(value, findValue, replaceValue),
    );
  };

  const groups: OperationGroup[] = useMemo(
    () =>
      OPERATION_GROUPS.map((group) => ({
        title: group.title,
        description: group.description,
        actions: group.actions.map((action) => ({
          label: action.label,
          tone: action.tone,
          onClick: () =>
            applyOperation(action.operationLabel, action.transform),
        })),
      })),
    [applyOperation],
  );

  const hasText = text.length > 0;

  return (
    <div className="h-screen overflow-hidden bg--to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto flex h-full max-w-6xl flex-col gap-5 px-6 py-6">
        <header className="flex flex-shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Інструмент трансформації тексту
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Масове редагування для 10 000+ рядків
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Вставте список фраз, застосовуйте точні трансформації й працюйте
              швидко, чисто та з повною підтримкою Unicode.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <HistoryControls
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
            />
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Очистити все
            </button>
            <button
              type="button"
              onClick={() => copy(text)}
              disabled={!hasText}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Копіювати
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Імпорт .txt
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={!hasText}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Експорт .txt
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,text/plain"
              className="hidden"
              onChange={handleImportChange}
            />
          </div>
        </header>

        <main className="grid min-h-0 flex-1 gap-6 overflow-y-auto lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <section className="flex min-h-0 flex-col gap-4">
            <Editor
              value={text}
              onChange={setTextManual}
              disabled={isWorking}
              highlight={isHighlighted}
            />
            <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-xs text-slate-600 shadow-sm">
              Порада: для великих наборів застосовуйте операції по черзі та
              використовуйте Назад/Вперед для порівняння. Шорткати: Ctrl/⌘+Z,
              Ctrl/⌘+Y.
            </div>
          </section>

          <OperationsPanel groups={groups} isWorking={isWorking}>
            <section className="rounded-xl border border-slate-200 bg-white p-3">
              <h3 className="text-sm font-semibold text-slate-800">
                Знайти й замінити
              </h3>
              <div className="mt-3 flex flex-col gap-2">
                <label htmlFor="find-input" className="sr-only">
                  Знайти
                </label>
                <input
                  id="find-input"
                  type="text"
                  value={findValue}
                  onChange={(event) => setFindValue(event.target.value)}
                  placeholder="Знайти"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
                <label htmlFor="replace-input" className="sr-only">
                  Замінити
                </label>
                <input
                  id="replace-input"
                  type="text"
                  value={replaceValue}
                  onChange={(event) => setReplaceValue(event.target.value)}
                  placeholder="Замінити"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
                <button
                  type="button"
                  onClick={handleFindReplace}
                  disabled={!findValue}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Замінити все
                </button>
              </div>
            </section>
          </OperationsPanel>
        </main>

        <StatusBar
          metrics={metrics}
          lastOperation={lastOperation}
          lastDurationMs={lastDurationMs}
          statusMessage={statusMessage}
        />
      </div>
    </div>
  );
};

export default App;
