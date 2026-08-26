import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { PiSignIn } from "react-icons/pi";
import AuthSection from "../../components/AuthSection";
import AuthLink from "../../components/ui/AuthLink";
import FormInput from "../../components/ui/FormInput";
import Header from "../../components/ui/Header";
import SubmitButton from "../../components/ui/SubmitButton";
import Separator from "./components/Separator";
import StrifeLogo from "../../components/ui/StrifeLogo";
import SecondaryButton from "../../components/ui/SecondaryButton";
import type { LoginCredential } from "../../auth/types/auth";
import { login } from "../../auth/session";
import { hasFieldErrors, toApiError } from "../../api/errors";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      void navigate(searchParams.get("wanted") ?? "/", { replace: true });
    },
  });

  const apiError = loginMutation.error ? toApiError(loginMutation.error) : null;
  const fieldErrors = apiError?.fieldErrors ?? {};

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const credential: LoginCredential = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    loginMutation.mutate(credential);
  };

  return (
    <AuthSection>
      <StrifeLogo size={36} className="mx-auto mb-4" />
      <Header
        title="Welcome back"
        subtitle="We're so excited to have you back!"
      />
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {apiError && !hasFieldErrors(apiError) && (
          <p role="alert" className="text-red-400 text-sm">
            {apiError.message}
          </p>
        )}

        <FormInput
          label="Email"
          name="email"
          placeholder="Enter your email"
          type="text"
          error={fieldErrors.email}
        />
        <FormInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
          error={fieldErrors.password}
        />

        <AuthLink linkText="Forgot your password?" linkUrl="/forgot-password" />
        <SubmitButton
          text="Log in"
          pendingText="Signing in..."
          isPending={loginMutation.isPending}
        />
        <Separator />
      </form>
      <div className="flex flex-col gap-4 mt-4">
        <SecondaryButton
          text="Sign in with Google"
          icon={<PiSignIn size={24} />}
        />
        <span className="text-sm text-gray-500">
          Need an account? <AuthLink linkText="Sign up" linkUrl="/register" />
        </span>
      </div>
    </AuthSection>
  );
}
