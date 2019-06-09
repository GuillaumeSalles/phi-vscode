/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { row, column, heading } from "../styles";
import ModalButton from "../primitives/ModalButton";

type Props = {
  title: string;
  onAdd: () => void;
  onCancel: () => void;
  form: React.ReactNode;
};

function AddModal({ onAdd, onCancel, title, form }: Props) {
  return (
    <div
      css={[
        column,
        {
          boxShadow: "rgba(0, 0, 0, 0.12) 0px 20px 30px 0px;",
          background: "white",
          borderRadius: "8px",
          overflow: "hidden"
        }
      ]}
    >
      <header
        css={[
          column,
          {
            padding: "30px 45px"
          }
        ]}
      >
        <h1 css={[heading, { alignSelf: "center" }]}>{title}</h1>
        {form}
      </header>

      <div css={[row, { borderTop: "1px solid rgb(234, 234, 234)" }]}>
        <ModalButton text="cancel" onClick={onCancel} />
        <ModalButton text="Add" onClick={onAdd} />
      </div>
    </div>
  );
}

export default AddModal;
