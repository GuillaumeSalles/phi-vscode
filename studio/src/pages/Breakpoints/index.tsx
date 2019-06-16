/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { column, heading, row } from "../../styles";
import SecondaryButton from "../../components/SecondaryButton";
import AddBreakpointsModal from "./AddBreakpointModal";
import { set, del } from "../../helpers/immutable-map";
import { useState } from "react";
import SelectableCard from "../../components/SelectableCard";
import { Layout } from "../../components/Layout";
import Menu from "../../components/Menu";
import TopBar from "../../components/TopBar";
import { useOkCancelModal } from "../../components/AddModal";

type Props = {
  refs: T.Refs;
  breakpoints: T.BreakpointsMap;
  onBreakpointsChange: (newBp: T.BreakpointsMap) => void;
};

function Breakpoints({ refs, breakpoints, onBreakpointsChange }: Props) {
  const modal = useOkCancelModal();
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<string | null>(
    null
  );
  return (
    <Layout
      topBar={<TopBar fileName={refs.fileName} isSaved={refs.isSaved} />}
      left={<Menu components={refs.components} />}
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
                onClick={modal.open}
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
          <AddBreakpointsModal
            isOpen={modal.isOpen}
            breakpoints={breakpoints}
            onAdd={(id, value) => {
              onBreakpointsChange(set(breakpoints, id, value));
              modal.close();
            }}
            onCancel={modal.close}
          />
        </div>
      }
    />
  );
}

export default Breakpoints;
