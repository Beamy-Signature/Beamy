"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const inputClass =
  "w-full border border-line bg-white px-3 py-2.5 pr-12 outline-none focus:border-gold";

export function PasswordField({
  name,
  label,
  description,
  required,
  minLength,
  autoComplete,
}: {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block text-sm">
      {label}
      {description ? <span className="mt-1 block text-xs leading-5 text-muted">{description}</span> : null}
      <span className="relative mt-2 block">
        <input
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className={inputClass}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted hover:text-ink"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
    </label>
  );
}
