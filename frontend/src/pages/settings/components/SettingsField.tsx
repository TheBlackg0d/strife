import { useId } from "react";

interface SettingsFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}

/** Labelled input used across every settings section. */
function SettingsField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  error,
}: SettingsFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-label text-[12px] font-bold uppercase tracking-wide text-on-surface-variant"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-sm border bg-surface-container p-3 text-[15px] text-on-surface transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary ${
          error ? "border-error" : "border-outline-variant"
        }`}
      />
      {error && (
        <p id={errorId} role="alert" className="text-[13px] text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default SettingsField;
