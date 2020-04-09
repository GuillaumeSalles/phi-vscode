import ts from "typescript";
import * as T from "@phijs/shared";
import {
  assertUnreachable,
  createSimpleJsxElement,
  kebabToPascal,
  createComponentPropsDestructuration,
  layerTreeToArray,
  layerToCss,
  createLayerPropertiesJsx,
} from "@phijs/shared";

function createLayerJsx(
  component: T.Component,
  componentName: string,
  layer: T.Layer,
  components: T.ComponentMap,
  layerJsxProperties: ts.JsxAttribute[]
) {
  if (layer.type === "component") {
    return createSimpleJsxElement(
      kebabToPascal(components.get(layer.componentId)!.name),
      [...layerJsxProperties]
    );
  }

  return createSimpleJsxElement(
    layer.tag,
    [
      ts.createJsxAttribute(
        ts.createIdentifier("className"),
        ts.createStringLiteral(`${componentName}-${layer.name}`)
      ),
      ...layerJsxProperties,
    ],
    createLayerChildrenJsx(component, componentName, layer, components)
  );
}

function createLayerChildrenJsx(
  component: T.Component,
  componentName: string,
  layer: T.Layer,
  components: T.ComponentMap
): ts.JsxChild[] {
  switch (layer.type) {
    case "text":
    case "component":
    case "image":
      return [];
    case "link":
    case "container":
      return layer.children.map((child) =>
        createLayerJsx(
          component,
          componentName,
          child,
          components,
          createLayerPropertiesJsx(component, child, components)
        )
      );
  }
  assertUnreachable(layer);
}

function createComponentJsx(component: T.Component, refs: T.Refs) {
  return ts.createFunctionDeclaration(
    undefined,
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    kebabToPascal(component.name),
    undefined,
    createComponentPropsDestructuration(component),
    undefined,
    ts.createBlock([
      ts.createReturn(
        ts.createJsxFragment(
          ts.createJsxOpeningFragment(),
          [
            createLayerJsx(
              component,
              T.kebabToPascal(component.name),
              component.layout!,
              refs.components,
              T.createLayerPropertiesJsx(
                component,
                component.layout!,
                refs.components
              )
            ),
            T.createSimpleJsxElement(
              "style",
              [
                ts.createJsxAttribute(
                  ts.createIdentifier("jsx"),
                  ts.createJsxExpression(undefined, ts.createTrue())
                ),
              ],
              [
                ts.createJsxExpression(
                  undefined,
                  ts.createNoSubstitutionTemplateLiteral(
                    layerTreeToArray(component.layout)
                      .map((layer) =>
                        layerToCss(kebabToPascal(component.name), layer, refs)
                      )
                      .join("\n\n")
                  )
                ),
              ]
            ),
          ],
          ts.createJsxJsxClosingFragment()
        )
      ),
    ])
  );
}

export function phiToJs(data: any) {
  const refs = T.jsonToRefs(data) as T.Refs;

  return T.tsNodesToString(
    Array.from(refs.components.values())
      .filter((c) => c.layout != null)
      .map((c) => createComponentJsx(c, refs))
  );
}

export default function loader(source: string) {
  const data = JSON.parse(source);
  const code = phiToJs(data);

  return `
import React from "react"

${code}
`;
}
