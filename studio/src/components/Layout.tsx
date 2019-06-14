/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { row } from "../styles";

type Props = {
  left: React.ReactNode;
  center: React.ReactNode;
  right?: React.ReactNode;
};

export function Layout({ left, center, right }: Props) {
  return (
    <div css={[row, { width: "100%", height: "100%" }]}>
      <div css={{ flex: "0 0 auto", background: "white", height: "100%" }}>
        {left}
      </div>
      <div
        css={{
          flex: "1 1 auto",
          background: "#F7F7F7",
          height: "100%",
          overflowY: "auto"
        }}
      >
        {center}
      </div>
      <div css={{ flex: "0 0 auto", background: "white", height: "100%" }}>
        {right}
      </div>
    </div>
  );
}
