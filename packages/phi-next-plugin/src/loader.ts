import ts from "typescript";
import * as T from "@phi/shared";

function createLayerJsx(
  component: T.Component,
  componentName: string,
  layer: T.Layer,
  components: T.ComponentMap,
  layerJsxProperties: ts.JsxAttribute[]
) {
  if (layer.type === "component") {
    return T.createSimpleJsxElement(
      T.kebabToPascal(components.get(layer.componentId)!.name),
      [...layerJsxProperties]
    );
  }
  return T.createSimpleJsxElement(
    layer.tag,
    [
      ts.createJsxAttribute(
        ts.createIdentifier("className"),
        ts.createStringLiteral(`${componentName}-${layer.name}`)
      ),
      ...layerJsxProperties
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
      return layer.children.map(child =>
        createLayerJsx(
          component,
          componentName,
          child,
          components,
          T.createLayerPropertiesJsx(component, layer, components)
        )
      );
  }
  T.assertUnreachable(layer);
}

function createComponentJsx(component: T.Component, refs: T.Refs) {
  return ts.createFunctionDeclaration(
    undefined,
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    T.kebabToPascal(component.name),
    undefined,
    T.createComponentPropsDestructuration(component),
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
                )
              ],
              [
                ts.createJsxExpression(
                  undefined,
                  ts.createNoSubstitutionTemplateLiteral(
                    T.layerTreeToArray(component.layout)
                      .map(layer =>
                        T.layerToCss(
                          T.kebabToPascal(component.name),
                          layer,
                          refs
                        )
                      )
                      .join("\n\n")
                  )
                )
              ]
            )
          ],
          ts.createJsxJsxClosingFragment()
        )
      )
    ])
  );
}

export function phiToJs(data: any) {
  const refs = T.jsonToRefs(data) as T.Refs;

  return T.tsNodesToString(
    Array.from(refs.components.values())
      .filter(c => c.layout != null)
      .map(c => createComponentJsx(c, refs))
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
