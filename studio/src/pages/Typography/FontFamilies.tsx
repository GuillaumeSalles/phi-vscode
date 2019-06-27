/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../types";
import { column, subHeading, row } from "../../styles";
import SecondaryButton from "../../components/SecondaryButton";
import { useState } from "react";
import { del, set } from "../../helpers/immutable-map";
import SelectableCard from "../../components/SelectableCard";
import OkCancelModal from "../../components/OkCancelModal";
import {
  useStringFormEntry,
  FormInput,
  useDialogForm
} from "../../components/Form";
import { validateFontFamilyName } from "../../validators";
import uuid from "uuid/v4";
import Button from "../../components/Button";

type Props = {
  fontFamilies: T.FontFamiliesMap;
  onFontFamiliesChange: (fontFamilies: T.FontFamiliesMap) => void;
};

export default function FontFamilies({
  fontFamilies,
  onFontFamiliesChange
}: Props) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const nameEntry = useStringFormEntry("", value =>
    validateFontFamilyName(value, fontFamilies)
  );
  const valueEntry = useStringFormEntry("", () => {
    return undefined;
  });
  const addFontFamilyDialog = useDialogForm([nameEntry, valueEntry], () => {
    onFontFamiliesChange(
      set(fontFamilies, uuid(), {
        name: nameEntry.value,
        value: valueEntry.value
      })
    );
  });
  return (
    <React.Fragment>
      <div css={[row, { marginBottom: "20px" }]}>
        <h2 css={subHeading}>Font family</h2>
        <div css={[row, { marginLeft: "28px" }]}>
          <SecondaryButton
            text="Add"
            onClick={addFontFamilyDialog.open}
            margin="0 10px 0 0"
          />
          <SecondaryButton
            text="Delete"
            disabled={selectedItem === null}
            onClick={() => {
              onFontFamiliesChange(del(fontFamilies, selectedItem!));
              setSelectedItem(null);
            }}
          />
        </div>
      </div>

      {Array.from(fontFamilies.entries()).map(entry => (
        <div key={entry[0]} css={[column, { marginBottom: "20px" }]}>
          <div
            css={{
              color: "rgb(153, 153, 153)",
              fontSize: "12px",
              margin: "0px 0px 12px"
            }}
          >
            {entry[1].name}
          </div>
          <SelectableCard
            isSelected={selectedItem === entry[0]}
            onClick={() => setSelectedItem(entry[0])}
          >
            <div css={{ fontFamily: entry[1].value, margin: "12px" }}>
              {entry[1].value}
            </div>
          </SelectableCard>
        </div>
      ))}
      <OkCancelModal
        title="Add font-family"
        {...addFontFamilyDialog.dialogProps}
        buttons={
          <React.Fragment>
            <SecondaryButton
              text="Cancel"
              {...addFontFamilyDialog.cancelButtonProps}
            />
            <Button text="Add" {...addFontFamilyDialog.okButtonProps} />
          </React.Fragment>
        }
        form={
          <React.Fragment>
            <FormInput
              placeholder="Name your font family"
              {...nameEntry.inputProps}
            />
            <FormInput
              placeholder="List of fonts separated by commas"
              {...valueEntry.inputProps}
            />
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
}
