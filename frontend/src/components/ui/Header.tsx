
interface HeaderRegisterProps {
  title?: string;
  subtitle?: string;
}

function Header({ title, subtitle }: HeaderRegisterProps) {
  return (
    <header className="flex flex-col gap-2 mb-8">
      <div className="text-center justify-center text-white text-3xl font-bold font-['Inter'] leading-8 ">
        {title || "Create an account"}
      </div>
      <div className="text-center justify-center text-gray-400 text-2sm font-normal font-['Inter'] leading-5">
        {subtitle || "Join Strife today."}
      </div>
    </header>
  );
}

export default Header;
