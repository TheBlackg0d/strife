import React from "react";

interface AuthSectionProps {
  children: React.ReactNode;
}

function AuthSection({ children }: AuthSectionProps) {
  return (
    <main className="flex justify-center items-center h-screen bg-[url('/images/auth-bg.png')] bg-cover bg-center">
      <div className="w-3/10 h-7/10 rounded-lg shadow-2xl bg-zinc-800 p-8 ">
        {children}
      </div>
    </main>
  );
}

export default AuthSection;
