/** @jsx jsx */
import { css } from "@emotion/core";

function setCssVariable(name: string, value: string) {
  document.documentElement.style.setProperty(name, value);
}

if ((window as any).__vscode__ == null) {
  document.documentElement.style.color = "#d4d4d4";
  document.documentElement.style.background = "#1e1e1e";

  setCssVariable("--vscode-icon-foreground", "#c5c5c5");
  setCssVariable("--vscode-foreground", "#cccccc");
  setCssVariable("--vscode-sideBarSectionHeader-background", "#80808033");
  setCssVariable("--vscode-sideBar-background", "#252526");
  setCssVariable("--vscode-editor-background", "#1e1e1e");
  setCssVariable("--vscode-button-foreground", "#ffffff");
  setCssVariable("--vscode-button-background", "#0e639c");
  setCssVariable("--vscode-button-hoverBackground", "#1177bb");
  setCssVariable("--vscode-input-background", "#3c3c3c");
  setCssVariable("--vscode-input-foreground", "#cccccc");
  setCssVariable("--vscode-input-border", "#5f7e97");
  setCssVariable("--vscode-inputOption-activeBorder", "#007acc00");
  setCssVariable("--vscode-input-placeholderForeground", "#a6a6a6");
  setCssVariable("--vscode-list-hoverBackground", "#2a2d2e");
  setCssVariable("--vscode-statusBar-background", "#007acc");
  setCssVariable("--vscode-activityBar-background", "#333333");
}

export const colors = {
  front: "white",
  iconColor: "var(--vscode-icon-foreground)",

  sideBarSectionHeaderBackground:
    "var(--vscode-sideBarSectionHeader-background)",
  sideBarSectionHeaderForeground: "var(--vscode-foreground)",

  sideBarForeground: "var(--vscode-foreground)",
  sideBarBackground: "var(--vscode-sideBar-background)",
  canvasBackground: "var(--vscode-editor-background)",

  primary: "var(--vscode-statusBar-background)",
  border: "#DDDDDD",

  buttonForeground: "var(--vscode-button-foreground)",
  buttonBackground: "var(--vscode-button-background)",
  buttonHoverBackground: "var(--vscode-button-hoverBackground)",

  secondaryButtonBackground: "var(--vscode-input-background)",
  secondaryButtonForeground: "var(--vscode-input-foreground)",

  inputBackground: "var(--vscode-input-background)",
  inputForeground: "var(--vscode-input-foreground)",
  inputBorder: "var(--vscode-input-border)",
  inputActiveBorder: "var(--vscode-inputOption-activeBorder)",
  inputPlaceholderForeground: "var(--vscode-input-placeholderForeground)",

  listHoverBackground: "var(--vscode-list-hoverBackground)",

  selectedCardBorder: "#0076FF",

  popupBackground: "var(--vscode-activityBar-background)",

  radioIconBackground: "var(--vscode-sideBarSectionHeader-background)",
  radioIconForeground: "var(--vscode-foreground)",

  radioIconActiveBackground: "var(--vscode-button-background)",
  radioIconActiveForeground: "var(--vscode-button-foreground)",

  seletableCardForeground: "black",

  topBarBackground: "var(--vscode-activityBar-background)",
};

export const fonts = {
  mono: `Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace`,
};

export const column = css({
  display: "flex",
  flexDirection: "column",
});

export const row = css({
  display: "flex",
  flexDirection: "row",
});

export const mainPadding = css({
  padding: "40px 0 40px 40px",
});

export const heading = css({
  margin: "0",
  fontWeight: 400,
  fontSize: "24px",
});

export const sectionTitle = css({
  margin: 0,
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "1.3px",
  fontWeight: 400,
  color: colors.sideBarSectionHeaderForeground,
});

export const separator = {
  margin: "4px 0",
  border: "none",
  borderTop: "solid 1px #DDD",
};

export const subHeading = css({
  margin: "0",
  fontWeight: 400,
  fontSize: "20px",
});

export const primaryButton = css({
  height: "32px",
  padding: "12px 16px",
  border: "none",
  borderRadius: "2px",
  lineHeight: "0px",
  fontSize: "14px",
  color: colors.buttonForeground,
  background: colors.buttonBackground,
  cursor: "pointer",
  whiteSpace: "nowrap",
  ":hover": {
    background: colors.buttonHoverBackground,
  },
  ":disabled": {
    cursor: "not-allowed",
  },
});

export const textInput = css({
  boxShadow: "none",
  boxSizing: "border-box",
  display: "block",
  fontSize: "14px",
  lineHeight: "27px",
  height: "28px",
  width: "100%",
  backgroundColor: colors.inputBackground,
  color: colors.inputForeground,
  caretColor: colors.inputForeground,
  border: "none",
  borderImage: "initial",
  transition: "border 0.2s ease 0s, color 0.2s ease 0s",
  padding: "4px 4px",
  ":focus": {
    outline: "1px solid -webkit-focus-ring-color",
    outlineOffset: "-1px",
  },
  "::-webkit-input-placeholder": {
    color: colors.inputPlaceholderForeground,
  },
});

export const styleEditorInput = css({
  WebkitAppearance: "none",
  borderStyle: "solid",
  borderWidth: "0 0 1px 0",
  borderColor: "transparent",
  height: "24px",
  fontSize: "12px",
  lineHeight: 0,
  padding: 0,
  boxSizing: "border-box",
  fontWeight: "bold",
  width: "36px",
  background: "none",
  color: colors.sideBarForeground,
  transition:
    "border 0.2s ease 0s, background 0.2s ease 0s, color 0.2s ease-out 0s",
  ":focus": {
    borderColor: colors.primary,
    outline: 0,
  },
});

export const checkboxInputLabel = css({
  WebkitAppearance: "none",
  height: "24px",
  fontSize: "12px",
  lineHeight: 0,
  padding: 0,
  boxSizing: "border-box",
  fontWeight: "bold",
  width: "36px",
  background: "none",
  color: colors.sideBarForeground,
  transition:
    "border 0.2s ease 0s, background 0.2s ease 0s, color 0.2s ease-out 0s",
  ":focus": {
    borderColor: colors.primary,
    outline: 0,
  },
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
  outline: "0px",
});

export const shadow1 = {
  boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 5px 0px",
};

export const selectableCard = css(
  {
    cursor: "pointer",
    background: "white",
    borderRadius: "2px",
    transition: "all 0.2s ease 0s",
    borderWidth: "2px",
    borderStyle: "solid",
    color: colors.seletableCardForeground,
    ":hover": {
      boxShadow: "rgba(0, 0, 0, 0.12) 0px 5px 10px 0px",
    },
  },
  shadow1
);

export const card = css({
  boxShadow: "rgba(0, 0, 0, 0.12) 0px 5px 10px 0px",
  background: "white",
  borderRadius: "2px",
  transition: "all 0.2s ease 0s",
});
