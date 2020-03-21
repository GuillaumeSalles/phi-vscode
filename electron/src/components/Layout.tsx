/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { row, colors, shadow1 } from "../styles";

type Props = {
  left: React.ReactNode;
  center: React.ReactNode;
  right?: React.ReactNode;
  topBar?: React.ReactNode;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
};

export function Layout({
  left,
  center,
  right,
  topBar,
  onKeyDown = () => {}
}: Props) {
  return (
    <div css={[row, { width: "100%", height: "100%" }]} onKeyDown={onKeyDown}>
      <div
        css={[
          {
            flex: "0 0 auto",
            background: colors.sideBarBackground,
            height: "100%",
            zIndex: 1
          },
          shadow1
        ]}
      >
        {left}
      </div>
      <div
        css={{
          position: "relative",
          flex: "1 1 auto",
          background: colors.canvasBackground,
          height: "100%",
          width: "100%",
          overflowX: "auto"
        }}
      >
        <div
          css={{
            height: "100%",
            overflowY: "auto"
          }}
        >
          {center}
        </div>
      </div>
      <div
        css={[
          {
            flex: "0 0 auto",
            background: colors.sideBarBackground,
            height: "100%",
            zIndex: 1
          },
          shadow1
        ]}
      >
        {right}
      </div>
    </div>
  );
}
