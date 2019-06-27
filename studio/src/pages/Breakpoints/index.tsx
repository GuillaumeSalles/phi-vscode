/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { column, heading, row } from "../../styles";
import SecondaryButton from "../../components/SecondaryButton";
import { set, del } from "../../helpers/immutable-map";
import { useState } from "react";
import SelectableCard from "../../components/SelectableCard";
import { Layout } from "../../components/Layout";
import TopBar from "../../components/TopBar";
import OkCancelModal from "../../components/OkCancelModal";
import {
  useStringFormEntry,
  useNumberFormEntry,
  useDialogForm,
  FormInput,
  FormNumberInput
} from "../../components/Form";
import {
  validateBreakpointName,
  validateBreakpointValue
} from "../../validators";
import uuid from "uuid/v4";
import { px } from "../../factories";
import React from "react";
import Button from "../../components/Button";

type Props = {
  menu: React.ReactNode;
  refs: T.Refs;
  breakpoints: T.BreakpointsMap;
  onBreakpointsChange: (newBp: T.BreakpointsMap) => void;
};

function Breakpoints({ menu, refs, breakpoints, onBreakpointsChange }: Props) {
  const nameEntry = useStringFormEntry("", value =>
    validateBreakpointName(value, breakpoints)
  );
  const valueEntry = useNumberFormEntry(undefined, value =>
    validateBreakpointValue(value)
  );
  const createBreakpointDialog = useDialogForm([nameEntry, valueEntry], () =>
    onBreakpointsChange(
      set(breakpoints, uuid(), {
        name: nameEntry.value,
        value: px(valueEntry.value!)
      })
    )
  );
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<string | null>(
    null
  );
  return (
    <Layout
      topBar={<TopBar fileName={refs.fileName} isSaved={refs.isSaved} />}
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
            <div css={[row, { marginLeft: "28px" }]}>
              <SecondaryButton
                text="Add"
                onClick={createBreakpointDialog.open}
                margin="0 10px 0 0"
              />
              <SecondaryButton
                text="Delete"
                disabled={selectedBreakpoint === null}
                onClick={() => {
                  onBreakpointsChange(del(breakpoints, selectedBreakpoint!));
                  setSelectedBreakpoint(null);
                }}
              />
            </div>
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
                  isSelected={b.id === selectedBreakpoint}
                  onClick={() => setSelectedBreakpoint(b.id)}
                  overrides={{
                    width: b.width.value + "px",
                    height: "48px",
                    marginBottom: "20px",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "16px",
                    color: "rgb(153, 153, 153)",
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
          <OkCancelModal
            title="Create new breakpoint"
            {...createBreakpointDialog.dialogProps}
            buttons={
              <React.Fragment>
                <SecondaryButton
                  text="Cancel"
                  {...createBreakpointDialog.cancelButtonProps}
                />
                <Button text="Add" {...createBreakpointDialog.okButtonProps} />
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
