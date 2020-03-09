import * as T from "../types";
import { set } from "../helpers/immutable-map";
import {
  isComponentLayer,
  findLayerById,
  canHaveChildren,
  updateLayer,
  getComponentOrThrow
} from "../layerUtils";
import uuid from "uuid/v4";
import { makeLayer, makeDefaultProject } from "../factories";

function replaceComponent(
  refs: T.Refs,
  componentId: string,
  update: (component: T.Component) => Partial<T.Component>
): T.Refs {
  const component = getComponentOrThrow(componentId, refs);
  return {
    ...refs,
    components: set(refs.components, componentId, {
      ...component,
      ...update(component)
    })
  };
}

function replaceLayer<TLayer extends T.Layer>(
  refs: T.Refs,
  componentId: string,
  layerId: string,
  update: (layer: TLayer) => Partial<TLayer>
) {
  return replaceComponent(refs, componentId, component => {
    if (component.layout == null) {
      throw new Error("Cannot replace layer if component.layout is null");
    }
    const layer = findLayerById(component.layout, layerId);
    if (layer == null) {
      throw new Error("Layer not found");
    }
    return {
      ...component,
      layout: updateLayer(component.layout, {
        ...layer,
        ...update(layer as TLayer)
      })
    };
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

export function addComponentProp(action: T.AddComponentProp, refs: T.Refs) {
  return replaceComponent(refs, action.componentId, c => ({
    props: [...c.props, { name: action.prop, type: "text" }]
  }));
}

export function editComponentProp(action: T.EditComponentProp, refs: T.Refs) {
  return {
    ...refs,
    components: new Map(
      Array.from(refs.components.entries()).map(([componentId, component]) => {
        if (componentId === action.componentId) {
          return [
            componentId,
            renamePropertyFromComponent(
              component,
              action.oldProp,
              action.newProp
            )
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
    )
  };
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
) {
  return {
    ...refs,
    components: new Map<string, T.Component>(
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
    )
  };
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
  return replaceComponent(refs, action.componentId, c => ({
    name: action.name
  }));
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
    console.log("root is undefined");
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
    console.log("Insert child");
    return updateLayer(root, {
      ...selectedLayer,
      children: [...selectedLayer.children].concat(newLayer)
    });
  }
}

export function addLayerAction(action: T.AddLayer, refs: T.Refs) {
  const result = replaceComponent(refs, action.componentId, component => {
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
  return {
    ...result,
    selectedLayerId: action.layerId
  };
}

function deleteLayer(
  root: T.Layer,
  layerIdToDelete: string
): T.Layer | undefined {
  if (root.id === layerIdToDelete) {
    return undefined;
  }

  if (!canHaveChildren(root)) {
    return root;
  }

  return {
    ...root,
    children: root.children
      .map(child => deleteLayer(child, layerIdToDelete))
      .filter(x => x !== undefined) as T.Layer[]
  };
}

function deleteLayerAction(action: T.DeleteLayer, refs: T.Refs) {
  const result = replaceComponent(refs, action.componentId, component => {
    return {
      ...component,
      layout: deleteLayer(component.layout!, action.layerId)
    };
  });

  const component = getComponentOrThrow(action.componentId, result);

  return {
    ...result,
    selectedLayerId: component.layout ? component.layout.id : undefined
  };
}

function selectLayer(action: T.SelectLayer, refs: T.Refs) {
  return {
    ...refs,
    selectedLayerId: action.layerId
  };
}

function renameLayer(action: T.RenameLayer, refs: T.Refs) {
  const result = replaceComponent(refs, action.componentId, component => {
    const layer = findLayerById(component.layout!, action.layerId);

    if (!layer) {
      throw new Error(`Layer with id ${action.layerId} not found in root`);
    }

    return {
      ...component,
      layout: updateLayer(component.layout, {
        ...layer,
        name: action.name
      })
    };
  });
  return {
    ...result,
    selectedLayerId: action.layerId
  };
}

function moveLayer(
  root: T.Layer,
  layerId: string,
  parentId: string,
  position: number
) {
  const layerToMove = findLayerById(root, layerId);
  if (layerToMove == null) {
    throw new Error(
      `Tried to move layer with id ${layerId} but it was not found in the tree`
    );
  }
  const tmp = deleteLayer(root, layerToMove.id);
  if (!tmp) {
    throw new Error(
      "Temporary layer after delete should exist. If not, the root has been deleted"
    );
  }
  return insertLayer(tmp, layerToMove, parentId, position);
}

function insertLayer(
  root: T.Layer,
  toInsert: T.Layer,
  parentId: string,
  position: number
): T.Layer {
  if (canHaveChildren(root)) {
    if (root.id === parentId) {
      return {
        ...root,
        children: root.children
          .slice(0, position)
          .concat([toInsert])
          .concat(root.children.slice(position))
      };
    }

    return {
      ...root,
      children: root.children.map(child =>
        insertLayer(child, toInsert, parentId, position)
      )
    };
  }

  if (root.id === parentId) {
    throw new Error("A layer can only be inserted inside a container");
  }

  return root;
}

function moveLayerAction(action: T.MoveLayer, refs: T.Refs) {
  return replaceComponent(refs, action.componentId, component => {
    return {
      ...component,
      layout: moveLayer(
        component.layout!,
        action.layerId,
        action.parentId,
        action.position
      )
    };
  });
}

function updateLayerPropHandler(action: T.UpdateLayerProp, refs: T.Refs) {
  return replaceLayer(refs, action.componentId, action.layerId, layer => {
    return {
      props: { ...layer.props, [action.name]: action.value }
    };
  });
}

function initProjectHandler(action: T.InitProject, refs: T.Refs) {
  return action.refs;
}

export default function applyAction(
  actionsStack: T.Action[],
  action: T.Action,
  refs: T.Refs
): T.Refs {
  actionsStack.push(action);
  switch (action.type) {
    case "initProject":
      return initProjectHandler(action, refs);
    case "addComponentProp":
      return addComponentProp(action, refs);
    case "editComponentProp":
      return editComponentProp(action, refs);
    case "deleteComponentProp":
      return deleteComponentProp(action, refs);
    case "renameComponent":
      return renameComponent(action, refs);
    case "addComponentExample":
      return addComponentExample(action, refs);
    case "deleteComponentExample":
      return deleteComponentExample(action, refs);
    case "updateComponentExampleProp":
      return updateComponentExampleProp(action, refs);
    case "addLayer":
      return addLayerAction(action, refs);
    case "deleteLayer":
      return deleteLayerAction(action, refs);
    case "selectLayer":
      return selectLayer(action, refs);
    case "renameLayer":
      return renameLayer(action, refs);
    case "moveLayer":
      return moveLayerAction(action, refs);
    case "updateLayerProp":
      return updateLayerPropHandler(action, refs);
  }
}

export function undo(actionsStack: T.Action[]) {
  const newStack: T.Action[] = [];
  actionsStack.pop();
  return actionsStack.reduce((newRefs, action) => {
    return applyAction(newStack, action, newRefs);
  }, makeDefaultProject());
}

export function applyActions(
  actionsStack: T.Action[],
  actions: T.Action[],
  currentRefs: T.Refs
) {
  return actions.reduce((newRefs, action) => {
    return applyAction(actionsStack, action, newRefs);
  }, currentRefs);
}

type LayerVisitor = <T extends T.Layer>(layer: T) => T;
