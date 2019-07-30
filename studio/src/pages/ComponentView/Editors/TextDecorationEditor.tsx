/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import { ToggleButton } from "../../../components/ToggleButton";
import { Underline, Strikethrough } from "../../../icons";

type Props = {
  value: T.TextDecoration;
  onChange: (value: T.TextDecoration) => void;
};

export default function TextDecorationEditor({ value, onChange }: Props) {
  function updateLayer(newProps: Partial<T.TextDecoration>) {
    onChange({ ...value, ...newProps });
  }

  return (
    <div css={[row, { padding: "0 0 0 8px" }]}>
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
  );
}
