import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7.5 7.5C7.5 5.84315 8.84315 4.5 10.5 4.5H18.5C20.1569 4.5 21.5 5.84315 21.5 7.5V13.5C21.5 15.1569 20.1569 16.5 18.5 16.5H10.5C8.84315 16.5 7.5 15.1569 7.5 13.5V7.5Z" />
      <path d="M4.5 19.5V8.5C4.5 6.84315 5.84315 5.5 7.5 5.5" />
      <circle cx="10" cy="19" r="1" />
      <circle cx="18" cy="19" r="1" />
      <path d="M14.5 8.5L14.5 12.5" />
      <path d="M14.5 12.5C14.5 13.6046 13.6046 14.5 12.5 14.5C11.3954 14.5 10.5 13.6046 10.5 12.5" />
    </svg>
  );
}
