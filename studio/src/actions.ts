import * as T from "./types";
import { set } from "./helpers/immutable-map";
import { isComponentLayer } from "./layerUtils";
import uuid from "uuid/v4";

function renameKey(
  obj: { [key: string]: any },
  oldKey: string,
  newKey: string
) {
  const newObject: any = {};
  for (let key in obj) {
    if (key === oldKey) {
      newObject[newKey] = obj[key];
    } else {
      newObject[key] = obj[key];
    }
  }
  return newObject;
}

function getComponentOrThrow(componentId: string, refs: T.Refs): T.Component {
  const component = refs.components.get(componentId);
  if (component == null) {
    throw new Error(`Component with id (${componentId}) not found`);
  }
  return component;
}

function replaceComponent(
  refs: T.Refs,
  componentId: string,
  update: (component: T.Component) => Partial<T.Component>
): T.ComponentMap {
  const component = getComponentOrThrow(componentId, refs);
  return set(refs.components, componentId, {
    ...component,
    ...update(component)
  });
}

function visitLayer(root: T.Layer, visitor: LayerVisitor): T.Layer {
  switch (root.type) {
    case "container":
    case "link":
      return {
        ...visitor(root),
        children: root.children.map(child => visitLayer(child, visitor))
      };
    default:
      return visitor(root);
  }
}

export function addComponentProp(
  action: T.AddComponentProp,
  refs: T.Refs
): T.ComponentMap {
  return replaceComponent(refs, action.componentId, c => ({
    props: [...c.props, { name: action.prop, type: "text" }]
  }));
}

export function editComponentProp(
  action: T.EditComponentProp,
  refs: T.Refs
): T.ComponentMap {
  return new Map(
    Array.from(refs.components.entries()).map(([componentId, component]) => {
      if (componentId === action.componentId) {
        return [
          componentId,
          renamePropertyFromComponent(component, action.oldProp, action.newProp)
        ] as [string, T.Component];
      }

      return [
        componentId,
        renamePropertyFromComponentLayer(
          component,
          action.componentId,
          action.oldProp,
          action.newProp
        )
      ] as [string, T.Component];
    })
  );
}

function renamePropertyFromComponent(
  component: T.Component,
  oldProp: string,
  newProp: string
): T.Component {
  const newComponent: T.Component = {
    ...component,
    props: component.props.map(prop =>
      prop.name === oldProp ? { name: newProp, type: prop.type } : prop
    ),
    examples: component.examples.map(example =>
      renameExampleProp(example, oldProp, newProp)
    )
  };
  if (component.layout) {
    newComponent.layout = visitLayer(component.layout, layer =>
      renameAllBindingsThatUseProp(layer, oldProp, newProp)
    );
  }
  return newComponent;
}

function renameExampleProp(
  example: T.ComponentExample,
  oldProp: string,
  newProp: string
) {
  return {
    ...example,
    props: renameKey(example.props, oldProp, newProp)
  };
}

function renameAllBindingsThatUseProp<T extends T.Layer>(
  layer: T,
  oldProp: string,
  newProp: string
): T {
  if (
    Object.values(layer.bindings).some(binding => binding.propName === oldProp)
  ) {
    return {
      ...layer,
      bindings: Object.entries(layer.bindings).reduce(
        (newBindings, [prop, binding]) => {
          if (binding.propName === oldProp) {
            newBindings[newProp] = binding;
          } else {
            newBindings[prop] = binding;
          }
          return newBindings;
        },
        {} as T.Bindings
      )
    };
  }
  return layer;
}

function renamePropertyFromComponentLayer(
  component: T.Component,
  childComponentId: string,
  oldProp: string,
  newProp: string
): T.Component {
  if (component.layout == null) {
    return component;
  }

  return {
    ...component,
    layout: visitLayer(component.layout, layer => {
      if (isComponentLayer(layer) && layer.componentId === childComponentId) {
        return {
          ...layer,
          props: renameKey(layer.props, oldProp, newProp)
        };
      }
      return layer;
    })
  };
}

export function deleteComponentProp(
  action: T.DeleteComponentProp,
  refs: T.Refs
): T.ComponentMap {
  return new Map(
    Array.from(refs.components.entries()).map(([componentId, component]) => {
      if (componentId === action.componentId) {
        return [
          componentId,
          deletePropertyFromComponent(component, action.prop)
        ] as [string, T.Component];
      }

      return [
        componentId,
        deletePropertyFromComponentLayer(
          component,
          action.componentId,
          action.prop
        )
      ] as [string, T.Component];
    })
  );
}

function deletePropertyFromComponent(
  component: T.Component,
  propName: string
): T.Component {
  const newComponent = {
    ...component,
    props: component.props.filter(prop => prop.name !== propName)
  };
  if (component.layout) {
    newComponent.layout = visitLayer(component.layout, layer =>
      deleteAllBindingsThatUseProp(layer, propName)
    );
  }
  return newComponent;
}

function deletePropertyFromComponentLayer(
  component: T.Component,
  childComponentId: string,
  propName: string
): T.Component {
  if (component.layout == null) {
    return component;
  }

  return {
    ...component,
    layout: visitLayer(component.layout, layer => {
      if (isComponentLayer(layer) && layer.componentId === childComponentId) {
        const { [propName]: unusedProp, ...props } = layer.props;
        const { [propName]: unusedBinding, ...bindings } = layer.bindings;
        return {
          ...layer,
          props,
          bindings
        };
      }
      return layer;
    })
  };
}

function deleteAllBindingsThatUseProp<T extends T.Layer>(
  layer: T,
  propName: string
): T {
  if (
    Object.values(layer.bindings).some(binding => binding.propName === propName)
  ) {
    return {
      ...layer,
      bindings: Object.entries(layer.bindings).reduce(
        (newBindings, [prop, binding]) => {
          if (binding.propName !== propName) {
            newBindings[prop] = binding;
          }
          return newBindings;
        },
        {} as T.Bindings
      )
    };
  }
  return layer;
}

export function renameComponent(action: T.RenameComponent, refs: T.Refs) {
  const component = getComponentOrThrow(action.componentId, refs);
  return set(refs.components, action.componentId, {
    ...component,
    name: action.name
  });
}

export function addComponentExample(
  action: T.AddComponentExample,
  refs: T.Refs
) {
  return replaceComponent(refs, action.componentId, c => ({
    examples: c.examples.concat([{ props: {}, name: action.name, id: uuid() }])
  }));
}

export function deleteComponentExample(
  action: T.DeleteComponentExample,
  refs: T.Refs
) {
  return replaceComponent(refs, action.componentId, c => ({
    examples: c.examples.filter(e => e.id !== action.id)
  }));
}

export function updateComponentExampleProp(
  action: T.UpdateComponentExampleProp,
  refs: T.Refs
) {
  return replaceComponent(refs, action.componentId, c => ({
    examples: c.examples.map(example =>
      example.id === action.exampleId
        ? {
            ...example,
            props: {
              ...example.props,
              [action.prop]: action.value
            }
          }
        : example
    )
  }));
}

type LayerVisitor = <T extends T.Layer>(layer: T) => T;
