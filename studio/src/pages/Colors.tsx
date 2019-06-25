/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../types";
import { column, row, mainPadding, heading } from "../styles";
import { useState } from "react";
import Input from "../components/Input";
import SecondaryButton from "../components/SecondaryButton";
import { del, set } from "../helpers/immutable-map";
import SelectableCard from "../components/SelectableCard";
import OkCancelModal, { useOkCancelModal } from "../components/OkCancelModal";
import { getContrastColor } from "../utils";
import { Layout } from "../components/Layout";
import TopBar from "../components/TopBar";
import { useStringFormEntry, useForm } from "../components/Form";
import uuid from "uuid/v4";

type Props = {
  menu: React.ReactNode;
  refs: T.Refs;
  colors: Map<string, T.ColorDefinition>;
  onColorsChange: (newColors: Map<string, T.ColorDefinition>) => void;
};

function Colors({ menu, refs, colors, onColorsChange }: Props) {
  const modal = useOkCancelModal();
  const nameEntry = useStringFormEntry("", value => {
    if (value.length === 0) {
      return "Color name is required";
    }
  });
  const valueEntry = useStringFormEntry("", value => {
    if (value.length === 0) {
      return "Color value is required";
    }
    if (!isHexRGB(value)) {
      return "Color value should follow the pattern #AABBCC";
    }
  });
  const addColor = useForm([nameEntry, valueEntry], () => {
    onColorsChange(
      set(colors, uuid(), {
        name: nameEntry.value,
        value: valueEntry.value
      })
    );
    modal.close();
  });
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  return (
    <Layout
      topBar={<TopBar fileName={refs.fileName} isSaved={refs.isSaved} />}
      left={menu}
      center={
        <div css={[column, mainPadding]}>
          <div css={[row, { marginBottom: "20px", alignItems: "flex-end" }]}>
            <h1 css={heading}>Colors</h1>
            <div css={[row, { marginLeft: "28px" }]}>
              <SecondaryButton
                text="Add"
                onClick={() => {
                  modal.open();
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
            {Array.from(colors.entries()).map(entry => {
              const contrast = getContrastColor(entry[1].value);
              return (
                <SelectableCard
                  key={entry[0]}
                  overrides={{
                    margin: "0 16px 16px 0"
                  }}
                  isSelected={selectedColor === entry[0]}
                  onClick={() =>
                    setSelectedColor(
                      selectedColor === entry[0] ? null : entry[0]
                    )
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
                      background: entry[1].value,
                      borderRadius: "2px",
                      margin: "8px"
                    }}
                  >
                    <div>{entry[1].name}</div>
                    <div>{entry[1].value}</div>
                  </div>
                </SelectableCard>
              );
            })}
          </div>
          <OkCancelModal
            isOpen={modal.isOpen}
            title="Add color"
            description={
              <>
                The name should unique. <br /> The value should be in
                hexadecimal (e.g: #AABBCC).
              </>
            }
            form={
              <React.Fragment>
                <Input
                  placeholder="Name"
                  margin="0 0 12px"
                  {...nameEntry.inputProps}
                />
                <Input
                  placeholder="Value in hex. (e.g: #AABBCC)"
                  {...valueEntry.inputProps}
                />
              </React.Fragment>
            }
            onCancel={modal.close}
            onOk={addColor}
          />
        </div>
      }
    />
  );
}

export default Colors;

function isHexRGB(str: string) {
  return /^#[0-9a-f]{6}$/i.test(str);
}
