/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import Section from "./Section";
import Field from "../../../components/Field";
import Select from "../../../components/Select";
import { row } from "../../../styles";
import { listToEntries } from "../../../utils";
import {
  flexDirectionList,
  flexWrapList,
  justifyContentList,
  alignItemsList,
  alignContentList
} from "../../../constants";

type Props = {
  style: T.FlexContainerStyle;
  onChange: (style: T.FlexContainerStyle) => void;
};

const flexDirectionOptions = listToEntries(flexDirectionList);
const flexWrapOptions = listToEntries(flexWrapList);
const justifyContentOptions = listToEntries(justifyContentList);
const alignItemsOptions = listToEntries(alignItemsList);
const alignContentOptions = listToEntries(alignContentList);

export default function FlexContainerEditor({ style, onChange }: Props) {
  function updateStyle(newProps: Partial<T.FlexContainerStyle>) {
    onChange({ ...style, ...newProps });
  }
  return (
    <Section title="Flex Container">
      <div css={[row, { flexWrap: "wrap" }]}>
        <Field label="Direction">
          <Select
            value={style.flexDirection}
            onChange={flexDirection => updateStyle({ flexDirection })}
            options={flexDirectionOptions}
          />
        </Field>
        <Field label="Wrap">
          <Select
            value={style.flexWrap}
            onChange={flexWrap => updateStyle({ flexWrap })}
            options={flexWrapOptions}
          />
        </Field>
        <Field label="Justify Content">
          <Select
            value={style.justifyContent}
            onChange={justifyContent => updateStyle({ justifyContent })}
            options={justifyContentOptions}
          />
        </Field>
        <Field label="Align Items">
          <Select
            value={style.alignItems}
            onChange={alignItems => updateStyle({ alignItems })}
            options={alignItemsOptions}
          />
        </Field>
        <Field label="Align Content">
          <Select
            value={style.alignContent}
            onChange={alignContent => updateStyle({ alignContent })}
            options={alignContentOptions}
          />
        </Field>
      </div>
    </Section>
  );
}
