import { useId } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import SettingsSection from "./SettingsSection";

interface AboutMeSectionProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  maxLength?: number;
}

function AboutMeSection<T extends FieldValues>({
  control,
  name,
  maxLength = 190,
}: AboutMeSectionProps<T>) {
  const id = useId();

  return (
    <SettingsSection title="À propos de moi">
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <textarea
              {...field}
              id={id}
              value={field.value ?? ""}
              maxLength={maxLength}
              aria-invalid={fieldState.invalid || undefined}
              placeholder="Parlez un peu de vous..."
              className="min-h-[120px] w-full resize-y rounded-sm border border-outline-variant bg-surface-container-lowest p-3 text-[15px] text-on-surface transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <div className="mt-1 flex justify-between text-[12px]">
              <p role="alert" className="text-error">
                {fieldState.error?.message}
              </p>
              <p className="text-on-surface-variant">
                {(field.value ?? "").length}/{maxLength}
              </p>
            </div>
          </>
        )}
      />
    </SettingsSection>
  );
}

export default AboutMeSection;
