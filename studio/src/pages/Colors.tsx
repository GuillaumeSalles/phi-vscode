/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../types";
import { column, row, mainPadding, heading } from "../styles";
import SecondaryButton from "../components/SecondaryButton";
import SelectableCard from "../components/SelectableCard";
import OkCancelModal from "../components/OkCancelModal";
import { getContrastColor } from "../utils";
import { Layout } from "../components/Layout";
import TopBar from "../components/TopBar";
import { useStringFormEntry, FormInput } from "../components/Form";
import { validateColorValue } from "../validators";
import Button from "../components/Button";
import RefActions from "../components/RefActions";
import { useRefManagement } from "../hooks";

type Props = {
  menu: React.ReactNode;
  refs: T.Refs;
  colors: Map<string, T.ColorDefinition>;
  onColorsChange: (newColors: Map<string, T.ColorDefinition>) => void;
};

function Colors({ menu, refs, colors, onColorsChange }: Props) {
  const valueEntry = useStringFormEntry("", validateColorValue);
  const {
    nameEntry,
    selectedRefId,
    selectRef,
    isEditing,
    dialog,
    refActionsProps
  } = useRefManagement(
    "Color",
    colors,
    onColorsChange,
    [valueEntry],
    color => {
      valueEntry.setValue(color.value);
    },
    name => ({
      name,
      value: valueEntry.value
    })
  );
  return (
    <Layout
      topBar={<TopBar fileName={refs.fileName} isSaved={refs.isSaved} />}
      left={menu}
      center={
        <div css={[column, mainPadding]}>
          <div css={[row, { marginBottom: "20px", alignItems: "flex-end" }]}>
            <h1 css={heading}>Colors</h1>
            <RefActions {...refActionsProps} />
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
                  isSelected={selectedRefId === entry[0]}
                  onClick={() =>
                    selectRef(selectedRefId === entry[0] ? null : entry[0])
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
            title={isEditing ? "Edit Color" : "Add Color"}
            {...dialog.dialogProps}
            buttons={
              <React.Fragment>
                <SecondaryButton text="Cancel" {...dialog.cancelButtonProps} />
                <Button text="Save" {...dialog.okButtonProps} />
              </React.Fragment>
            }
            form={
              <React.Fragment>
                <FormInput
                  placeholder="Name your color"
                  {...nameEntry.inputProps}
                />
                <FormInput
                  placeholder="Enter color in the hexadecimal format. (e.g: #AABBCC)"
                  {...valueEntry.inputProps}
                />
              </React.Fragment>
            }
          />
        </div>
      }
    />
  );
}

export default Colors;
