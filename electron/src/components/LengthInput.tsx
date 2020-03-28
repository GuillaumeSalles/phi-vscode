/** @jsx jsx */
import { jsx, Interpolation, css } from "@emotion/core";
import { styleEditorInput, colors } from "../styles";
import { useState, useRef } from "react";
import { parseLength, Unit, increment, decrement } from "../lengthUtils";

type Props = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  cssOverrides?: Interpolation;
  onlyPositive: boolean;
};

export default function LengthInput({
  value,
  onChange,
  cssOverrides,
  onlyPositive
}: Props) {
  const [uncommited, setUncommited] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const unitRef = useRef<Unit>("px");

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
          } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            const newLength =
              e.key === "ArrowUp"
                ? increment(uncommited)
                : decrement(uncommited, onlyPositive);
            setUncommited(newLength ? newLength.value.toString() : "");
            onChange(
              newLength ? `${newLength.value}${unitRef.current}` : undefined
            );
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
