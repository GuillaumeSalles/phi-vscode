/** @jsx jsx */
import { jsx, Interpolation, css } from "@emotion/core";
import { styleEditorInput, colors } from "../styles";
import { useState, useRef } from "react";

type Props = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  cssOverrides?: Interpolation;
  onlyPositive: boolean;
};

const units = ["px", "%"];
type Unit = "px" | "%";
type Length = {
  value: number;
  unit?: Unit;
};

export function parseLength(
  value: string | undefined,
  onlyPositive: boolean
): Length | undefined {
  if (value == null) {
    return undefined;
  }

  let result = "";
  let decimal = false;
  let i = 0;

  if (value[0] === "-") {
    result += "-";
    i++;
  }

  for (; i < value.length; i++) {
    const char = value[i];
    if (decimal === false && char === ".") {
      result += char;
      decimal = true;
    } else if (char >= "0" && char <= "9") {
      result += char;
    } else {
      break;
    }
  }

  const suffix = value.slice(i);

  if (result.length === 0) {
    return undefined;
  }

  const parsedValue = Number.parseFloat(result);

  return {
    value: onlyPositive && parsedValue < 0 ? 0 : parsedValue,
    unit: units.includes(suffix) ? (suffix as Unit) : undefined
  };
}

export default function LengthInput({
  value,
  onChange,
  cssOverrides,
  onlyPositive
}: Props) {
  const [uncommited, setUncommited] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const unitRef = useRef<Unit>("px");

  function increment() {
    const length = parseLength(uncommited, onlyPositive);
    if (!length) {
      return;
    }
    const newUnit = length.unit || unitRef.current;
    const newValue = length.value + 1;
    setUncommited(newValue.toString());
    onChange(newValue + newUnit);
  }

  function decrement() {
    const length = parseLength(uncommited, onlyPositive);
    if (!length) {
      return;
    }
    if (length.value < 1 && onlyPositive) {
      return;
    }
    const newUnit = length.unit || unitRef.current;
    const newValue = length.value - 1;
    setUncommited(newValue.toString());
    onChange(newValue + newUnit);
  }

  const style = css(styleEditorInput, css(cssOverrides));
  return (
    <div css={{ position: "relative", height: "24px", width: "36px" }}>
      <input
        css={[
          style,
          {
            // We're using opacity to hide the real input to get the focus with the keyboard
            opacity: isEditing ? 1 : 0,
            position: "absolute"
          }
        ]}
        value={uncommited}
        onFocus={() => {
          const length = parseLength(value, onlyPositive);
          unitRef.current = length && length.unit ? length.unit : "px";
          setUncommited(length ? length.value.toString() : "");
          setIsEditing(true);
        }}
        onBlur={() => setIsEditing(false)}
        onKeyDown={e => {
          if (onlyPositive && e.key === "-") {
            e.preventDefault();
          } else if (e.key === "ArrowUp") {
            increment();
            e.preventDefault();
          } else if (e.key === "ArrowDown") {
            decrement();
            e.preventDefault();
          }
        }}
        onChange={e => {
          // if new value is empty string, clear length
          if (e.target.value === "") {
            setUncommited("");
            onChange(undefined);
          } else {
            const length = parseLength(e.target.value, onlyPositive);
            setUncommited(e.target.value);
            if (length) {
              if (length.unit) {
                unitRef.current = length.unit;
              }
              const newUnit = length.unit || unitRef.current;
              onChange(length.value + newUnit);
            }
          }
        }}
      />
      {isEditing === false && (
        <div
          css={{
            position: "absolute",
            pointerEvents: "none",
            height: "24px",
            fontSize: "12px",
            padding: "4px 0",
            boxSizing: "border-box",
            fontWeight: "bold",
            width: "36px",
            background: "none",
            color: colors.sideBarForeground
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}
