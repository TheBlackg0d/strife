import { useEffect } from "react";
import { useNavigate } from "react-router";
import FormInput from "../../components/ui/FormInput";
import HeaderRegister from "../../components/ui/Header";
import SubmitButton from "../../components/ui/SubmitButton";
import AuthLink from "../../components/ui/AuthLink";
import CheckboxInput from "../../components/ui/FormCheckboxInput";
import AuthSection from "../../components/AuthSection";
import type { RegisterCredential } from "../../auth/types/auth";
import { hasFieldErrors, type FieldErrors } from "../../api/errors";
import { useRegisterMutation } from "../../services/auth-api";
import useFieldError from "../../hook/use-field-error";

function Register() {
  const navigate = useNavigate();

  const [registerMutation, { isError, error, isLoading, isSuccess }] =
    useRegisterMutation();
  const { apiError, fieldErrors, setFieldErrors } = useFieldError(
    isError,
    error,
  );

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const credential: RegisterCredential = {
      email: String(formData.get("email") ?? ""),
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
      passwordConfirmation: String(formData.get("passwordConfirmation") ?? ""),
    };

    const errors: FieldErrors = {};

    if (credential.password !== credential.passwordConfirmation) {
      errors.passwordConfirmation = "Passwords do not match";
    }

    if (!formData.get("terms")) {
      errors.terms = "You must accept the terms and conditions";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    registerMutation(credential);
  };

  return (
    <AuthSection>
      <HeaderRegister />
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        noValidate
        onBlur={() => setFieldErrors({})}
      >
        {apiError && !hasFieldErrors(apiError) && (
          <p role="alert" className="text-red-400 text-sm">
            {apiError.message}
          </p>
        )}

        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          error={fieldErrors.email}
        />
        <FormInput
          label="Username"
          name="username"
          type="text"
          placeholder="Enter your username"
          error={fieldErrors.username}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          error={fieldErrors.password}
        />
        <FormInput
          label="Confirm Password"
          name="passwordConfirmation"
          type="password"
          placeholder="Confirm your password"
          error={fieldErrors.passwordConfirmation}
        />

        <CheckboxInput name="terms" error={fieldErrors.terms}>
          <CheckboxInput.Terms />
        </CheckboxInput>

        <div className="flex flex-col gap-2">
          <SubmitButton
            text="Register"
            pendingText="Creating account..."
            isPending={isLoading}
          />
          <AuthLink linkText="Already have an account?" linkUrl="/login" />
        </div>
      </form>
    </AuthSection>
  );
}

export default Register;
