interface FormInputProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  error?: string;
}

function FormInput({ label, name, type, placeholder, error }: FormInputProps) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2 mb-4">
      <label
        htmlFor={id}
        className="text-gray-400 text-3sm font-bold font-['Inter'] leading-5"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`text-gray-500 bg-neutral-900 placeholder:text-gray-500 focus:ring-2 focus:outline-none rounded-sm h-9 p-2 ${
          error
            ? "ring-2 ring-red-500 focus:ring-red-500"
            : "focus:ring-blue-500"
        }`}
        placeholder={placeholder}
      />
      {error && (
        <p id={errorId} role="alert" className="text-red-400 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormInput;
