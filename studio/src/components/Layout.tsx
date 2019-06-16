/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { row, column } from "../styles";

type Props = {
  left: React.ReactNode;
  center: React.ReactNode;
  right?: React.ReactNode;
  topBar?: React.ReactNode;
};

export function Layout({ left, center, right, topBar }: Props) {
  return (
    <div css={[row, { width: "100%", height: "100%" }]}>
      <div css={{ flex: "0 0 auto", background: "white", height: "100%" }}>
        {left}
      </div>
      <div
        css={{
          position: "relative",
          flex: "1 1 auto",
          background: "#F7F7F7",
          height: "100%",
          width: "100%",
          overflowX: "auto"
        }}
      >
        <div
          css={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "32px",
            background: "#F7F7F7CC"
          }}
        >
          {topBar}
        </div>
        <div
          css={{
            height: "100%",
            overflowY: "auto"
          }}
        >
          {center}
        </div>
      </div>
      <div css={{ flex: "0 0 auto", background: "white", height: "100%" }}>
        {right}
      </div>
    </div>
  );
}
