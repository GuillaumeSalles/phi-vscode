/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../types";
import { column, row, mainPadding, heading } from "../styles";
import { useState } from "react";
import SecondaryButton from "../components/SecondaryButton";
import { del, set } from "../helpers/immutable-map";
import SelectableCard from "../components/SelectableCard";
import OkCancelModal from "../components/OkCancelModal";
import { getContrastColor } from "../utils";
import { Layout } from "../components/Layout";
import TopBar from "../components/TopBar";
import {
  useStringFormEntry,
  FormInput,
  useDialogForm
} from "../components/Form";
import uuid from "uuid/v4";
import { validateColorName, validateColorValue } from "../validators";
import Button from "../components/Button";
import RefActions from "../components/RefActions";

type Props = {
  menu: React.ReactNode;
  refs: T.Refs;
  colors: Map<string, T.ColorDefinition>;
  onColorsChange: (newColors: Map<string, T.ColorDefinition>) => void;
};

function Colors({ menu, refs, colors, onColorsChange }: Props) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const nameEntry = useStringFormEntry("", value =>
    validateColorName(value, selectedColor, colors)
  );
  const valueEntry = useStringFormEntry("", validateColorValue);

  const addColorDialog = useDialogForm([nameEntry, valueEntry], () => {
    onColorsChange(
      set(colors, isEditing ? selectedColor! : uuid(), {
        name: nameEntry.value,
        value: valueEntry.value
      })
    );
  });
  return (
    <Layout
      topBar={<TopBar fileName={refs.fileName} isSaved={refs.isSaved} />}
      left={menu}
      center={
        <div css={[column, mainPadding]}>
          <div css={[row, { marginBottom: "20px", alignItems: "flex-end" }]}>
            <h1 css={heading}>Colors</h1>
            <RefActions
              onAddClick={() => {
                setIsEditing(false);
                addColorDialog.open();
              }}
              canEdit={selectedColor !== null}
              onEditClick={() => {
                if (selectedColor == null) {
                  throw new Error("selectedColor can't be null on edit");
                }
                const selectedItem = colors.get(selectedColor);
                if (selectedItem == null) {
                  throw new Error("Color not found");
                }
                setIsEditing(true);
                addColorDialog.open();
                nameEntry.setValue(selectedItem.name);
                valueEntry.setValue(selectedItem.value);
              }}
              isDeleteDisabled={selectedColor === null || colors.size <= 1}
              onDeleteClick={() => {
                onColorsChange(del(colors, selectedColor!));
                setSelectedColor(null);
              }}
            />
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
            title={isEditing ? "Edit Color" : "Add Color"}
            {...addColorDialog.dialogProps}
            buttons={
              <React.Fragment>
                <SecondaryButton
                  text="Cancel"
                  {...addColorDialog.cancelButtonProps}
                />
                <Button text="Save" {...addColorDialog.okButtonProps} />
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
