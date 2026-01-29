import { TextMetrics } from "../hooks/useTextMetrics";

export type StatusBarProps = {
  metrics: TextMetrics;
  lastOperation: string | null;
  lastDurationMs: number | null;
  statusMessage?: string | null;
};

const formatDuration = (duration: number | null): string => {
  if (duration === null) return "—";
  if (duration < 1000) return `${duration.toFixed(0)} мс`;
  return `${(duration / 1000).toFixed(2)} с`;
};

const StatusBar = ({
  metrics,
  lastOperation,
  lastDurationMs,
  statusMessage,
}: StatusBarProps) => (
  <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-xs text-slate-600 shadow-sm">
    <div className="flex flex-wrap gap-4">
      <span>
        Рядків: <strong className="text-slate-900">{metrics.lineCount}</strong>
      </span>
      <span>
        Порожніх:{" "}
        <strong className="text-slate-900">{metrics.emptyLineCount}</strong>
      </span>
      <span>
        Символів:{" "}
        <strong className="text-slate-900">{metrics.charCount}</strong>
      </span>
    </div>
    <div className="flex flex-wrap items-center gap-4">
      <span>
        Остання дія:{" "}
        <strong className="text-slate-900">{lastOperation ?? "—"}</strong>
      </span>
      <span>
        Час:{" "}
        <strong className="text-slate-900">
          {formatDuration(lastDurationMs)}
        </strong>
      </span>
      {statusMessage ? (
        <span
          className="rounded-full bg-slate-900/10 px-2 py-1 text-[11px] font-semibold text-slate-700"
          aria-live="polite"
        >
          {statusMessage}
        </span>
      ) : null}
    </div>
  </div>
);

export default StatusBar;
