import React from "react";

interface RegisterInputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function RegisterInput({
  label,
  type,
  placeholder,
  value,
  onChange,
}: RegisterInputProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label
        htmlFor={label.toLowerCase().replace(" ", "-")}
        className="text-gray-400 text-3sm font-bold font-['Inter'] leading-5"
      >
        {label}
      </label>
      <input
        type={type}
        id={label.toLowerCase().replace(" ", "-")}
        className="text-gray-500 bg-neutral-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-sm h-9 p-2"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default RegisterInput;
