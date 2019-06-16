/** @jsx jsx */
import { jsx } from "@emotion/core";

type Props = {
  color?: string;
};

export function Add({ color = "black" }: Props) {
  return (
    <svg
      height="14px"
      width="14px"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="10"
        y1="0"
        x2="10"
        y2="20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="0"
        y1="10"
        x2="20"
        y2="10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
