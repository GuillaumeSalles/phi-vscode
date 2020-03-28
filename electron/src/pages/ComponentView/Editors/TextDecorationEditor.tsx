/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row, colors } from "../../../styles";
import { ToggleButton } from "../../../components/ToggleButton";
import { Underline, Strikethrough } from "../../../icons";
import Field from "../../../components/Field";

type Props = {
  style: T.LayerStyle;
  onChange: (value: Partial<T.LayerStyle>) => void;
};

export default function TextDecorationEditor({ style, onChange }: Props) {
  function updateTextDecoration(textDecoration: Partial<T.TextDecoration>) {
    onChange({
      textDecoration: {
        isUnderlined: false,
        isStrikedThrough: false,
        ...style.textDecoration,
        ...textDecoration
      }
    });
  }
  return (
    <Field label="Decoration">
      <div css={row}>
        <ToggleButton
          name="underline"
          isChecked={
            style.textDecoration != null
              ? style.textDecoration.isUnderlined
              : false
          }
          onChange={isUnderlined => updateTextDecoration({ isUnderlined })}
          icon={({ isChecked }) => (
            <Underline
              height={20}
              width={20}
              fill={
                isChecked
                  ? colors.radioIconActiveForeground
                  : colors.radioIconForeground
              }
            />
          )}
        />
        <ToggleButton
          name="isStrikedThrough"
          isChecked={
            style.textDecoration != null
              ? style.textDecoration.isStrikedThrough
              : false
          }
          onChange={isStrikedThrough =>
            updateTextDecoration({ isStrikedThrough })
          }
          icon={({ isChecked }) => (
            <Strikethrough
              height={20}
              width={20}
              fill={
                isChecked
                  ? colors.radioIconActiveForeground
                  : colors.radioIconForeground
              }
            />
          )}
        />
      </div>
    </Field>
  );
}
