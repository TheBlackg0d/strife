interface HeaderRegisterProps {
  title?: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  headerClassName?: string;
}
function Header({
  title,
  subtitle,
  titleClassName = "",
  subtitleClassName = "",
  headerClassName = "",
}: HeaderRegisterProps) {
  return (
    <header className={`flex flex-col gap-2  ${headerClassName} `}>
      <div
        className={`text-center justify-center text-white text-3xl font-bold font-['Inter'] leading-8 ${titleClassName}`}
      >
        {title || "Create an account"}
      </div>
      <div
        className={`text-center justify-center text-gray-400 text-2sm font-normal font-['Inter'] leading-5 ${subtitleClassName}`}
      >
        {subtitle || "Join Strife today."}
      </div>
    </header>
  );
}

export default Header;
