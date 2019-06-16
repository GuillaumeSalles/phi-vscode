/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
import { row, column, heading } from "../styles";
import ModalButton from "./ModalButton";
import Modal from "./Modal";
import { useToggle } from "../hooks";

type Props = {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  onAdd: () => void;
  onCancel: () => void;
  form: React.ReactNode;
};

export function useOkCancelModal() {
  const toggle = useToggle(false);
  return {
    isOpen: toggle.isActive,
    open: toggle.activate,
    close: toggle.deactivate
  };
}

function AddModal({
  isOpen,
  onAdd,
  onCancel,
  title,
  description,
  form
}: Props) {
  return (
    <Modal isOpen={isOpen}>
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
          <p
            css={{
              color: "rgb(102, 102, 102)",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "24px"
            }}
          >
            {description}
          </p>
          {form}
        </header>

        <div css={[row, { borderTop: "1px solid rgb(234, 234, 234)" }]}>
          <ModalButton text="cancel" onClick={onCancel} />
          <ModalButton text="Add" onClick={onAdd} />
        </div>
      </div>
    </Modal>
  );
}

export default AddModal;
