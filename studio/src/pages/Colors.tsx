/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../types";
import { column, row, mainPadding, heading } from "../styles";
import { useState } from "react";
import Modal from "../Modal";
import Input from "../components/Input";
import SecondaryButton from "../components/SecondaryButton";
import { del, set } from "../helpers/immutable-map";
import SelectableCard from "../components/SelectableCard";
import AddModal from "../components/AddModal";
import { getContrastColor } from "../utils";
import { Layout } from "../components/Layout";
import Menu from "../components/Menu";

type Props = {
  components: T.ComponentMap;
  colors: Map<string, T.ColorDefinition>;
  onColorsChange: (newColors: Map<string, T.ColorDefinition>) => void;
};

function Colors({ components, colors, onColorsChange }: Props) {
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
    <Layout
      left={<Menu components={components} />}
      center={
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
                  onColorsChange(del(colors, selectedColor!));
                  setSelectedColor(null);
                }}
              />
            </div>
          </div>

          <div css={[row, { flexWrap: "wrap" }]}>
            {Array.from(colors.values()).map(c => {
              const contrast = getContrastColor(c.value);
              return (
                <SelectableCard
                  key={c.name}
                  overrides={{
                    margin: "0 16px 16px 0"
                  }}
                  isSelected={selectedColor === c.name}
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
                      height: "80px",
                      width: "80px",
                      background: c.value,
                      borderRadius: "2px",
                      margin: "8px"
                    }}
                  >
                    <div>{c.name}</div>
                    <div>{c.value}</div>
                  </div>
                </SelectableCard>
              );
            })}
          </div>
          <Modal isOpen={isModalOpen}>
            <AddModal
              title="Add color"
              form={
                <React.Fragment>
                  <p
                    css={{
                      color: "rgb(102, 102, 102)",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "24px"
                    }}
                  >
                    The name should unique. <br /> The value should be in
                    hexadecimal (e.g: #AABBCC).
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
                </React.Fragment>
              }
              onCancel={() => setIsModalOpen(false)}
              onAdd={() => {
                if (!isFormValid()) {
                  setHasTryToSubmit(true);
                } else {
                  onColorsChange(
                    set(colors, colorName, {
                      name: colorName,
                      value: colorValue
                    })
                  );
                  setIsModalOpen(false);
                }
              }}
            />
          </Modal>
        </div>
      }
    />
  );
}

export default Colors;

function isHexRGB(str: string) {
  return /^#[0-9a-f]{6}$/i.test(str);
}
