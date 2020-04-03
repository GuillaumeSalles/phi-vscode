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
import RadioIconGroup from "../../../components/RadioIconGroup";
import { row } from "../../../styles";
import LengthInput from "../../../components/LengthInput";
import { memo } from "react";

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

type NewProps<T> = {
  value: T;
  onChange: (partialStyle: T.LayerStyle) => void;
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

export function InnerPositionPropertyEditor({ style, onChange }: Props) {
  return (
    <div css={row}>
      <RadioIconGroup
        name="text-align"
        options={[
          ["relative", () => <span>Relative</span>],
          ["absolute", () => <span>Absolute</span>]
        ]}
        value={style.position == null ? "relative" : style.position}
        onChange={position => onChange({ position })}
      />
    </div>
  );
}

export function PositionPropertyEditor({ style, onChange }: Props) {
  return (
    <Field label="Position">
      <InnerPositionPropertyEditor style={style} onChange={onChange} />
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

export const FlexDirectionEditor = memo(
  ({ value, onChange }: NewProps<T.FlexDirection | undefined>) => {
    return (
      <Field label="Direction">
        <Select
          value={value || "row"}
          onChange={flexDirection => onChange({ flexDirection })}
          options={flexDirectionOptions}
        />
      </Field>
    );
  }
);

export const FlexWrapEditor = memo(
  ({ value, onChange }: NewProps<T.FlexWrap | undefined>) => {
    return (
      <Field label="Wrap">
        <Select
          value={value || "nowrap"}
          onChange={flexWrap => onChange({ flexWrap })}
          options={flexWrapOptions}
        />
      </Field>
    );
  }
);

export const JustifyContentEditor = memo(
  ({ value, onChange }: NewProps<T.JustifyContent | undefined>) => {
    return (
      <Field label="Justify Content">
        <Select
          value={value || "flex-start"}
          onChange={justifyContent => onChange({ justifyContent })}
          options={justifyContentOptions}
        />
      </Field>
    );
  }
);

export const AlignItemsEditor = memo(
  ({ value, onChange }: NewProps<T.AlignItems | undefined>) => {
    return (
      <Field label="Align Items">
        <Select
          value={value || "stretch"}
          onChange={alignItems => onChange({ alignItems })}
          options={alignItemsOptions}
        />
      </Field>
    );
  }
);

export const AlignContentEditor = memo(
  ({ value, onChange }: NewProps<T.AlignContent | undefined>) => {
    return (
      <Field label="Align Content">
        <Select
          value={value || "stretch"}
          onChange={alignContent => onChange({ alignContent })}
          options={alignContentOptions}
        />
      </Field>
    );
  }
);

export function BorderWidthEditor({ style, onChange, label }: Props & Label) {
  return (
    <Field label={label}>
      <LengthInput
        value={style.borderTopWidth}
        onChange={borderWidth =>
          onChange({
            borderTopWidth: borderWidth,
            borderRightWidth: borderWidth,
            borderBottomWidth: borderWidth,
            borderLeftWidth: borderWidth
          })
        }
        onlyPositive={true}
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

function debugMemo(prev: any, next: any) {
  for (const key in prev) {
    if (prev[key] !== next[key]) {
      console.log(`Memo failed because of ${key}`, prev, next);
      return false;
    }
  }

  return true;
}

export const LengthPropertyEditor = memo(
  ({
    value,
    onChange,
    property,
    label,
    onlyPositive
  }: {
    property: keyof T.LayerStyle;
    label: string;
    onlyPositive: boolean;
    onChange: (partialStyle: Partial<T.LayerStyle>) => void;
    value: string | undefined;
  }) => {
    return (
      <Field label={label}>
        <LengthInput
          onlyPositive={onlyPositive}
          value={value}
          onChange={value => onChange({ [property]: value })}
        />
      </Field>
    );
  },
  debugMemo
);

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
