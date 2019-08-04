/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import Field from "../../../components/Field";
import ColorInput from "../../../components/ColorInput";
import Select from "../../../components/Select";
import { firstKey } from "../../../helpers/immutable-map";
import NumberInput from "../../../components/NumberInput";

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
