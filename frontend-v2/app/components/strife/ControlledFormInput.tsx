import { Input } from "@base-ui/react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";

interface ControlledFormInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  labelClassName?: string;
  inputClassName?: string;
}

function ControlledFormInput<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  autoComplete,
  labelClassName = "text-gray-400 text-3sm font-bold font-['Inter'] leading-5",
  inputClassName = "text-gray-500 bg-neutral-900 placeholder:text-gray-500 focus:ring-2 focus:outline-none rounded-sm h-9 p-2",
}: ControlledFormInputProps<T>) {
  const id = `${name}-input`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="mb-4">
          <FieldLabel htmlFor={id} className={labelClassName}>
            {label}
          </FieldLabel>
          <Input
            {...field}
            id={id}
            type={type}
            autoComplete={autoComplete}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            className={`${inputClassName} ${
              fieldState.invalid
                ? "ring-2 ring-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {fieldState.invalid && (
            <FieldError
              errors={[fieldState.error]}
              className="text-red-400 text-xs"
            />
          )}
        </Field>
      )}
    />
  );
}

export default ControlledFormInput;
