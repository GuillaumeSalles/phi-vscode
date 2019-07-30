/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../types";
import { column, subHeading, row } from "../../styles";
import SecondaryButton from "../../components/SecondaryButton";
import SelectableCard from "../../components/SelectableCard";
import OkCancelModal from "../../components/OkCancelModal";
import { useStringFormEntry, FormInput } from "../../components/Form";
import Button from "../../components/Button";
import RefActions from "../../components/RefActions";
import { useRefManagement } from "../../hooks";
import { isLayerUsingRef } from "../../layerUtils";

type Props = {
  items: T.FontSizesMap;
  onItemsChange: (items: T.FontSizesMap) => void;
  refs: T.Refs;
};

function isUsingFontSize(style: T.LayerStyle, refId: string): boolean {
  return style.fontSize != null && style.fontSize.id === refId;
}

export default function FontSizes({ items, onItemsChange, refs }: Props) {
  const valueEntry = useStringFormEntry("", () => {
    return undefined;
  });
  const {
    nameEntry,
    selectedRefId,
    selectRef,
    dialog,
    refActionsProps,
    deleteRefDialogProps,
    closeDeleteRefDialogProps
  } = useRefManagement(
    "Font size",
    items,
    onItemsChange,
    [valueEntry],
    fontSizes => {
      valueEntry.setValue(fontSizes.value);
    },
    name => ({
      name,
      value: valueEntry.value
    }),
    (layer, refId) => isLayerUsingRef(layer, refId, isUsingFontSize),
    refs.components
  );
  return (
    <React.Fragment>
      <div css={[row, { marginBottom: "20px" }]}>
        <h2 css={subHeading}>Font sizes</h2>
        <RefActions {...refActionsProps} />
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
            isSelected={selectedRefId === entry[0]}
            onClick={() => selectRef(entry[0])}
          >
            <div css={{ fontSize: entry[1].value, margin: "12px" }}>
              Saturn studio - closing the gap between developers and designers
            </div>
          </SelectableCard>
        </div>
      ))}
      {selectedRefId && (
        <OkCancelModal
          {...deleteRefDialogProps}
          buttons={<Button text="Ok" {...closeDeleteRefDialogProps} />}
        />
      )}
      <OkCancelModal
        title="Add font size"
        {...dialog.dialogProps}
        buttons={
          <React.Fragment>
            <SecondaryButton text="Cancel" {...dialog.cancelButtonProps} />
            <Button text="Add" {...dialog.okButtonProps} />
          </React.Fragment>
        }
        form={
          <React.Fragment>
            <FormInput
              placeholder="Name your font size"
              {...nameEntry.inputProps}
            />
            <FormInput
              placeholder="Size in pixels"
              {...valueEntry.inputProps}
            />
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
}
