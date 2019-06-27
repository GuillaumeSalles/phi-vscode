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
  useNumberFormEntry,
  FormInput,
  FormNumberInput,
  useDialogForm
} from "../../components/Form";
import { validateFontSizeName } from "../../validators";
import uuid from "uuid/v4";
import Button from "../../components/Button";

type Props = {
  items: T.FontSizesMap;
  onItemsChange: (items: T.FontSizesMap) => void;
};

export default function FontSizes({ items, onItemsChange }: Props) {
  const nameEntry = useStringFormEntry("", value =>
    validateFontSizeName(value, items)
  );
  const valueEntry = useNumberFormEntry(16, () => {
    return undefined;
  });
  const addDialog = useDialogForm([nameEntry, valueEntry], () => {
    onItemsChange(
      set(items, uuid(), {
        name: nameEntry.value,
        value: valueEntry.value + "px"
      })
    );
  });
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  return (
    <React.Fragment>
      <div css={[row, { marginBottom: "20px" }]}>
        <h2 css={subHeading}>Font sizes</h2>
        <div css={[row, { marginLeft: "28px" }]}>
          <SecondaryButton
            text="Add"
            onClick={addDialog.open}
            margin="0 10px 0 0"
          />
          <SecondaryButton
            text="Delete"
            disabled={selectedItem === null}
            onClick={() => {
              onItemsChange(del(items, selectedItem!));
              setSelectedItem(null);
            }}
          />
        </div>
      </div>

      {Array.from(items.entries()).map(entry => (
        <div key={entry[0]} css={[column, { marginBottom: "20px" }]}>
          <div
            css={{
              color: "rgb(153, 153, 153)",
              fontSize: "12px",
              margin: "0px 0px 12px"
            }}
          >
            {entry[1].name} - {entry[1].value}
          </div>
          <SelectableCard
            isSelected={selectedItem === entry[0]}
            onClick={() => setSelectedItem(entry[0])}
          >
            <div css={{ fontSize: entry[1].value, margin: "12px" }}>
              Saturn studio - closing the gap between developers and designers
            </div>
          </SelectableCard>
        </div>
      ))}
      <OkCancelModal
        title="Add font size"
        {...addDialog.dialogProps}
        buttons={
          <React.Fragment>
            <SecondaryButton text="Cancel" {...addDialog.cancelButtonProps} />
            <Button text="Add" {...addDialog.okButtonProps} />
          </React.Fragment>
        }
        form={
          <React.Fragment>
            <FormInput
              placeholder="Name your font size"
              {...nameEntry.inputProps}
            />
            <FormNumberInput
              placeholder="Size in pixels"
              {...valueEntry.inputProps}
            />
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
}
