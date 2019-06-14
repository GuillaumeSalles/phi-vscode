/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { column, heading, row } from "../../styles";
import SecondaryButton from "../../components/SecondaryButton";
import AddBreakpointsModal from "./AddBreakpointModal";
import { set, del } from "../../helpers/immutable-map";
import Modal from "../../Modal";
import { useState } from "react";
import SelectableCard from "../../components/SelectableCard";
import { Layout } from "../../components/Layout";
import Menu from "../../Menu";

type Props = {
  components: T.Component[];
  breakpoints: T.BreakpointsMap;
  onBreakpointsChange: (newBp: T.BreakpointsMap) => void;
};

function Breakpoints({ components, breakpoints, onBreakpointsChange }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<string | null>(
    null
  );
  return (
    <Layout
      left={<Menu components={components} />}
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
                onClick={() => {
                  setIsModalOpen(true);
                }}
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
              .map(e => ({ name: e[0], width: e[1] }))
              .sort((a, b) => a.width.value - b.width.value)
              .map(b => (
                <SelectableCard
                  key={b.name}
                  isSelected={b.name === selectedBreakpoint}
                  onClick={() => setSelectedBreakpoint(b.name)}
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
          <Modal isOpen={isModalOpen}>
            <AddBreakpointsModal
              breakpoints={breakpoints}
              onAdd={(name, value) => {
                onBreakpointsChange(set(breakpoints, name, value));
                setIsModalOpen(false);
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </Modal>
        </div>
      }
    />
  );
}

export default Breakpoints;
