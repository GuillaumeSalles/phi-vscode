/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root")!;

type Props = {
  isOpen: boolean;
  children: any;
};

function Modal({ isOpen, children }: Props) {
  if (!isOpen) {
    modalRoot.style.display = "none";
    return null;
  }

  modalRoot.style.display = "inline";
  return ReactDOM.createPortal(
    <div
      css={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center"
      }}
    >
      <div
        css={{
          backgroundColor: "rgb(0, 0, 0)",
          bottom: "0px",
          height: "100%",
          left: "0px",
          opacity: 0.25,
          pointerEvents: "all",
          position: "fixed",
          top: "0px",
          width: "100%",
          zIndex: -1,
          transition: "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0s"
        }}
      />
      {children}
    </div>,
    modalRoot
  );
}

export default Modal;
