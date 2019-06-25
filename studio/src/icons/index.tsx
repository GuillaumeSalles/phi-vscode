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

type DeleteProps = {
  height: number;
  width: number;
};

export function Delete({ height, width }: DeleteProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
    >
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

type EditProps = {
  height: number;
  width: number;
};

export function Edit({ height, width }: EditProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 24 24"
    >
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}
