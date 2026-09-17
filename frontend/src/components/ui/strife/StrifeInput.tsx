import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface StrifeInputProps extends DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> {
  name?: string;
  type?: string;
  placeholder?: string;
}

export default function StrifeInput({
  name,
  type,
  placeholder,
  ...props
}: StrifeInputProps) {
  return (
    <Field>
      <Input
        placeholder={placeholder}
        name={name}
        type={type}
        {...props}
        className="mb-3 w-full rounded-sm border border-surface-container-lowest bg-surface-container-lowest px-3 py-2 text-[14px] text-on-surface placeholder:text-outline focus:ring-0  focus:border-0 focus:outline-none"
      />
    </Field>
  );
}
