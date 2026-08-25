import AuthSection from "../../components/AuthSection";
import AuthLink from "../../components/ui/AuthLink";
import FormInput from "../../components/ui/FormInput";
import Header from "../../components/ui/Header";
import SubmitButton from "../../components/ui/SubmitButton";
import Separator from "./components/Separator";
import StrifeLogo from "../../components/ui/StrifeLogo";
import SecondaryButton from "../../components/ui/SecondaryButton";
import { PiSignIn } from "react-icons/pi";

export default function Login() {
  return (
    <AuthSection>
      <StrifeLogo size={36} className="mx-auto mb-4" />
      <Header
        title="Welcome back"
        subtitle="We're so excited to have you back!"
      />
      <form className="flex flex-col gap-4">
        <FormInput
          value=""
          onChange={() => {}}
          label="Email"
          placeholder="Enter your email"
          type="text"
        />
        <FormInput
          value=""
          onChange={() => {}}
          label="Password"
          placeholder="Enter your password"
          type="password"
        />

        <AuthLink linkText="Forgot your password?" linkUrl="/forgot-password" />
        <SubmitButton />
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
