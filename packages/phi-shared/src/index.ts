import ts from "typescript";

export function tsNodesToString(nodes: ReadonlyArray<ts.Node>) {
  const resultFile = ts.createSourceFile(
    "someFileName.ts",
    "",
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS
  );

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });

  return printer.printList(
    ts.ListFormat.MultiLine | ts.ListFormat.PreferNewLine,
    ts.createNodeArray(nodes),
    resultFile
  );
}

export * from "./jsx";
export * from "./css";
export * from "./utils";
export * from "./types";
