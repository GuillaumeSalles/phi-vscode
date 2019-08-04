/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../../types";
import { row } from "../../../styles";
import Field from "../../../components/Field";
import Select from "../../../components/Select";
import Section from "./Section";
import { listToEntries } from "../../../utils";
import {
  flexDirectionList,
  flexWrapList,
  justifyContentList,
  alignItemsList,
  alignContentList
} from "../../../constants";

type Props = {
  style: T.Display;
  onChange: (style: T.Display) => void;
  allowedDisplays: T.DisplayProperty[];
};

const flexDirectionOptions = listToEntries(flexDirectionList);
const flexWrapOptions = listToEntries(flexWrapList);
const justifyContentOptions = listToEntries(justifyContentList);
const alignItemsOptions = listToEntries(alignItemsList);
const alignContentOptions = listToEntries(alignContentList);

export default function DisplayEditor({
  style,
  onChange,
  allowedDisplays
}: Props) {
  function updateStyle(newProps: Partial<T.Display>) {
    onChange({ ...style, ...newProps });
  }

  return (
    <Section title="Layout">
      <div css={[row, { flexWrap: "wrap" }]}>
        <Field label="Display">
          <Select
            value={style.display || "inline"}
            onChange={display => updateStyle({ display })}
            options={listToEntries(allowedDisplays)}
          />
        </Field>
        {style.display === "flex" && (
          <React.Fragment>
            <Field label="Direction">
              <Select
                value={style.flexDirection || "row"}
                onChange={flexDirection => updateStyle({ flexDirection })}
                options={flexDirectionOptions}
              />
            </Field>
            <Field label="Wrap">
              <Select
                value={style.flexWrap || "nowrap"}
                onChange={flexWrap => updateStyle({ flexWrap })}
                options={flexWrapOptions}
              />
            </Field>
            <Field label="Justify Content">
              <Select
                value={style.justifyContent || "flex-start"}
                onChange={justifyContent => updateStyle({ justifyContent })}
                options={justifyContentOptions}
              />
            </Field>
            <Field label="Align Items">
              <Select
                value={style.alignItems || "stretch"}
                onChange={alignItems => updateStyle({ alignItems })}
                options={alignItemsOptions}
              />
            </Field>
            <Field label="Align Content">
              <Select
                value={style.alignContent || "stretch"}
                onChange={alignContent => updateStyle({ alignContent })}
                options={alignContentOptions}
              />
            </Field>
          </React.Fragment>
        )}
      </div>
    </Section>
  );
}
