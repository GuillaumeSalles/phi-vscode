/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { column, heading, row } from "../../styles";
import SecondaryButton from "../../components/SecondaryButton";
import SelectableCard from "../../components/SelectableCard";
import { Layout } from "../../components/Layout";
import OkCancelModal from "../../components/OkCancelModal";
import {
  useNumberFormEntry,
  FormInput,
  FormNumberInput
} from "../../components/Form";
import { validateBreakpointValue } from "../../validators";
import { px } from "../../factories";
import React from "react";
import Button from "../../components/Button";
import RefActions from "../../components/RefActions";
import { useRefManagement } from "../../hooks";

type Props = {
  menu: React.ReactNode;
  refs: T.Refs;
  breakpoints: T.BreakpointsMap;
  applyAction: T.ApplyAction;
};

function Breakpoints({ menu, refs, breakpoints, applyAction }: Props) {
  const valueEntry = useNumberFormEntry(undefined, value =>
    validateBreakpointValue(value)
  );
  const {
    nameEntry,
    selectedRefId,
    selectRef,
    isEditing,
    dialog,
    refActionsProps,
    deleteRefDialogProps,
    closeDeleteRefDialogProps
  } = useRefManagement(
    "breakpoints",
    "Breakpoint",
    breakpoints,
    applyAction,
    [valueEntry],
    breakpoint => {
      valueEntry.setValue(breakpoint.value.value);
    },
    name => ({
      name,
      value: px(valueEntry.value!)
    }),
    (layer, refId) =>
      layer.mediaQueries.some((mq: T.MediaQuery) => mq.minWidth.id === refId),
    refs.components
  );
  return (
    <Layout
      left={menu}
      center={
        <div css={[column]}>
          <div
            css={[
              row,
              { margin: "40px 40px 20px 40px", alignItems: "flex-end" }
            ]}
          >
            <h1 css={heading}>Breakpoints</h1>
            <RefActions {...refActionsProps} />
          </div>
          <div
            css={{
              display: "flex",
              flexDirection: "column",
              overflowX: "auto",
              padding: "0px 40px 20px 40px"
            }}
          >
            {Array.from(breakpoints.entries())
              .map(e => ({ id: e[0], name: e[1].name, width: e[1].value }))
              .sort((a, b) => a.width.value - b.width.value)
              .map(b => (
                <SelectableCard
                  key={b.id}
                  isSelected={b.id === selectedRefId}
                  onClick={() => selectRef(b.id)}
                  overrides={{
                    width: b.width.value + "px",
                    height: "48px",
                    marginBottom: "20px",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "16px",
                    display: "flex",
                    padding: "0 10px",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <span>
                    {b.name} - {b.width.value}px
                  </span>
                  <span>
                    {b.name} - {b.width.value}px
                  </span>
                </SelectableCard>
              ))}
          </div>
          {selectedRefId && (
            <OkCancelModal
              {...deleteRefDialogProps}
              buttons={<Button text="Ok" {...closeDeleteRefDialogProps} />}
            />
          )}
          <OkCancelModal
            title={isEditing ? "Edit breakpoint" : "Add new breakpoint"}
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
                  placeholder="Name your breakpoint"
                  {...nameEntry.inputProps}
                />
                <FormNumberInput
                  placeholder="Enter breakpoint width in pixels"
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

export default Breakpoints;
