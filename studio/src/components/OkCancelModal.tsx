/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { row, column } from "../styles";
import Modal from "./Modal";
import { useToggle } from "../hooks";
import Button from "./Button";

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
  onOk?: () => void;
  onCancel?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
  form: React.ReactNode;
  buttons?: React.ReactNode;
};

const buttonCss = css({
  height: "32px",
  padding: "12px 16px",
  border: "none",
  borderRadius: "2px",
  marginLeft: "8px",
  lineHeight: "0px",
  fontSize: "14px"
});

export default function OkCancelModal({
  isOpen,
  onOk,
  onCancel,
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
            background: "#F9F9F9",
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
          {buttons ? (
            buttons
          ) : (
            <React.Fragment>
              <button
                css={[
                  buttonCss,
                  {
                    color: "#333333",
                    background: "#E8E8E8"
                  }
                ]}
                onClick={onCancel}
              >
                Cancel
              </button>
              <Button onClick={onOk} text="Add" />
            </React.Fragment>
          )}
        </div>
      </div>
    </Modal>
  );
}
