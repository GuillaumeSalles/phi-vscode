import * as T from "./types";
import { set } from "./helpers/immutable-map";
import {
  isComponentLayer,
  findLayerById,
  canHaveChildren,
  updateLayer
} from "./layerUtils";
import uuid from "uuid/v4";
import { makeLayer } from "./factories";

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
        ];
      }

      return [
        componentId,
        renamePropertyFromComponentLayer(
          component,
          action.componentId,
          action.oldProp,
          action.newProp
        )
      ];
    })
  );
}

function renamePropertyFromComponent(
  component: T.Component,
  oldProp: string,
  newProp: string
): T.Component {
  const newComponent = {
    ...component,
    props: component.props.map(prop =>
      prop.name === oldProp ? { name: newProp, type: prop.type } : prop
    )
  };
  if (component.layout) {
    newComponent.layout = visitLayer(component.layout, layer =>
      renameAllBindingsThatUseProp(layer, oldProp, newProp)
    );
  }
  return newComponent;
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
        const props = {
          ...layer.props
        };
        const propValue = props[oldProp];
        delete props[oldProp];
        props[newProp] = propValue;

        const bindings = {
          ...layer.bindings
        };
        const bindingValue = bindings[oldProp];
        delete bindings[oldProp];
        bindings[newProp] = bindingValue;
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
        ];
      }

      return [
        componentId,
        deletePropertyFromComponentLayer(
          component,
          action.componentId,
          action.prop
        )
      ];
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

function addLayer(
  root: T.Layer | undefined,
  selectedLayerId: string | undefined,
  newLayer: T.Layer
): T.Layer | undefined {
  if (!root) {
    return newLayer;
  }

  if (!selectedLayerId) {
    return;
  }

  const selectedLayer = findLayerById(root, selectedLayerId);

  if (!selectedLayer) {
    throw new Error(`Layer with id ${selectedLayerId} not found in root`);
  }

  if (canHaveChildren(selectedLayer)) {
    return updateLayer(root, {
      ...selectedLayer,
      children: [...selectedLayer.children].concat(newLayer)
    });
  }
}

export function addLayerAction(action: T.AddLayer, refs: T.Refs) {
  return replaceComponent(refs, action.componentId, component => {
    const newLayer = makeLayer(
      action.layerId,
      action.layerType,
      component.layout,
      refs,
      action.layerComponentId
    );
    return {
      ...component,
      layout: addLayer(component.layout, action.parentLayerId, newLayer)
    };
  });
}

export default function applyAction(action: T.Action, refs: T.Refs) {
  switch (action.type) {
    case "addComponentProp":
      return addComponentProp(action, refs);
      break;
    case "editComponentProp":
      return editComponentProp(action, refs);
      break;
    case "deleteComponentProp":
      return deleteComponentProp(action, refs);
      break;
    case "renameComponent":
      return renameComponent(action, refs);
      break;
    case "addComponentExample":
      return addComponentExample(action, refs);
      break;
    case "deleteComponentExample":
      return deleteComponentExample(action, refs);
      break;
    case "updateComponentExampleProp":
      return updateComponentExampleProp(action, refs);
      break;
    case "addLayer":
      return addLayerAction(action, refs);
  }
}

type LayerVisitor = <T extends T.Layer>(layer: T) => T;
