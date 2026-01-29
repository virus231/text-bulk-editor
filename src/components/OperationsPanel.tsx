import { ReactNode } from "react";

export type OperationAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "primary" | "neutral";
};

export type OperationGroup = {
  title: string;
  description?: string;
  actions: OperationAction[];
};

export type OperationsPanelProps = {
  groups: OperationGroup[];
  isWorking?: boolean;
  children?: ReactNode;
};

const buttonStyles: Record<NonNullable<OperationAction["tone"]>, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-400",
  neutral:
    "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:text-slate-900 focus:ring-slate-300",
};

const OperationsPanel = ({
  groups,
  isWorking,
  children,
}: OperationsPanelProps) => {
  return (
    <aside className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Операції
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            Трансформації
          </h2>
        </div>
        {isWorking ? (
          <span className="flex items-center gap-2 rounded-full bg-slate-900/10 px-3 py-1 text-xs font-semibold text-slate-700">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
            Виконується...
          </span>
        ) : null}
      </div>

      {children}

      <div className="flex flex-col gap-5">
        {groups.map((group) => (
          <section key={group.title} className="flex flex-col gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                {group.title}
              </h3>
              {group.description ? (
                <p className="text-xs text-slate-500">{group.description}</p>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {group.actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  disabled={action.disabled || isWorking}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                    buttonStyles[action.tone ?? "neutral"]
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
};

export default OperationsPanel;
