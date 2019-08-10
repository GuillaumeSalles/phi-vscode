/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { row, column, colors } from "../styles";
import Modal from "./Modal";
import { useToggle } from "../hooks";

export function useOkCancelModal() {
  const toggle = useToggle(false);
  return {
    isOpen: toggle.isActive,
    open: toggle.activate,
    close: toggle.deactivate
  };
}

type Props = {
  isOpen: boolean;
  title: string;
  description?: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
  form: React.ReactNode;
  buttons: React.ReactNode;
};

export default function OkCancelModal({
  isOpen,
  onKeyDown,
  title,
  description,
  form,
  buttons
}: Props) {
  return (
    <Modal isOpen={isOpen}>
      <div
        onKeyDown={onKeyDown}
        css={[
          column,
          {
            boxShadow: "rgba(0, 0, 0, 0.12) 0px 20px 30px 0px;",
            background: colors.sideBarBackground,
            borderRadius: "0 0 4px 4px",
            overflow: "hidden",
            padding: "24px",
            width: "400px"
          }
        ]}
      >
        <header css={[column]}>
          <h1
            css={{
              fontSize: "14px",
              fontWeight: "normal",
              margin: "0 0 8px 0",
              color: "#333333"
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              css={{
                color: "rgb(102, 102, 102)",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "24px",
                margin: "8px 0"
              }}
            >
              {description}
            </p>
          )}
          {form}
        </header>

        <div
          css={[
            row,
            {
              margin: "8px 0 0 0",
              justifyContent: "flex-end"
            }
          ]}
        >
          {buttons}
        </div>
      </div>
    </Modal>
  );
}
