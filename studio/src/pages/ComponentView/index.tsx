/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { column, mainPadding, heading, row, colors } from "../../styles";
import * as T from "../../types";
import { filterComponentsWhenLayer } from "../../refsUtil";
import Component from "./Component";
// import SettingsEditor from "./SettingsEditor";
import SecondaryButton from "../../components/SecondaryButton";
import { useState } from "react";
import LayersTree from "../../components/LayersTree";
import LayerEditor from "./Editors/LayerEditor";
import HtmlEditor from "./Editors/HtmlEditor";
import { Layout } from "../../components/Layout";
import TopBar from "../../components/TopBar";
import ComponentProps from "./ComponentProps";
import { findLayerById, updateLayer } from "../../layerUtils";
import { useStateWithGetter, useWarningDialog } from "../../hooks";
import HtmlLayerBindings from "./Editors/HtmlLayerBindings";
import OkCancelModal from "../../components/OkCancelModal";
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";
import { Delete, Edit } from "../../icons";
import {
  useStringFormEntry,
  useDialogForm,
  FormInput
} from "../../components/Form";
import { validateRefName } from "../../validators";

const tabStyle = css({
  display: "flex",
  flex: "1 1 auto",
  fontSize: "14px",
  background: "white",
  justifyContent: "center",
  alignItems: "center",
  border: "none",
  cursor: "pointer",
  color: "rgb(136, 136, 136)",
  ":focus": {
    outline: "none",
    background: "#F6F6F6"
  }
});

const selectedTabStyle = css(tabStyle, {
  borderBottom: `solid 2px ${colors.primary}`,
  color: "black"
});

type Props = {
  menu: React.ReactNode;
  componentId: string;
  onComponentChange: (id: string, component: T.Component) => void;
  onDelete: (id: string) => void;
  refs: T.Refs;
  applyAction: (action: T.Action) => void;
};

function ComponentView({
  menu,
  componentId,
  onComponentChange,
  refs,
  onDelete,
  applyAction
}: Props) {
  const component = refs.components.get(componentId)!;

  const nameEntry = useStringFormEntry("", value =>
    validateRefName(value, componentId, refs.components, "Components")
  );
  const renameComponentDialog = useDialogForm([nameEntry], () => {
    applyAction({
      type: "renameComponent",
      componentId,
      name: nameEntry.value
    });
  });

  const componentsThatUseCurrentComponent = filterComponentsWhenLayer(
    refs,
    l => l.type === "component" && l.componentId === componentId
  );
  const deleteRefDialog = useWarningDialog(
    `Can't delete component ${component.name}`,
    `${component.name} is used by ${componentsThatUseCurrentComponent
      .map(c => `"${c.name}"`)
      .join(", ")}.`
  );

  const [layerId, setLayerId] = useStateWithGetter<string | undefined>(() =>
    component.layout ? component.layout.id : undefined
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingHTML, setIsEditingHTML] = useState(true);
  const selectedLayer =
    component.layout && layerId
      ? findLayerById(component.layout, layerId)
      : undefined;

  function updateComponentLayer(newLayer: T.Layer) {
    const newComponent = {
      ...component,
      layout: updateLayer(component.layout, newLayer)
    };
    setLayerId(newLayer.id);
    onComponentChange(componentId, newComponent);
  }

  function updateComponentRootLayer(newLayer: T.Layer | undefined) {
    const newComponent = {
      ...component,
      layout: newLayer
    };
    setLayerId(newLayer ? newLayer.id : undefined);
    onComponentChange(componentId, newComponent);
  }

  return (
    <Layout
      topBar={
        <div css={[row]}>
          <TopBar fileName={refs.fileName} isSaved={refs.isSaved} />
          {/* <SettingsEditor refs={refs} applyAction={applyAction} /> */}
        </div>
      }
      left={
        isEditing ? (
          <>
            <LayersTree
              root={component.layout}
              onSelectLayer={setLayerId}
              selectedLayerId={layerId}
              onLayerChange={updateComponentRootLayer}
              refs={refs}
            />
            <ComponentProps
              component={component}
              componentId={componentId}
              applyAction={applyAction}
            />
          </>
        ) : (
          menu
        )
      }
      center={
        <div css={[column, mainPadding, { flex: "1 1 auto" }]}>
          <div css={[row, { marginBottom: "20px", alignItems: "flex-end" }]}>
            <h1 css={heading}>{component.name}</h1>
            <div css={[row, { marginLeft: "28px" }]}>
              {isEditing ? (
                <React.Fragment>
                  <Button
                    margin="0 12px 0 0"
                    text="Rename"
                    onClick={() => {
                      renameComponentDialog.open();
                      nameEntry.setValue(component.name);
                    }}
                  />
                  <Button text="Done" onClick={() => setIsEditing(false)} />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <IconButton
                    cssOverrides={{ marginRight: "12px" }}
                    icon={<Edit height={20} width={20} />}
                    onClick={() => setIsEditing(true)}
                  />
                  <IconButton
                    icon={<Delete height={20} width={20} />}
                    onClick={() => {
                      if (componentsThatUseCurrentComponent.length === 0) {
                        onDelete(componentId);
                      } else {
                        deleteRefDialog.open();
                      }
                    }}
                  />
                </React.Fragment>
              )}
            </div>
          </div>
          <Component component={component} refs={refs} />
          <OkCancelModal
            {...deleteRefDialog.dialogProps}
            buttons={<Button text="Ok" {...deleteRefDialog.okProps} />}
          />
          <OkCancelModal
            title="Rename component"
            {...renameComponentDialog.dialogProps}
            buttons={
              <React.Fragment>
                <SecondaryButton
                  text="Cancel"
                  {...renameComponentDialog.cancelButtonProps}
                />
                <Button text="Add" {...renameComponentDialog.okButtonProps} />
              </React.Fragment>
            }
            form={
              <React.Fragment>
                <FormInput
                  placeholder="Name your component"
                  {...nameEntry.inputProps}
                />
              </React.Fragment>
            }
          />
        </div>
      }
      right={
        isEditing && selectedLayer ? (
          <div
            css={[
              column,
              {
                flexShrink: 0,
                width: "268px",
                minWidth: "268px",
                background: colors.sideBarBackground,
                height: "100%"
              }
            ]}
          >
            <div
              css={[
                row,
                {
                  flex: "0 0 auto",
                  height: "40px",
                  alignItems: "stretch",
                  borderBottom: "solid 1px #DDD"
                }
              ]}
            >
              <button
                css={isEditingHTML ? selectedTabStyle : tabStyle}
                onClick={() => setIsEditingHTML(true)}
              >
                HTML
              </button>
              <button
                css={isEditingHTML ? tabStyle : selectedTabStyle}
                onClick={() => setIsEditingHTML(false)}
              >
                CSS
              </button>
            </div>
            {isEditingHTML ? (
              <>
                <HtmlEditor
                  component={component}
                  layer={selectedLayer}
                  onChange={updateComponentLayer}
                  refs={refs}
                />
                <HtmlLayerBindings
                  component={component}
                  layer={selectedLayer}
                  refs={refs}
                  bindings={selectedLayer.bindings}
                  onChange={bindings =>
                    updateComponentLayer({ ...selectedLayer, bindings })
                  }
                />
              </>
            ) : (
              <LayerEditor
                layer={selectedLayer}
                refs={refs}
                onChange={updateComponentLayer}
              />
            )}
          </div>
        ) : null
      }
    />
  );
}

export default ComponentView;
