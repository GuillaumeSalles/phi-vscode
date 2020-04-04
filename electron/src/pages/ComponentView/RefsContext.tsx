import React, { useMemo, useContext } from "react";
import * as T from "../../types";

const RefsContext = React.createContext<T.Refs | null>(null);

export function RefsProvider({
  refs,
  children,
}: {
  refs: T.Refs;
  children: React.ReactNode;
}) {
  /**
   * Create a reference to refs that is invalidated when breakoints, colors, fontSize or fontFamilies change
   * Only used for performance reason
   */
  const memoizedRefs = useMemo<T.Refs>(() => {
    return refs;
  }, [refs.breakpoints, refs.colors, refs.fontSizes, refs.fontFamilies]);

  return (
    <RefsContext.Provider value={memoizedRefs}>{children}</RefsContext.Provider>
  );
}

export function useRefs() {
  return useContext(RefsContext)!;
}
