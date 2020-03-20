/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { useRef } from "react";
import Popover from "../../components/Popover";
import { card, row } from "../../styles";
import { useToggle } from "../../hooks";
import IconButton from "../../components/IconButton";
import { Settings } from "../../icons";
import {
  useStringFormEntry,
  useDialogForm,
  FormInput
} from "../../components/Form";
import { validateRefName } from "../../validators";
import OkCancelModal from "../../components/OkCancelModal";
import React from "react";
import SecondaryButton from "../../components/SecondaryButton";
import Button from "../../components/Button";

type Props = {
  refs: T.Refs;
  applyAction: T.ApplyAction;
};

export default function SettingsEditor({ refs, applyAction }: Props) {
  const popover = useToggle(false);
  const ref = useRef<HTMLDivElement>(null);

  const nameEntry = useStringFormEntry("", value =>
    validateRefName(value, null, refs.components, "Artboard")
  );
  const widthEntry = useStringFormEntry("", value => undefined);
  const heightEntry = useStringFormEntry("", value => undefined);
  const backgroundColorEntry = useStringFormEntry("", value => undefined);
  const addArtboardDialog = useDialogForm(
    [nameEntry, widthEntry, heightEntry, backgroundColorEntry],
    () => {
      // applyAction({
      //   type: "renameComponent",
      //   componentId,
      //   name: nameEntry.value
      // });
    }
  );

  return (
    <div ref={ref}>
      <IconButton
        cssOverrides={{ margin: "8px" }}
        icon={<Settings height={24} width={24} />}
        onClick={popover.activate}
      />
      <Popover
        anchor={ref}
        isOpen={popover.isActive}
        onDismiss={popover.deactivate}
        position="bottom-right"
      >
        <div css={[card]}>
          <button
            onClick={addArtboardDialog.open}
            css={[
              row,
              {
                alignItems: "center",
                padding: "8px 16px",
                border: "none",
                width: "100%",
                fontSize: "14px",
                ":hover": {
                  backgroundColor: "#EAEAEA"
                }
              }
            ]}
          >
            <span css={{ marginLeft: "8px" }}>Add Artboard</span>
          </button>
        </div>
      </Popover>
      <OkCancelModal
        title="Create new artboard"
        {...addArtboardDialog.dialogProps}
        buttons={
          <React.Fragment>
            <SecondaryButton
              text="Cancel"
              {...addArtboardDialog.cancelButtonProps}
            />
            <Button text="Add" {...addArtboardDialog.okButtonProps} />
          </React.Fragment>
        }
        form={
          <React.Fragment>
            <FormInput
              placeholder="Name your artboard"
              {...nameEntry.inputProps}
            />
            <FormInput placeholder="Width" {...widthEntry.inputProps} />
            <FormInput placeholder="Height" {...heightEntry.inputProps} />
            <FormInput
              placeholder="Background Color"
              {...backgroundColorEntry.inputProps}
            />
          </React.Fragment>
        }
      />
    </div>
  );
}
