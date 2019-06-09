/** @jsx jsx */
import { css } from "@emotion/core";

export const column = css({
  display: "flex",
  flexDirection: "column"
});

export const row = css({
  display: "flex",
  flexDirection: "row"
});

export const mainPadding = css({
  padding: "40px 0 40px 40px"
});

export const heading = css({
  margin: "0",
  fontWeight: 400,
  fontSize: "24px"
});

export const primaryButton = css({
  borderRadius: "5px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "rgb(0, 0, 0)",
  transition: "all 0.2s ease 0s",
  fontWeight: 500,
  fontSize: "12px",
  flexShrink: 0,
  color: "rgb(255, 255, 255)",
  backgroundColor: "rgb(0, 0, 0)",
  padding: "0px 10px",
  minWidth: "100px",
  height: "24px",
  lineHeight: "22px",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "flex-start"
});

export const input = css({
  boxShadow: "none",
  boxSizing: "border-box",
  display: "block",
  fontSize: "14px",
  lineHeight: "27px",
  width: "100%",
  color: "inherit",
  backgroundColor: "transparent",
  caretColor: "rgb(0, 0, 0)",
  borderRadius: "0px",
  borderWidth: "initial",
  borderStyle: "none",
  borderColor: "initial",
  borderImage: "initial",
  outline: "0px"
});
