/** @jsx jsx */
import { jsx } from "@emotion/core";
import { column, leftMenuHeading } from "./styles";
import * as T from "./types";
import { Link } from "react-router-dom";
import { useRouter } from "./useRouter";

type Props = {
  components: T.ComponentMap;
};

function MenuItem({ href, text }: { href: string; text: string }) {
  const pathname = useRouter().location.pathname;
  const isSelected = pathname === href;
  return (
    <div
      css={{
        padding: "8px 8px 8px 24px",
        paddingLeft: isSelected ? "20px" : "24px",
        borderLeft: isSelected ? "4px solid black" : "none"
      }}
    >
      <Link
        to={href}
        css={{
          fontSize: "14px",
          color: "rgb(0, 0, 0)",
          boxSizing: "border-box",
          textDecoration: "none",
          fontWeight: isSelected ? 600 : 400,
          cursor: "pointer"
        }}
      >
        {text}
      </Link>
    </div>
  );
}

function Menu({ components }: Props) {
  return (
    <div
      css={[
        column,
        {
          paddingBottom: "24px",
          paddingTop: "24px",
          width: "240px"
        }
      ]}
    >
      <span css={leftMenuHeading}>Styles</span>
      <MenuItem href="/typography" text="Typography" />
      <MenuItem href="/colors" text="Colors" />
      <MenuItem href="/breakpoints" text="Breakpoints" />
      <span css={[leftMenuHeading, { marginTop: "40px" }]}>Components</span>
      {Array.from(components.entries()).map(entry => (
        <MenuItem
          key={entry[0]}
          href={`/components/${entry[0]}`}
          text={entry[1].name}
        />
      ))}
    </div>
  );
}

export default Menu;
