/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../types";
import { column, row, mainPadding, heading, primaryButton } from "../styles";
import { useState } from "react";
import Modal from "../Modal";
import Input from "../primitives/Input";
import ModalButton from "../primitives/ModalButton";
import SecondaryButton from "../primitives/SecondaryButton";

type Props = {
  colors: Map<string, T.ColorDefinition>;
  onColorsChange: (newColors: Map<string, T.ColorDefinition>) => void;
};

function Colors({ colors, onColorsChange }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colorName, setColorName] = useState("");
  const [colorValue, setColorValue] = useState("");
  const [hasTryToSubmit, setHasTryToSubmit] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  function isFormValid() {
    return isColorNameValid() && isColorValueValid();
  }

  function isColorNameValid() {
    return colorName.length > 0 && !colors.has(colorName);
  }

  function isColorValueValid() {
    return isHexRGB(colorValue);
  }

  function resetForm() {
    setColorName("");
    setColorValue("");
    setHasTryToSubmit(false);
  }

  return (
    <div css={[column, mainPadding]}>
      <div css={[row, { marginBottom: "20px", alignItems: "flex-end" }]}>
        <h1 css={heading}>Colors</h1>
        <div css={[row, { marginLeft: "28px" }]}>
          <SecondaryButton
            text="Add"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            margin="0 10px 0 0"
          />
          <SecondaryButton
            text="Delete"
            disabled={selectedColor === null}
            onClick={() => {
              onColorsChange(immDelete(colors, colorName));
            }}
          />
        </div>
      </div>

      <div css={[row, { flexWrap: "wrap" }]}>
        {Array.from(colors.values()).map(c => {
          const contrast = getContrastColor(c.value);
          return (
            <div
              key={c.name}
              css={{
                boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 5px 0px",
                width: "100px",
                height: "100px",
                cursor: "pointer",
                margin: "0 16px 16px 0",
                padding: selectedColor === c.name ? "8px" : "10px",
                background: "white",
                borderRadius: "2px",
                border: selectedColor === c.name ? "solid #0076FF 2px" : "none"
              }}
              onClick={() =>
                setSelectedColor(selectedColor === c.name ? null : c.name)
              }
            >
              <div
                css={{
                  color: contrast,
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                  background: c.value,
                  borderRadius: "3px"
                }}
              >
                <div>{c.name}</div>
                <div>{c.value}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Modal isOpen={isModalOpen}>
        <div
          css={[
            column,
            {
              boxShadow: "rgba(0, 0, 0, 0.12) 0px 20px 30px 0px;",
              background: "white",
              borderRadius: "8px",
              overflow: "hidden"
            }
          ]}
        >
          <header
            css={[
              column,
              {
                padding: "30px 45px"
              }
            ]}
          >
            <h1 css={[heading, { alignSelf: "center" }]}>Add color</h1>
            <p
              css={{
                color: "rgb(102, 102, 102)",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "24px"
              }}
            >
              The name should unique. <br /> The value should be in hexadecimal
              (e.g: #AABBCC).
            </p>
            <Input
              placeholder="Name"
              margin="0 0 12px"
              value={colorName}
              onChange={e => setColorName(e.target.value)}
              isInvalid={hasTryToSubmit && !isColorNameValid()}
            />
            <Input
              placeholder="Value in hex. (e.g: #AABBCC)"
              value={colorValue}
              onChange={e => setColorValue(e.target.value)}
              isInvalid={hasTryToSubmit && !isColorValueValid()}
            />
          </header>

          <div css={[row, { borderTop: "1px solid rgb(234, 234, 234)" }]}>
            <ModalButton text="cancel" onClick={() => setIsModalOpen(false)} />
            <ModalButton
              text="Add"
              onClick={() => {
                if (!isFormValid()) {
                  setHasTryToSubmit(true);
                } else {
                  onColorsChange(
                    immSet(colors, colorName, {
                      name: colorName,
                      value: colorValue
                    })
                  );
                  setIsModalOpen(false);
                }
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Colors;

function immSet<TKey, TValue>(
  map: Map<TKey, TValue>,
  key: TKey,
  value: TValue
) {
  const newMap = new Map(map);
  newMap.set(key, value);
  return newMap;
}

function immDelete<TKey, TValue>(map: Map<TKey, TValue>, key: TKey) {
  const newMap = new Map(map);
  newMap.delete(key);
  return newMap;
}

function isHexRGB(str: string) {
  return /^#[0-9a-f]{6}$/i.test(str);
}

function getContrastColor(hex: string) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  // http://stackoverflow.com/a/3943023/112731
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
}
