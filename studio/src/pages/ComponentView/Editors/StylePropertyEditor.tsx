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
  alignContentList,
  borderStyleList
} from "../../../constants";
import TextInput from "../../../components/TextInput";

const flexDirectionOptions = listToEntries(flexDirectionList);
const flexWrapOptions = listToEntries(flexWrapList);
const justifyContentOptions = listToEntries(justifyContentList);
const alignItemsOptions = listToEntries(alignItemsList);
const alignContentOptions = listToEntries(alignContentList);
const borderStyleOptions = listToEntries(borderStyleList);

type Props = {
  style: T.LayerStyle;
  onChange: (partialStyle: T.LayerStyle) => void;
};

type PropsWithRefs = Props & {
  refs: T.Refs;
};

type Label = {
  label: string;
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

export function BackgroundColorEditor({
  style,
  onChange,
  refs
}: PropsWithRefs) {
  return (
    <Field label="Background Color">
      <ColorInput
        colors={refs.colors}
        value={style.backgroundColor}
        onChange={value => onChange({ backgroundColor: value })}
      />
    </Field>
  );
}

export function OpacityEditor({ style, onChange }: Props) {
  return (
    <Field label="Opacity">
      <NumberInput
        min={0}
        max={1}
        step={0.01}
        value={style.opacity != null ? style.opacity : 1}
        onChange={opacity =>
          onChange({ opacity: opacity != null ? opacity : 1 })
        }
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

export function FontWeightEditor({ style, onChange }: Props) {
  return (
    <SimpleTextPropertyEditor
      label="Font weight"
      style={style}
      onChange={onChange}
      property="fontWeight"
    />
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

export function BorderWidthEditor({ style, onChange, label }: Props & Label) {
  return (
    <Field label={label}>
      <TextInput
        value={style.borderTopWidth}
        onChange={borderWidth =>
          onChange({
            borderTopWidth: borderWidth,
            borderRightWidth: borderWidth,
            borderBottomWidth: borderWidth,
            borderLeftWidth: borderWidth
          })
        }
      />
    </Field>
  );
}

export function BorderColorEditor({
  style,
  onChange,
  refs,
  label
}: PropsWithRefs & Label) {
  return (
    <Field label={label}>
      <ColorInput
        colors={refs.colors}
        value={style.borderTopColor}
        onChange={color =>
          onChange({
            borderTopColor: color,
            borderRightColor: color,
            borderBottomColor: color,
            borderLeftColor: color
          })
        }
      />
    </Field>
  );
}

export function BorderStyleEditor({ style, onChange, label }: Props & Label) {
  return (
    <Field label={label}>
      <Select
        value={style.borderTopStyle || "none"}
        options={borderStyleOptions}
        onChange={style =>
          onChange({
            borderTopStyle: style,
            borderRightStyle: style,
            borderBottomStyle: style,
            borderLeftStyle: style
          })
        }
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
