/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import { ToggleButton } from "../../../components/ToggleButton";
import { Underline, Strikethrough } from "../../../icons";
import Field from "../../../components/Field";

type Props = {
  value: T.TextDecoration;
  onChange: (value: T.TextDecoration) => void;
};

export default function TextDecorationEditor({ value, onChange }: Props) {
  function updateLayer(newProps: Partial<T.TextDecoration>) {
    onChange({ ...value, ...newProps });
  }

  return (
    <Field label="Decoration">
      <div css={row}>
        <ToggleButton
          name="underline"
          isChecked={value.isUnderlined != null ? value.isUnderlined : false}
          onChange={isUnderlined => updateLayer({ isUnderlined })}
          icon={({ isChecked }) => (
            <Underline
              height={16}
              width={16}
              fill={isChecked ? "white" : "black"}
            />
          )}
        />
        <ToggleButton
          name="underline"
          isChecked={
            value.isStrikedThrough != null ? value.isStrikedThrough : false
          }
          onChange={isStrikedThrough => updateLayer({ isStrikedThrough })}
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
