import React from "react";
import FormInput from "../../components/ui/FormInput";
import HeaderRegister from "../../components/ui/Header";
import RegisterButton from "../../components/ui/SubmitButton";
import AuthLink from "../../components/ui/AuthLink";
import CheckboxInput from "../../components/ui/FormCheckboxInput";
import AuthSection from "../../components/AuthSection";

function Register() {
  return (
    <AuthSection>
      <HeaderRegister />
      <form className="flex flex-col gap-4">
        <FormInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          value=""
          onChange={() => {}}
        />
        <FormInput
          label="Username"
          type="text"
          placeholder="Enter your username"
          value=""
          onChange={() => {}}
        />
        <FormInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          value=""
          onChange={() => {}}
        />
        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value=""
          onChange={() => {}}
        />

        <CheckboxInput checked={false} onChange={() => {}}>
          <CheckboxInput.Terms />
        </CheckboxInput>

        <div className="flex flex-col gap-2">
          <RegisterButton />
          <AuthLink linkText="Already have an account?" linkUrl="/login" />
        </div>
      </form>
    </AuthSection>
  );
}

export default Register;
