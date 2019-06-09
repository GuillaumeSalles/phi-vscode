/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../types";
import { column, subHeading, row } from "../../styles";
import SecondaryButton from "../../primitives/SecondaryButton";
import { useState } from "react";
import { del, set } from "../../helpers/immutable-map";
import SelectableCard from "../../primitives/SelectableCard";
import Modal from "../../Modal";
import AddFontSizeModal from "./AddFontSizeModal";

type Props = {
  items: T.FontSizesMap;
  onItemsChange: (items: T.FontSizesMap) => void;
};

export default function FontSizes({ items, onItemsChange }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  return (
    <React.Fragment>
      <div css={[row, { marginBottom: "20px" }]}>
        <h2 css={subHeading}>Font sizes</h2>
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
            {entry[0]} - {entry[1]}
          </div>
          <SelectableCard
            isSelected={selectedItem === entry[0]}
            onClick={() => setSelectedItem(entry[0])}
          >
            <div css={{ fontSize: entry[1], margin: "12px" }}>
              Saturn studio - closing the gap between developers and designers
            </div>
          </SelectableCard>
        </div>
      ))}
      <Modal isOpen={isModalOpen}>
        <AddFontSizeModal
          items={items}
          onAdd={(name, value) => {
            onItemsChange(set(items, name, value));
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </React.Fragment>
  );
}
