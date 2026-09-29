import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useRegisterMutation } from "~/api/auth/auth.hooks";
import { Field, FieldError, FieldGroup } from "~/components/ui/field";
import AuthLink from "~/components/strife/AuthLink";
import ControlledFormInput from "~/components/strife/ControlledFormInput";
import Header from "~/components/strife/Header";
import SubmitButton from "~/components/strife/SubmitButton";
import { registerValidationSchema } from "./register.schema";

export default function RegisterForm() {
  const registerMutation = useRegisterMutation();
  const form = useForm<z.infer<typeof registerValidationSchema>>({
    resolver: zodResolver(registerValidationSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      passwordConfirmation: "",
      terms: false,
    },
  });

  const handleSubmit = form.handleSubmit(({ terms, ...data }) => {
    registerMutation.mutate(data);
  });

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit} noValidate>
        <FieldGroup className="gap-4">
          <ControlledFormInput
            name="email"
            control={form.control}
            label="Email"
            type="email"
            placeholder="Enter your email"
          />
          <ControlledFormInput
            name="username"
            control={form.control}
            label="Username"
            placeholder="Enter your username"
          />
          <ControlledFormInput
            name="password"
            control={form.control}
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          <ControlledFormInput
            name="passwordConfirmation"
            control={form.control}
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
          />
          <Controller
            name="terms"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms-input"
                    name={field.name}
                    ref={field.ref}
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                    className="mr-2 bg-neutral-900 not-checked:appearance-none accent-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-sm h-4 w-4"
                  />
                  <label
                    htmlFor="terms-input"
                    className="text-gray-400 text-3sm font-normal font-['Inter'] leading-5"
                  >
                    I agree to Strife's the{" "}
                    <span className="text-sky-500 font-normal font-['Inter'] leading-5">
                      Terms of service{" "}
                    </span>
                    and{" "}
                    <span className="text-sky-500 font-normal font-['Inter'] leading-5">
                      Privacy Policy
                    </span>
                  </label>
                </div>
                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="text-red-400 text-xs"
                  />
                )}
              </Field>
            )}
          />
          <div className="flex flex-col gap-2">
            <SubmitButton
              text="Register"
              pendingText="Creating account..."
              isPending={registerMutation.isPending}
            />
            <AuthLink linkText="Already have an account?" linkUrl="/login" />
          </div>
        </FieldGroup>
      </form>
    </>
  );
}
