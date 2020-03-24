import * as T from "../types";
import { set, del, firstKey } from "../helpers/immutable-map";
import {
  isComponentLayer,
  findLayerById,
  canHaveChildren,
  updateLayer,
  getComponentOrThrow,
  findLayerByIdWithParent
} from "../layerUtils";
import uuid from "uuid/v4";
import { makeLayer } from "../factories";
import { uiStateComponentOrThrow } from "../refsUtil";

function goToFirstComponentOrDefault(components: T.ComponentMap): T.UIState {
  return components.size === 0
    ? { type: "typography" }
    : {
        type: "component",
        componentId: firstKey(components),
        isEditing: false,
        layerEditorMode: "html"
      };
}

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

export function addComponentPropHandler(
  action: T.AddComponentProp,
  refs: T.Refs
) {
  return replaceComponent(refs, action.componentId, c => ({
    props: [...c.props, { name: action.prop, type: "text" }]
  }));
}

export function editComponentPropHandler(
  action: T.EditComponentProp,
  refs: T.Refs
) {
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

export function deleteComponentPropHandler(
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

export function renameComponentHandler(
  action: T.RenameComponent,
  refs: T.Refs
) {
  return replaceComponent(refs, action.componentId, c => ({
    name: action.name
  }));
}

export function deleteComponentHandler(
  action: T.DeleteComponent,
  refs: T.Refs
): T.Refs {
  const components = del(refs.components, action.componentId);
  return {
    ...refs,
    components,
    uiState: goToFirstComponentOrDefault(components)
  };
}

export function addComponentExampleHandler(
  action: T.AddComponentExample,
  refs: T.Refs
) {
  return replaceComponent(refs, action.componentId, c => ({
    examples: c.examples.concat([{ props: {}, name: action.name, id: uuid() }])
  }));
}

export function deleteComponentExampleHandler(
  action: T.DeleteComponentExample,
  refs: T.Refs
) {
  return replaceComponent(refs, action.componentId, c => ({
    examples: c.examples.filter(e => e.id !== action.id)
  }));
}

export function updateComponentExamplePropHandler(
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

  const { layer, parent } = findLayerByIdWithParent(root, selectedLayerId);

  if (!layer) {
    throw new Error(`Layer with id ${selectedLayerId} not found in root`);
  }

  if (canHaveChildren(layer)) {
    return updateLayer(root, {
      ...layer,
      children: [...layer.children].concat(newLayer)
    });
  }

  if (parent) {
    return updateLayer(root, {
      ...parent,
      children: [...parent.children].concat(newLayer)
    });
  }
}

export function addLayerActionHandler(
  action: T.AddLayer,
  refs: T.Refs
): T.Refs {
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
    uiState: {
      ...uiStateComponentOrThrow(refs),
      layerId: action.layerId
    }
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

function deleteComponentLayer(
  refs: T.Refs,
  componentId: string,
  layerId: string
) {
  const result = replaceComponent(refs, componentId, component => {
    return {
      ...component,
      layout: deleteLayer(component.layout!, layerId)
    };
  });

  return {
    ...result,
    uiState: {
      ...uiStateComponentOrThrow(refs),
      layerId: undefined
    }
  };
}

function deleteLayerActionHandler(action: T.DeleteLayer, refs: T.Refs): T.Refs {
  return deleteComponentLayer(refs, action.componentId, action.layerId);
}

function selectLayerHandler(action: T.SelectLayer, refs: T.Refs): T.Refs {
  return {
    ...refs,
    uiState: {
      ...uiStateComponentOrThrow(refs),
      layerId: action.layerId
    }
  };
}

function renameLayerHandler(action: T.RenameLayer, refs: T.Refs): T.Refs {
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

  const uiState = uiStateComponentOrThrow(refs);

  return {
    ...result,
    uiState: {
      ...uiState,
      componentId: action.componentId,
      layerId: action.layerId
    }
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

function moveLayerActionHandler(action: T.MoveLayer, refs: T.Refs) {
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

function updateLayerTagHandler(action: T.UpdateLayerTag, refs: T.Refs) {
  return replaceLayer(refs, action.componentId, action.layerId, layer => {
    if (layer.type !== "text") {
      throw new Error(
        "Replace tag value is only supported for text layer for now"
      );
    }
    return {
      tag: action.tag
    };
  });
}

function updateLayerBindingHandler(action: T.UpdateLayerBinding, refs: T.Refs) {
  return replaceLayer(refs, action.componentId, action.layerId, layer => {
    return {
      bindings: {
        ...layer.bindings,
        [action.layerProp]: { propName: action.componentProp }
      }
    };
  });
}

function deleteLayerBindingHandler(action: T.DeleteLayerBinding, refs: T.Refs) {
  return replaceLayer(refs, action.componentId, action.layerId, layer => {
    const { [action.layerProp]: unusedValue, ...newBindings } = layer.bindings;
    return {
      bindings: newBindings
    };
  });
}

function addComponentHandler(action: T.AddComponent, refs: T.Refs): T.Refs {
  return {
    ...refs,
    components: set(refs.components, action.componentId, {
      name: action.name,
      props: [],
      examples: []
    }),
    uiState: {
      type: "component",
      componentId: action.componentId,
      isEditing: true,
      layerEditorMode: "html"
    }
  };
}

function initProjectHandler(action: T.InitProject, refs: T.Refs): T.Refs {
  return {
    ...action.refs,
    uiState: goToFirstComponentOrDefault(action.refs.components)
  };
}

function goToHandler(action: T.GoTo, refs: T.Refs) {
  return {
    ...refs,
    uiState: action.to
  };
}

function updateLayerStyleHandler(action: T.UpdateLayerStyle, refs: T.Refs) {
  return replaceLayer(refs, action.componentId, action.layerId, layer => {
    if (action.mediaQueryId == null) {
      return {
        style: { ...layer.style, ...action.style }
      };
    }
    return {
      mediaQueries: layer.mediaQueries.map(mq =>
        mq.id === action.mediaQueryId
          ? {
              ...mq,
              style: { ...mq.style, ...action.style }
            }
          : mq
      )
    };
  });
}

function addMediaQueryHandler(action: T.AddMediaQuery, refs: T.Refs) {
  return replaceLayer(refs, action.componentId, action.layerId, layer => {
    return {
      mediaQueries: [
        ...layer.mediaQueries,
        {
          id: action.mediaQueryId,
          minWidth: { type: "ref", id: action.breakpointId },
          style: { ...layer.style }
        }
      ]
    };
  });
}

function updateRefHandler(action: T.UpdateRef, refs: T.Refs): T.Refs {
  return {
    ...refs,
    [action.refType]: set(refs[action.refType], action.refId, action.newRef)
  };
}

function deleteRefHandler(action: T.DeleteRef, refs: T.Refs): T.Refs {
  return {
    ...refs,
    [action.refType]: del(
      refs[action.refType] as Map<string, any>,
      action.refId
    )
  };
}

function editComponentHandler(action: T.EditComponent, refs: T.Refs): T.Refs {
  if (refs.uiState.type !== "component") {
    throw new Error(`uiState.type should be "component" to start editing it`);
  }
  const component = getComponentOrThrow(refs.uiState.componentId, refs);

  return {
    ...refs,
    uiState: {
      ...refs.uiState,
      isEditing: true,
      layerId: component.layout?.id
    }
  };
}

function stopEditComponentHandler(
  action: T.StopEditComponent,
  refs: T.Refs
): T.Refs {
  if (refs.uiState.type !== "component") {
    throw new Error(`uiState.type should be "component" to start editing it`);
  }
  return {
    ...refs,
    uiState: {
      ...refs.uiState,
      layerId: undefined,
      isEditing: false
    }
  };
}

function setLayerEditorModeHandler(
  action: T.SetLayerEditorMode,
  refs: T.Refs
): T.Refs {
  return {
    ...refs,
    uiState: {
      ...uiStateComponentOrThrow(refs),
      layerEditorMode: action.mode
    }
  };
}

function hoverLayerHandler(action: T.HoverLayer, refs: T.Refs): T.Refs {
  return {
    ...refs,
    uiState: {
      ...uiStateComponentOrThrow(refs),
      hoveredLayerId: action.layerId
    }
  };
}

function handleBackspaceShortcut(refs: T.Refs) {
  if (
    refs.uiState.type === "component" &&
    refs.uiState.layerId &&
    refs.uiState.isEditing
  ) {
    return deleteComponentLayer(
      refs,
      refs.uiState.componentId,
      refs.uiState.layerId
    );
  }

  return refs;
}

function moveChildPositionUp(
  refs: T.Refs,
  componentId: string,
  layer: T.Layer,
  parent: T.ParentLayer
) {
  const childIndex = parent.children.indexOf(layer);

  if (childIndex === 0) {
    return refs;
  }

  return replaceComponent(refs, componentId, component => {
    return {
      layout: moveLayer(component.layout!, layer.id, parent.id, childIndex - 1)
    };
  });
}

function moveChildPositionDown(
  refs: T.Refs,
  componentId: string,
  layer: T.Layer,
  parent: T.ParentLayer
) {
  const childIndex = parent.children.indexOf(layer);

  if (childIndex === parent.children.length - 1) {
    return refs;
  }

  return replaceComponent(refs, componentId, component => {
    return {
      layout: moveLayer(component.layout!, layer.id, parent.id, childIndex + 1)
    };
  });
}

function handleArrowShortcut(
  refs: T.Refs,
  key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"
): T.Refs {
  if (
    refs.uiState.type !== "component" ||
    refs.uiState.layerId == null ||
    refs.uiState.isEditing === false
  ) {
    return refs;
  }

  const component = getComponentOrThrow(refs.uiState.componentId, refs);
  if (component.layout == null) {
    return refs;
  }
  const { layer, parent } = findLayerByIdWithParent(
    component.layout,
    refs.uiState.layerId
  );

  if (layer == null || parent == null) {
    return refs;
  }

  if (
    parent.type === "container" &&
    parent.style.display !== "flex" &&
    // Container default display is flex
    parent.style.display != null
  ) {
    return refs;
  }

  if (parent.type === "link" && parent.style.display !== "flex") {
    return refs;
  }

  // TODO: handle style with media query
  const dir = parent.style.flexDirection;

  if (
    (dir === "column" && key === "ArrowUp") ||
    (dir === "row" && key === "ArrowLeft") ||
    (dir === "column-reverse" && key === "ArrowDown") ||
    (dir === "row-reverse" && key === "ArrowRight")
  ) {
    return moveChildPositionUp(refs, refs.uiState.componentId, layer, parent);
  }

  if (
    (dir === "column" && key === "ArrowDown") ||
    (dir === "row" && key === "ArrowRight") ||
    (dir === "column-reverse" && key === "ArrowUp") ||
    (dir === "row-reverse" && key === "ArrowLeft")
  ) {
    return moveChildPositionDown(refs, refs.uiState.componentId, layer, parent);
  }

  return refs;
}

function globalShortcutActionHandler(
  action: T.GlobalShortcutAction,
  refs: T.Refs
): T.Refs {
  switch (action.key) {
    case "Backspace":
      return handleBackspaceShortcut(refs);
    case "ArrowUp":
    case "ArrowRight":
    case "ArrowDown":
    case "ArrowLeft":
      return handleArrowShortcut(refs, action.key);
    default:
      return refs;
  }
}

export default function applyAction(action: T.Action, refs: T.Refs): T.Refs {
  switch (action.type) {
    case "goTo":
      return goToHandler(action, refs);
    case "globalShortcutAction":
      return globalShortcutActionHandler(action, refs);
    case "initProject":
      return initProjectHandler(action, refs);
    case "addComponentProp":
      return addComponentPropHandler(action, refs);
    case "editComponentProp":
      return editComponentPropHandler(action, refs);
    case "deleteComponentProp":
      return deleteComponentPropHandler(action, refs);
    case "renameComponent":
      return renameComponentHandler(action, refs);
    case "addComponent":
      return addComponentHandler(action, refs);
    case "deleteComponent":
      return deleteComponentHandler(action, refs);
    case "addComponentExample":
      return addComponentExampleHandler(action, refs);
    case "deleteComponentExample":
      return deleteComponentExampleHandler(action, refs);
    case "updateComponentExampleProp":
      return updateComponentExamplePropHandler(action, refs);
    case "addLayer":
      return addLayerActionHandler(action, refs);
    case "deleteLayer":
      return deleteLayerActionHandler(action, refs);
    case "selectLayer":
      return selectLayerHandler(action, refs);
    case "renameLayer":
      return renameLayerHandler(action, refs);
    case "moveLayer":
      return moveLayerActionHandler(action, refs);
    case "updateLayerProp":
      return updateLayerPropHandler(action, refs);
    case "updateLayerTag":
      return updateLayerTagHandler(action, refs);
    case "updateLayerBinding":
      return updateLayerBindingHandler(action, refs);
    case "deleteLayerBinding":
      return deleteLayerBindingHandler(action, refs);
    case "updateLayerStyle":
      return updateLayerStyleHandler(action, refs);
    case "addMediaQuery":
      return addMediaQueryHandler(action, refs);
    case "updateRef":
      return updateRefHandler(action, refs);
    case "deleteRef":
      return deleteRefHandler(action, refs);
    case "editComponent":
      return editComponentHandler(action, refs);
    case "stopEditComponent":
      return stopEditComponentHandler(action, refs);
    case "setLayerEditorMode":
      return setLayerEditorModeHandler(action, refs);
    case "hoverLayer":
      return hoverLayerHandler(action, refs);
  }
}

type LayerVisitor = <T extends T.Layer>(layer: T) => T;
