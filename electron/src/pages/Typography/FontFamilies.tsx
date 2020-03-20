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

function isUsingFontSize(style: T.LayerStyle, refId: string): boolean {
  return style.fontFamily != null && style.fontFamily.id === refId;
}

type Props = {
  fontFamilies: T.FontFamiliesMap;
  applyAction: T.ApplyAction;
  refs: T.Refs;
};

export default function FontFamilies({
  fontFamilies,
  applyAction,
  refs
}: Props) {
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
    "fontFamilies",
    "Font family",
    fontFamilies,
    applyAction,
    [valueEntry],
    fontFamily => {
      valueEntry.setValue(fontFamily.value);
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
        <h2 css={subHeading}>Font family</h2>
        <RefActions {...refActionsProps} />
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
            isSelected={selectedRefId === entry[0]}
            onClick={() => selectRef(entry[0])}
          >
            <div css={{ fontFamily: entry[1].value, margin: "12px" }}>
              {entry[1].value}
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
        title="Add font-family"
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
