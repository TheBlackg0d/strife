import React from "react";

interface CheckboxInputProps {
  name: string;
  children: React.ReactNode;
  error?: string;
}

function CheckboxInput({ children, name, error }: CheckboxInputProps) {
  const errorId = `${name}-error`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mr-2 bg-neutral-900 not-checked:appearance-none accent-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-sm h-4 w-4"
        />
        <label
          htmlFor={name}
          className="text-gray-400 text-3sm font-normal font-['Inter'] leading-5"
        >
          {children}
        </label>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-red-400 text-xs">
          {error}
        </p>
      )}
    </div>
  );
}

CheckboxInput.Terms = function Terms() {
  return (
    <div>
      I agree to Strife's the{" "}
      <span className="text-sky-500 font-normal font-['Inter'] leading-5">
        Terms of service{" "}
      </span>
      and{" "}
      <span className="text-sky-500 font-normal font-['Inter'] leading-5">
        Privacy Policy
      </span>
    </div>
  );
};

export default CheckboxInput;
