import * as T from "../../../types";
import { useState } from "react";

export default function useLayerStyleEditor<TStyle>(
  layer: T.Layer,
  setMediaQueries: (mediaQueries: Array<T.MediaQuery>) => void
) {
  const [mediaQuery, setMediaQuery] = useState("default");
  const isDefault = mediaQuery === "default";
  const style = isDefault
    ? layer.style
    : layer.mediaQueries.find(mq => mq.id === mediaQuery)!.style;
  return {
    style,
    mediaQuery,
    setMediaQuery,
    updateStyle: (newProps: Partial<TStyle>): Partial<T.Layer> => {
      return isDefault
        ? { style: { ...style, ...newProps } }
        : {
            mediaQueries: layer.mediaQueries.map(mq =>
              mq.id === mediaQuery
                ? {
                    ...mq,
                    style: { ...style, ...newProps }
                  }
                : mq
            )
          };
    },
    addMediaQuery: (id: string, breakpoint: T.Ref): void => {
      setMediaQueries([
        ...layer.mediaQueries,
        {
          id,
          minWidth: breakpoint,
          style: { ...layer.style }
        }
      ]);
      setMediaQuery(id);
    }
  };
}
