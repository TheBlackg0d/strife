import React from "react";

interface SecondaryButtonProps {
  text: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

function SecondaryButton({ text, onClick, icon }: SecondaryButtonProps) {
  return (
    <button
      className="w-full h-10  flex  justify-center items-center rounded-lg bg-zinc-700 text-white text-sm font-normal font-['Inter'] leading-4 hover:bg-zinc-600"
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
}

export default SecondaryButton;
