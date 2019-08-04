/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
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
              height={16}
              width={16}
              fill={isChecked ? "white" : "black"}
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
              height={16}
              width={16}
              fill={isChecked ? "white" : "black"}
            />
          )}
        />
      </div>
    </Field>
  );
}
