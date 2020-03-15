/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row, colors } from "../../../styles";
import RadioIconGroup from "../../../components/RadioIconGroup";
import Field from "../../../components/Field";

type Props = {
  style: T.LayerStyle;
  onChange: (value: Partial<T.LayerStyle>) => void;
};

const Center = ({ fill }: { fill: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
  >
    <path fill="none" d="M0 0h24v24H0V0z" />
    <path
      fill={fill}
      d="M7 16c0 .55.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1zm-3 5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-8h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm3-5c0 .55.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1zM3 4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"
    />
  </svg>
);

const Justify = ({ fill }: { fill: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
  >
    <path fill="none" d="M0 0h24v24H0V0z" />
    <path
      fill={fill}
      d="M4 21h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-4h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-4h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-4h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"
    />
  </svg>
);

const Left = ({ fill }: { fill: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
  >
    <path fill="none" d="M0 0h24v24H0V0z" />
    <path
      fill={fill}
      d="M14 15H4c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1zm0-8H4c-.55 0-1 .45-1 1s.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1zM4 13h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0 8h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"
    />
  </svg>
);

const Right = ({ fill }: { fill: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
  >
    <path fill="none" d="M0 0h24v24H0V0z" />
    <path
      fill={fill}
      d="M4 21h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm6-4h10c.55 0 1-.45 1-1s-.45-1-1-1H10c-.55 0-1 .45-1 1s.45 1 1 1zm-6-4h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm6-4h10c.55 0 1-.45 1-1s-.45-1-1-1H10c-.55 0-1 .45-1 1s.45 1 1 1zM3 4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"
    />
  </svg>
);

export default function TextAlignEditor({ style, onChange }: Props) {
  return (
    <Field label="Allignment">
      <div css={[row]}>
        <RadioIconGroup
          name="text-align"
          options={[
            [
              "left",
              ({ isSelected }) => (
                <Left
                  fill={
                    isSelected
                      ? colors.radioIconActiveForeground
                      : colors.radioIconForeground
                  }
                />
              )
            ],
            [
              "center",
              ({ isSelected }) => (
                <Center
                  fill={
                    isSelected
                      ? colors.radioIconActiveForeground
                      : colors.radioIconForeground
                  }
                />
              )
            ],
            [
              "right",
              ({ isSelected }) => (
                <Right
                  fill={
                    isSelected
                      ? colors.radioIconActiveForeground
                      : colors.radioIconForeground
                  }
                />
              )
            ],
            [
              "justify",
              ({ isSelected }) => (
                <Justify
                  fill={
                    isSelected
                      ? colors.radioIconActiveForeground
                      : colors.radioIconForeground
                  }
                />
              )
            ]
          ]}
          value={style.textAlign != null ? style.textAlign : "left"}
          onChange={textAlign => onChange({ textAlign })}
        />
      </div>
    </Field>
  );
}
