import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useLoginMutation } from "~/api/auth/auth.hooks";
import { FieldGroup } from "~/components/ui/field";
import { Separator } from "~/components/ui/separator";
import AuthLink from "~/components/strife/AuthLink";
import ControlledFormInput from "~/components/strife/ControlledFormInput";
import Header from "~/components/strife/Header";
import SecondaryButton from "~/components/strife/SecondaryButton";
import StrifeLogo from "~/components/strife/StrifeLogo";
import SubmitButton from "~/components/strife/SubmitButton";
import { loginValidationSchema } from "./login.schema";

export default function LoginForm() {
  const loginMutation = useLoginMutation();
  const form = useForm<z.infer<typeof loginValidationSchema>>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return (
    <>
      <StrifeLogo size={36} className="mx-auto mb-4" />
      <Header
        title="Welcome back"
        subtitle="We're so excited to have you back!"
      />
      <form onSubmit={handleSubmit} noValidate>
        <FieldGroup className="gap-4">
          <ControlledFormInput
            name="email"
            control={form.control}
            label="Email"
            placeholder="Enter your email"
          />
          <ControlledFormInput
            name="password"
            control={form.control}
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          <AuthLink
            linkText="Forgot your password?"
            linkUrl="/forgot-password"
          />
          <SubmitButton
            text="Log in"
            isPending={loginMutation.isPending}
            pendingText="Signing in..."
          />
          <div className="flex flex-row justify-center items-center gap-4 my-5">
            <Separator className="flex-1 bg-gray-700" />
            <span className="px-4 text-slate-300 text-sm font-normal font-['Inter'] leading-4">
              or
            </span>
            <Separator className="flex-1 bg-gray-700" />
          </div>
        </FieldGroup>
      </form>
      <div className="flex flex-col gap-4 mt-4">
        <SecondaryButton text="Sign in with Google" />
        <span className="text-sm text-gray-500">
          Need an account? <AuthLink linkText="Sign up" linkUrl="/register" />
        </span>
      </div>
    </>
  );
}
