/** @jsx jsx */
import { jsx } from "@emotion/core";
import { colors } from "../styles";
import React from "react";

export function ToggleButton({
  icon,
  isChecked,
  name,
  onChange
}: {
  icon: (props: { isChecked: boolean }) => React.ReactNode;
  isChecked: boolean;
  name: string;
  onChange: (isChecked: boolean) => void;
}) {
  return (
    <label
      css={{
        padding: "4px 8px",
        display: "flex",
        background: isChecked ? colors.primary : "#F0F0F0"
      }}
    >
      <input
        css={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0
        }}
        type="checkbox"
        name={name}
        checked={isChecked}
        onChange={e => onChange(e.target.checked)}
      />
      {icon({ isChecked })}
    </label>
  );
}
