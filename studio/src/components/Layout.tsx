/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { row, colors, shadow1 } from "../styles";

type Props = {
  left: React.ReactNode;
  center: React.ReactNode;
  right?: React.ReactNode;
  topBar?: React.ReactNode;
};

export function Layout({ left, center, right, topBar }: Props) {
  return (
    <div css={[row, { width: "100%", height: "100%" }]}>
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
        {(window as any).__MODE__ != "VSCODE" && (
          <div
            css={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "32px"
            }}
          >
            {topBar}
          </div>
        )}
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
