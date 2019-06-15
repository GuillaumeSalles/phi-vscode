import ts from "typescript";

function tsNodesToString(nodes: ReadonlyArray<ts.Node>) {
  const resultFile = ts.createSourceFile(
    "someFileName.ts",
    "",
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS
  );

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed
  });

  return printer.printList(
    ts.ListFormat.MultiLine | ts.ListFormat.PreferNewLine,
    ts.createNodeArray(nodes),
    resultFile
  );
}

function createFunctionalComponent(component: any) {
  return ts.createFunctionDeclaration(
    undefined,
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    component.name,
    undefined,
    [],
    undefined,
    ts.createBlock([
      ts.createReturn(
        createSimpleJsxElement(component.layout.tag, [
          ts.createJsxAttribute(
            ts.createIdentifier("children"),
            ts.createJsxExpression(
              undefined,
              ts.createStringLiteral(component.layout.text)
            )
          )
        ])
      )
    ])
  );
}

function createSimpleJsxElement(
  name: string,
  properties: ReadonlyArray<ts.JsxAttributeLike>,
  children: ReadonlyArray<ts.JsxChild> = []
) {
  return ts.createJsxElement(
    ts.createJsxOpeningElement(
      ts.createIdentifier(name),
      undefined,
      ts.createJsxAttributes(properties)
    ),
    children,
    ts.createJsxClosingElement(ts.createIdentifier(name))
  );
}

function createJsxOpeningFragment() {
  const node = ts.createNode(ts.SyntaxKind.JsxOpeningFragment);
  return node as ts.JsxOpeningFragment;
}

function createJsxClosingFragment() {
  const node = ts.createNode(ts.SyntaxKind.JsxClosingFragment);
  return node as ts.JsxClosingFragment;
}

export function neptuneToJs(data: any) {
  return tsNodesToString([createFunctionalComponent(data.components[0])]);
}

export default function gatsbyJsLoader(source: string) {
  console.log("Inside gatsby-js-loader");
  console.log(source);

  const data = JSON.parse(source);

  const result = neptuneToJs(data);

  return `
import React from "react"
import styles from "style-loader!css-loader?modules=true!gatsby-plugin-neptune/dist/css-loader?modules!./NewProject.neptune"

${result}
`;
}
