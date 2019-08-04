/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import Field from "../../../components/Field";
import ColorInput from "../../../components/ColorInput";
import Select from "../../../components/Select";
import { firstKey } from "../../../helpers/immutable-map";
import NumberInput from "../../../components/NumberInput";
import { listToEntries } from "../../../utils";
import {
  flexDirectionList,
  flexWrapList,
  justifyContentList,
  alignItemsList,
  alignContentList
} from "../../../constants";
import TextInput from "../../../components/TextInput";

const flexDirectionOptions = listToEntries(flexDirectionList);
const flexWrapOptions = listToEntries(flexWrapList);
const justifyContentOptions = listToEntries(justifyContentList);
const alignItemsOptions = listToEntries(alignItemsList);
const alignContentOptions = listToEntries(alignContentList);

type Props = {
  style: T.LayerStyle;
  onChange: (partialStyle: T.LayerStyle) => void;
};

type PropsWithRefs = Props & {
  refs: T.Refs;
};

export function ColorEditor({ style, onChange, refs }: PropsWithRefs) {
  return (
    <Field label="Color">
      <ColorInput
        colors={refs.colors}
        value={style.color}
        onChange={value => onChange({ color: value })}
      />
    </Field>
  );
}

export function FontSizeEditor({ style, onChange, refs }: PropsWithRefs) {
  return (
    <Field label="Font size">
      <Select
        value={
          style.fontSize != null ? style.fontSize.id : firstKey(refs.fontSizes)
        }
        onChange={value => onChange({ fontSize: { type: "ref", id: value } })}
        options={Array.from(refs.fontSizes.entries()).map(entry => [
          entry[0],
          entry[1].name
        ])}
      />
    </Field>
  );
}

export function FontFamilyEditor({ style, onChange, refs }: PropsWithRefs) {
  return (
    <Field label="Font family">
      <Select
        value={
          style.fontFamily != null
            ? style.fontFamily.id
            : firstKey(refs.fontFamilies)
        }
        onChange={value => onChange({ fontFamily: { type: "ref", id: value } })}
        options={Array.from(refs.fontFamilies.entries()).map(entry => [
          entry[0],
          entry[1].name
        ])}
      />
    </Field>
  );
}

export function FontWeightEditor({ style, onChange, refs }: PropsWithRefs) {
  return (
    <Field label="Font weight">
      <Select
        value={
          style.fontWeight != null
            ? style.fontWeight.id
            : firstKey(refs.fontWeights)
        }
        onChange={value => onChange({ fontWeight: { type: "ref", id: value } })}
        options={Array.from(refs.fontWeights.entries()).map(entry => [
          entry[0],
          entry[1].name
        ])}
      />
    </Field>
  );
}

export function LineHeightEditor({ style, onChange }: Props) {
  return (
    <Field label="Line">
      <NumberInput
        value={style.lineHeight != null ? style.lineHeight : 1.2}
        onChange={lineHeight =>
          onChange({
            lineHeight: lineHeight === null ? 1.2 : lineHeight
          })
        }
      />
    </Field>
  );
}

export function LetterSpacingEditor({ style, onChange }: Props) {
  return (
    <Field label="Letter">
      <NumberInput
        step={0.5}
        value={style.letterSpacing != null ? style.letterSpacing.value : 0}
        onChange={value =>
          onChange({
            letterSpacing: value !== null ? { type: "px", value } : undefined
          })
        }
      />
    </Field>
  );
}

export function DisplayEditor({
  style,
  onChange,
  allowedDisplays
}: Props & {
  allowedDisplays: T.DisplayProperty[];
}) {
  return (
    <Field label="Display">
      <Select
        value={style.display || "inline"}
        onChange={display => onChange({ display })}
        options={listToEntries(allowedDisplays)}
      />
    </Field>
  );
}

export function FlexDirectionEditor({ style, onChange }: Props) {
  return (
    <Field label="Direction">
      <Select
        value={style.flexDirection || "row"}
        onChange={flexDirection => onChange({ flexDirection })}
        options={flexDirectionOptions}
      />
    </Field>
  );
}

export function FlexWrapEditor({ style, onChange }: Props) {
  return (
    <Field label="Wrap">
      <Select
        value={style.flexWrap || "nowrap"}
        onChange={flexWrap => onChange({ flexWrap })}
        options={flexWrapOptions}
      />
    </Field>
  );
}

export function JustifyContentEditor({ style, onChange }: Props) {
  return (
    <Field label="Justify Content">
      <Select
        value={style.justifyContent || "flex-start"}
        onChange={justifyContent => onChange({ justifyContent })}
        options={justifyContentOptions}
      />
    </Field>
  );
}

export function AlignItemsEditor({ style, onChange }: Props) {
  return (
    <Field label="Align Items">
      <Select
        value={style.alignItems || "stretch"}
        onChange={alignItems => onChange({ alignItems })}
        options={alignItemsOptions}
      />
    </Field>
  );
}

export function AlignContentEditor({ style, onChange }: Props) {
  return (
    <Field label="Align Content">
      <Select
        value={style.alignContent || "stretch"}
        onChange={alignContent => onChange({ alignContent })}
        options={alignContentOptions}
      />
    </Field>
  );
}

export function SimpleTextPropertyEditor({
  style,
  onChange,
  property,
  label
}: Props & {
  property: keyof T.LayerStyle;
  label: string;
}) {
  return (
    <Field label={label}>
      <TextInput
        value={style[property] != null ? (style[property] as string) : ""}
        onChange={value => onChange({ [property]: value })}
      />
    </Field>
  );
}
