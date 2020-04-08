import ts from "typescript";
import * as T from "./types";
import { kebabToCamel } from "./utils";

export function createSimpleJsxElement(
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

export function createJsxOpeningFragment() {
  const node = ts.createNode(ts.SyntaxKind.JsxOpeningFragment);
  return node as ts.JsxOpeningFragment;
}

export function createJsxClosingFragment() {
  const node = ts.createNode(ts.SyntaxKind.JsxClosingFragment);
  return node as ts.JsxClosingFragment;
}

export function createStringAttributeJsx(
  attributeName: string,
  stringLiteral: string
) {
  return ts.createJsxAttribute(
    ts.createIdentifier(attributeName),
    ts.createJsxExpression(undefined, ts.createStringLiteral(stringLiteral))
  );
}

export function createComponentPropsDestructuration(component: T.Component) {
  if (component.props.length === 0) {
    return [];
  }

  return [
    ts.createParameter(
      undefined,
      undefined,
      undefined,
      ts.createObjectBindingPattern(
        component.props.map((prop) => {
          return ts.createBindingElement(
            undefined,
            undefined,
            ts.createIdentifier(kebabToCamel(prop.name)),
            undefined
          );
        })
      ),
      undefined,
      undefined,
      undefined
    ),
  ];
}

function layerPropNameToJsxAttributeName(prop: string) {
  if (prop === "content") {
    return "children";
  }
  return prop;
}

function componentLayerAttributeMap(
  layer: T.ComponentLayer,
  components: T.ComponentMap
) {
  const component = components.get(layer.componentId);
  if (component == null) {
    throw new Error(`Component with id ("${layer.componentId}") not found`);
  }
  const map = new Map();
  for (let prop in layer.props) {
    const componentProp = component.props.find(
      (componentProp) => componentProp.name === prop
    );
    if (componentProp == null) {
      throw new Error(`Component prop with id ("${prop}") not found`);
    }
    map.set(
      layerPropNameToJsxAttributeName(kebabToCamel(componentProp.name)),
      ts.createStringLiteral(layer.props[prop])
    );
  }
  return map;
}

function propValueToAttributeValue(
  layerType: T.LayerType,
  name: string,
  value: string
) {
  if (layerType === "image" && name === "src") {
    if (value.startsWith("http")) {
      return ts.createStringLiteral(value);
    }
    return ts.createCall(ts.createIdentifier("require"), undefined, [
      ts.createStringLiteral(value),
    ]);
  }

  return ts.createStringLiteral(value);
}

function createSimpleAttributeMap(
  layer: T.Layer,
  components: T.ComponentMap
): Map<string, ts.Expression> {
  switch (layer.type) {
    case "container":
      return new Map();
    case "component":
      return componentLayerAttributeMap(layer, components);
    case "text":
    case "link":
    case "image":
      return new Map(
        Object.entries(layer.props)
          .filter(([propName, value]) => value != null)
          .map(([propName, value]) => {
            return [
              layerPropNameToJsxAttributeName(propName),
              propValueToAttributeValue(layer.type, propName, value),
            ];
          })
      );
  }
}

export function createLayerPropertiesJsx(
  component: T.Component,
  layer: T.Layer,
  components: T.ComponentMap
): ts.JsxAttribute[] {
  const attributesMap = createSimpleAttributeMap(layer, components);

  for (let prop in layer.bindings) {
    const propName = layer.bindings[prop].propName;

    const componentProp = component.props.find((p) => p.name === propName);
    if (componentProp == null) {
      throw new Error(`Prop (${propName}) not found`);
    }
    attributesMap.set(
      layerPropNameToJsxAttributeName(kebabToCamel(prop)),
      ts.createIdentifier(kebabToCamel(componentProp.name))
    );
  }

  return Array.from(attributesMap.entries()).map(([attrName, node]) => {
    return ts.createJsxAttribute(
      ts.createIdentifier(attrName),
      ts.createJsxExpression(undefined, node)
    );
  });
}
