/** @jsx jsx */
import { jsx } from "@emotion/core";
import { column, mainPadding, heading, primaryButton } from "../styles";
import * as T from "../types";
import Component from "../Component";

type Props = {
  component: T.Component;
  refs: T.Refs;
};

function ComponentView({ component, refs }: Props) {
  return (
    <div css={[column, mainPadding]}>
      <h1 css={heading}>{component.name}</h1>
      <a css={primaryButton} href={`/components/${component.name}/edit`}>
        EDIT
      </a>
      <Component component={component} refs={refs} />
    </div>
  );
}

export default ComponentView;
