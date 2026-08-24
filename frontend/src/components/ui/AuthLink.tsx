import React from "react";

interface AuthLinkProps {
  linkText: string;
  linkUrl: string;
}

function AuthLink({ linkText, linkUrl }: AuthLinkProps) {
  return (
    <span className="text-sky-500 text-3sm font-normal font-['Inter'] leading-5 ">
      <a href={linkUrl} className="text-sky-500 underline">
        {linkText}
      </a>
    </span>
  );
}

export default AuthLink;
