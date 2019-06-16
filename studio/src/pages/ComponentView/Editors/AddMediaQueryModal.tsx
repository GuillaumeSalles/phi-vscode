/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
import uuid from "uuid/v4";
import * as T from "../../../types";
import AddModal from "../../../components/AddModal";
import Select from "../../../components/Select";

type Props<TStyle> = {
  onAdd: (id: string, breakpoint: T.Ref) => void;
  onCancel: () => void;
  refs: T.Refs;
  existingMediaQueries: T.MediaQuery<TStyle>[];
};

function breakpointEntryToOption(
  entry: [string, T.BreakpointDefinition]
): [string, string] {
  return [entry[0], `@media (min-width: ${entry[1].name})`];
}

export default function AddMediaQueryModal<TStyle>({
  onAdd,
  onCancel,
  existingMediaQueries,
  refs
}: Props<TStyle>) {
  const existing = new Set(existingMediaQueries.map(m => m.minWidth.id));
  const options = Array.from(refs.breakpoints.entries())
    .filter(entry => !existing.has(entry[0]))
    .map(breakpointEntryToOption);
  const [selectedItem, setSelectedItem] = useState(options[0][0]);
  return (
    <AddModal
      title="Add new media query"
      onAdd={() => onAdd(uuid(), { type: "ref", id: selectedItem })}
      onCancel={onCancel}
      form={
        <React.Fragment>
          <p
            css={{
              color: "rgb(102, 102, 102)",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "24px"
            }}
          >
            Select a breakpoint that has not been used before on this layer.
          </p>
          <Select
            width="100%"
            options={options}
            value={selectedItem}
            onChange={setSelectedItem}
          />
        </React.Fragment>
      }
    />
  );
}
