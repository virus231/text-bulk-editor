export type HistoryControlsProps = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
};

const HistoryControls = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: HistoryControlsProps) => (
  <div className="flex gap-2">
    <button
      type="button"
      onClick={onUndo}
      disabled={!canUndo}
      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Назад
    </button>
    <button
      type="button"
      onClick={onRedo}
      disabled={!canRedo}
      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Вперед
    </button>
  </div>
);

export default HistoryControls;
