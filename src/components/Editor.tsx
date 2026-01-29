import { ChangeEvent } from "react";

export type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  highlight?: boolean;
};

const Editor = ({ value, onChange, disabled, highlight }: EditorProps) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700" htmlFor="editor">
        Ввід / Результат
      </label>
      <textarea
        id="editor"
        className={`h-full min-h-0 w-full flex-1 resize-none rounded-xl border border-slate-200 bg-white/90 p-4 text-sm leading-relaxed text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100 ${
          highlight ? "ring-2 ring-emerald-200" : ""
        }`}
        placeholder="Вставте або введіть до 10 000 рядків тут..."
        value={value}
        onChange={handleChange}
        disabled={disabled}
        spellCheck={false}
      />
    </div>
  );
};

export default Editor;
