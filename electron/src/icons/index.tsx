/** @jsx jsx */
import { jsx, Interpolation, css } from "@emotion/core";
import { colors } from "../styles";

type Props = {
  color?: string;
  height?: number;
  width?: number;
};

type PropsWithOpacity = Props & {
  opacity?: number;
};

type PropsWithStyleOverrides = Props & {
  cssOverrides?: Interpolation;
};

export function Logo({ height, width }: Props) {
  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <circle
        cx="25"
        cy="25"
        r="18"
        stroke="black"
        strokeWidth="2"
        fill="#00000000"
      ></circle>
      <line x1="25" y1="0" x2="25" y2="50" stroke="black" strokeWidth="2" />
    </svg>
  );
}

export function Add({ color = "black", height = 14, width = 14 }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      css={{
        stroke: colors.iconColor,
      }}
    >
      <line
        x1="10"
        y1="0"
        x2="10"
        y2="20"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="0"
        y1="10"
        x2="20"
        y2="10"
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
      css={{
        fill: colors.iconColor,
      }}
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
      css={{
        fill: colors.iconColor,
      }}
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

export function Link({
  height,
  width,
  color = colors.iconColor,
  opacity = 1,
}: PropsWithOpacity) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 512 512"
      css={{
        fill: color,
        opacity,
      }}
    >
      <path d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path>
    </svg>
  );
}

export function Text({
  height,
  width,
  color = colors.iconColor,
  opacity = 1,
}: PropsWithOpacity) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 448 512"
      css={{
        fill: color,
        opacity,
      }}
    >
      <path d="M432 416h-23.41L277.88 53.69A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.69L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z"></path>
    </svg>
  );
}

export function AlignLeft({ height, width, color = colors.iconColor }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 16 16"
      css={{
        fill: color,
      }}
    >
      <rect x="0" y="0" width="1" height="16" />
      <rect x="4" y="4" width="12" height="2" />
      <rect x="4" y="10" width="6" height="2" />
    </svg>
  );
}

export function AlignRight({ height, width, color = colors.iconColor }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 16 16"
      css={{
        fill: color,
      }}
    >
      <rect x="15" y="0" width="1" height="16" />
      <rect x="0" y="4" width="12" height="2" />
      <rect x="6" y="10" width="6" height="2" />
    </svg>
  );
}

export function AlignCenter({
  height,
  width,
  color = colors.iconColor,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 16 16"
      css={{
        fill: color,
      }}
    >
      <rect x="7.5" y="0" width="1" height="16" />
      <rect x="2" y="4" width="12" height="2" />
      <rect x="5" y="10" width="6" height="2" />
    </svg>
  );
}

export function AlignStretch({
  height,
  width,
  color = colors.iconColor,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 16 16"
      css={{
        fill: color,
      }}
    >
      <rect x="0" y="0" width="1" height="16" />
      <rect x="15" y="0" width="1" height="16" />
      <rect x="3" y="4" width="10" height="2" />
      <rect x="3" y="10" width="10" height="2" />
    </svg>
  );
}

export function AlignTop({ height, width, color = colors.iconColor }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 16 16"
      css={{
        fill: color,
      }}
    >
      <rect x="0" y="0" width="16" height="1" />
      <rect x="4" y="4" width="2" height="12" />
      <rect x="10" y="4" width="2" height="6" />
    </svg>
  );
}

export function AlignBottom({
  height,
  width,
  color = colors.iconColor,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 16 16"
      css={{
        fill: color,
      }}
    >
      <rect x="0" y="15" width="16" height="1" />
      <rect x="4" y="0" width="2" height="12" />
      <rect x="10" y="6" width="2" height="6" />
    </svg>
  );
}

export function AlignVerticalCenter({
  height,
  width,
  color = colors.iconColor,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 16 16"
      css={{
        fill: color,
      }}
    >
      <rect x="0" y="7.5" width="16" height="1" />
      <rect x="4" y="2" width="2" height="12" />
      <rect x="10" y="5" width="2" height="6" />
    </svg>
  );
}

export function AlignVerticalStretch({
  height,
  width,
  color = colors.iconColor,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 16 16"
      css={{
        fill: color,
      }}
    >
      <rect x="0" y="0" width="16" height="1" />
      <rect x="0" y="15" width="16" height="1" />
      <rect x="4" y="3" width="2" height="10" />
      <rect x="10" y="3" width="2" height="10" />
    </svg>
  );
}

export function Container({
  height,
  width,
  color = colors.iconColor,
  opacity = 1,
}: PropsWithOpacity) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 128 128"
      css={{
        stroke: color,
        opacity,
      }}
    >
      <rect
        x="8"
        y="8"
        width="112"
        height="40"
        fill="transparent"
        strokeWidth="12"
      />
      <rect
        x="8"
        y="80"
        width="112"
        height="40"
        fill="transparent"
        strokeWidth="12"
      />
    </svg>
  );
}

type Dimension = {
  height: number;
  width: number;
};

type Colors = {
  fill: string;
};

export function Underline({ height, width, fill }: Dimension & Colors) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="transparent" />
      <path
        d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"
        fill={fill}
      />
    </svg>
  );
}

export function Strikethrough({ height, width, fill }: Dimension & Colors) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 24 24"
    >
      <defs>
        <path id="a" d="M0 0h24v24H0V0z" />
      </defs>
      <clipPath id="b">
        <use xlinkHref="#a" overflow="visible" />
      </clipPath>
      <path
        clipPath="url(#b)"
        fill={fill}
        d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67.26-.5.63-.93 1.11-1.29.48-.35 1.05-.63 1.7-.83.66-.19 1.39-.29 2.18-.29.81 0 1.54.11 2.21.34.66.22 1.23.54 1.69.94.47.4.83.88 1.08 1.43.25.55.38 1.15.38 1.81h-3.01c0-.31-.05-.59-.15-.85-.09-.27-.24-.49-.44-.68-.2-.19-.45-.33-.75-.44-.3-.1-.66-.16-1.06-.16-.39 0-.74.04-1.03.13-.29.09-.53.21-.72.36-.19.16-.34.34-.44.55-.1.21-.15.43-.15.66 0 .48.25.88.74 1.21.38.25.77.48 1.41.7H7.39c-.05-.08-.11-.17-.15-.25zM21 12v-2H3v2h9.62c.18.07.4.14.55.2.37.17.66.34.87.51.21.17.35.36.43.57.07.2.11.43.11.69 0 .23-.05.45-.14.66-.09.2-.23.38-.42.53-.19.15-.42.26-.71.35-.29.08-.63.13-1.01.13-.43 0-.83-.04-1.18-.13s-.66-.23-.91-.42c-.25-.19-.45-.44-.59-.75-.14-.31-.25-.76-.25-1.21H6.4c0 .55.08 1.13.24 1.58.16.45.37.85.65 1.21.28.35.6.66.98.92.37.26.78.48 1.22.65.44.17.9.3 1.38.39.48.08.96.13 1.44.13.8 0 1.53-.09 2.18-.28s1.21-.45 1.67-.79c.46-.34.82-.77 1.07-1.27s.38-1.07.38-1.71c0-.6-.1-1.14-.31-1.61-.05-.11-.11-.23-.17-.33H21z"
      />
    </svg>
  );
}

export function ArrowUp({
  height,
  width,
  cssOverrides,
}: PropsWithStyleOverrides) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 448 512"
      css={css(
        {
          fill: colors.iconColor,
        },
        css(cssOverrides)
      )}
    >
      <path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path>
    </svg>
  );
}

export function ArrowDown({
  height,
  width,
  cssOverrides,
}: PropsWithStyleOverrides) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 448 512"
      css={css(
        {
          fill: colors.iconColor,
        },
        css(cssOverrides)
      )}
    >
      <path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path>
    </svg>
  );
}

export function ChevronDown({
  height,
  width,
  cssOverrides,
}: PropsWithStyleOverrides) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 448 512"
      css={css(
        {
          fill: colors.iconColor,
        },
        css(cssOverrides)
      )}
    >
      <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
    </svg>
  );
}

export function ArrowLeft({
  height,
  width,
  cssOverrides,
}: PropsWithStyleOverrides) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 448 512"
      css={css(
        {
          fill: colors.iconColor,
        },
        css(cssOverrides)
      )}
    >
      <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path>
    </svg>
  );
}

export function ArrowRight({
  height,
  width,
  cssOverrides,
}: PropsWithStyleOverrides) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 448 512"
      css={css(
        {
          fill: colors.iconColor,
        },
        css(cssOverrides)
      )}
    >
      <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path>
    </svg>
  );
}

export function Image({
  height,
  width,
  color = colors.iconColor,
  opacity = 1,
}: PropsWithOpacity) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 512 512"
      css={{
        fill: color,
        opacity,
      }}
    >
      <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z"></path>
    </svg>
  );
}

export function Component({
  height,
  width,
  color = colors.iconColor,
  opacity = 1,
}: PropsWithOpacity) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 128 128"
      css={{
        stroke: color,
        opacity,
      }}
    >
      <ellipse
        cx="64"
        cy="64"
        rx="60"
        ry="25"
        fill="transparent"
        strokeWidth="10"
        transform="rotate(90, 64, 64)"
      />
      <ellipse
        cx="64"
        cy="64"
        rx="60"
        ry="25"
        fill="transparent"
        strokeWidth="10"
        transform="rotate(210, 64, 64)"
      />
      <ellipse
        cx="64"
        cy="64"
        rx="60"
        ry="25"
        fill="transparent"
        strokeWidth="10"
        transform="rotate(330, 64, 64)"
      />
      <ellipse
        cx="64"
        cy="64"
        rx="2"
        ry="2"
        fill="transparent"
        strokeWidth="10"
      />
    </svg>
  );
}

export function Settings({ height, width }: Dimension) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 20 20"
      css={{
        fill: colors.iconColor,
      }}
    >
      <path fill="none" d="M0 0h20v20H0V0z" />
      <path d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" />
    </svg>
  );
}
