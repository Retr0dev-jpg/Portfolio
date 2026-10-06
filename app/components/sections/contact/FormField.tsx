import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

const CONTROL_CLASS =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white transition-all';

type FieldProps = { id: string; label: string } & (
  | ({ multiline?: false } & InputHTMLAttributes<HTMLInputElement>)
  | ({ multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>)
);

export default function FormField({ id, label, ...props }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      {props.multiline ? (
        <textarea id={id} className={`${CONTROL_CLASS} resize-none`} {...withoutMultiline(props)} />
      ) : (
        <input id={id} className={CONTROL_CLASS} {...withoutMultiline(props)} />
      )}
    </div>
  );
}

function withoutMultiline<T extends { multiline?: boolean }>({ multiline: _multiline, ...rest }: T) {
  return rest;
}
