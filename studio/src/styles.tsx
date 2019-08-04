/** @jsx jsx */
import { css } from "@emotion/core";

export const colors = {
  front: "white",
  sideBarBackground: "#FAFAFA",
  canvasBackground: "#F0F0F0",
  primary: "#0076FF",
  border: "#DDDDDD"
};

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

export const sectionTitle = css({
  margin: 0,
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "1.3px",
  fontWeight: 400,
  color: "rgb(136, 136, 136)"
});

export const separator = {
  margin: "4px 0",
  border: "none",
  borderTop: "solid 1px #DDD"
};

export const subHeading = css({
  margin: "0",
  fontWeight: 400,
  fontSize: "20px"
});

export const primaryButton = css({
  height: "32px",
  padding: "12px 16px",
  border: "none",
  borderRadius: "2px",
  lineHeight: "0px",
  fontSize: "14px",
  color: "white",
  background: colors.primary,
  ":disabled": {
    cursor: "not-allowed"
  }
});

export const secondaryButton = css({
  height: "32px",
  padding: "12px 16px",
  border: "none",
  borderRadius: "2px",
  lineHeight: "0px",
  fontSize: "14px",
  color: "#333333",
  background: "#E8E8E8",
  ":disabled": {
    cursor: "not-allowed"
  }
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

export const selectableCard = css({
  boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 5px 0px",
  cursor: "pointer",
  background: "white",
  borderRadius: "2px",
  transition: "all 0.2s ease 0s",
  borderWidth: "2px",
  borderStyle: "solid",
  ":hover": {
    boxShadow: "rgba(0, 0, 0, 0.12) 0px 5px 10px 0px"
  }
});

export const card = css({
  boxShadow: "rgba(0, 0, 0, 0.12) 0px 5px 10px 0px",
  background: "white",
  borderRadius: "2px",
  transition: "all 0.2s ease 0s"
});
