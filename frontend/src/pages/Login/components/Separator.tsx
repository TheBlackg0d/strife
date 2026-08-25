import React from "react";

function Separator() {
  return (
    <div className="flex flex-row justify-center items-center gap-4 mb-5 mt-5">
      <div className="w-full h-px border-t border-gray-700" />
      <div className="size- px-4 inline-flex flex-col justify-start items-start">
        <div className="justify-center text-slate-300 text-sm font-normal font-['Inter'] leading-4">
          or
        </div>
      </div>
      <div className="w-full h-px border-t border-gray-700" />
    </div>
  );
}

export default Separator;
