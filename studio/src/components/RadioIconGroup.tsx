/** @jsx jsx */
import { jsx } from "@emotion/core";
import { colors, row } from "../styles";
import React from "react";

const RadioIconInput = ({
  icon,
  value,
  isSelected,
  name,
  onChange
}: {
  icon: (props: { isSelected: boolean }) => React.ReactNode;
  value: string;
  isSelected: boolean;
  name: string;
  onChange: (value: string) => void;
}) => {
  return (
    <label
      css={{
        padding: "4px 8px",
        display: "flex",
        background: isSelected ? colors.primary : "#F0F0F0"
      }}
    >
      <input
        css={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0
        }}
        type="radio"
        name={name}
        value={value}
        checked={isSelected}
        onChange={e => onChange(e.target.value)}
      />
      {icon({ isSelected })}
    </label>
  );
};

type Props = {
  value: string | undefined;
  onChange: (value: string) => void;
  name: string;
  options: [string, (props: { isSelected: boolean }) => React.ReactNode][];
};

export default function RadioIconGroup({
  options,
  name,
  value,
  onChange
}: Props) {
  return (
    <React.Fragment>
      {options.map(option => (
        <RadioIconInput
          key={option[0]}
          value={option[0]}
          name={name}
          isSelected={value === option[0]}
          icon={option[1]}
          onChange={onChange}
        />
      ))}
    </React.Fragment>
  );
}
