/** @jsx jsx */
import { jsx } from "@emotion/core";

type Props = {
  color?: string;
  height?: number;
  width?: number;
};

export function Add({ color = "black", height = 14, width = 14 }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="10"
        y1="0"
        x2="10"
        y2="20"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="0"
        y1="10"
        x2="20"
        y2="10"
        stroke={color}
        strokeWidth="3"
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

type LinkProps = {
  height: number;
  width: number;
};

export function Link({ height, width }: LinkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
    </svg>
  );
}
