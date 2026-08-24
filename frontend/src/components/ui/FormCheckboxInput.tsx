import React, { Children } from "react";

interface CheckboxInputProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}

function CheckboxInput({ checked, onChange, children }: CheckboxInputProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="terms"
        className="mr-2 bg-neutral-900 not-checked:appearance-none accent-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-sm h-4 w-4"
      />
      <label
        htmlFor="terms"
        className="text-gray-400 text-3sm font-normal font-['Inter'] leading-5"
      >
        {children}
      </label>
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
