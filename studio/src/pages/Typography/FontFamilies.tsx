/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../types";
import { column, subHeading, row } from "../../styles";
import SecondaryButton from "../../components/SecondaryButton";
import { useState } from "react";
import { del, set } from "../../helpers/immutable-map";
import SelectableCard from "../../components/SelectableCard";
import Modal from "../../Modal";
import AddFontFamilyModal from "./AddFontFamilyModal";

type Props = {
  fontFamilies: T.FontFamiliesMap;
  onFontFamiliesChange: (fontFamilies: T.FontFamiliesMap) => void;
};

export default function FontFamilies({
  fontFamilies,
  onFontFamiliesChange
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  return (
    <React.Fragment>
      <div css={[row, { marginBottom: "20px" }]}>
        <h2 css={subHeading}>Font family</h2>
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
              onFontFamiliesChange(del(fontFamilies, selectedItem!));
              setSelectedItem(null);
            }}
          />
        </div>
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
            {entry[0]}
          </div>
          <SelectableCard
            isSelected={selectedItem === entry[0]}
            onClick={() => setSelectedItem(entry[0])}
          >
            <div css={{ fontFamily: entry[1], margin: "12px" }}>{entry[1]}</div>
          </SelectableCard>
        </div>
      ))}
      <Modal isOpen={isModalOpen}>
        <AddFontFamilyModal
          fontFamilies={fontFamilies}
          onAdd={(name, value) => {
            onFontFamiliesChange(set(fontFamilies, name, value));
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </React.Fragment>
  );
}
